from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.mail import send_mail
from django.conf import settings
from apps.common.models import UserProfile
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from apps.common.permissions import IsAdminRole

from .serializers import (
    AdminCreateUserSerializer,
    AdminUserUpdateSerializer,
    LoginSerializer,
    PharmacyRegistrationSerializer,
    UserSerializer,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def pharmacy_register(request):
    """
    Register a new pharmacy.
    
    POST /api/v1/auth/register/
    {
        "email": "pharmacy@example.com",
        "password": "securepassword123",
        "pharmacy_name": "Central Pharmacy",
        "phone_number": "+250788123456",
        "sector_id": 1,
        "street_address": "123 Main St",
        "opening_time": "08:00:00",
        "closing_time": "20:00:00",
        "insurance_ids": [1, 2]
    }
    """
    serializer = PharmacyRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        result = serializer.save()
        user_serializer = UserSerializer(result['user'])
        return Response({
            'success': True,
            'message': 'Pharmacy registered successfully',
            'data': {
                'user': user_serializer.data,
                'pharmacy': {
                    'id': result['pharmacy'].id,
                    'name': result['pharmacy'].name
                },
                'token': result['token']
            }
        }, status=status.HTTP_201_CREATED)
    
    return Response({
        'success': False,
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login with email and password.
    
    POST /api/v1/auth/login/
    {
        "email": "pharmacy@example.com",
        "password": "securepassword123"
    }
    """
    serializer = LoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        user_serializer = UserSerializer(user)
        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': user_serializer.data,
                'token': serializer.validated_data['token']
            }
        }, status=status.HTTP_200_OK)
    
    return Response({
        'success': False,
        'message': 'Invalid credentials',
        'errors': serializer.errors
    }, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Get current authenticated user information.
    
    GET /api/v1/auth/user/
    Headers: Authorization: Token <token>
    """
    serializer = UserSerializer(request.user)
    return Response({
        'success': True,
        'data': serializer.data
    }, status=status.HTTP_200_OK)


class AdminUserViewSet(viewsets.ModelViewSet):
    """
    Admin-only user management: list, create, partial update (role), delete.
    """

    queryset = User.objects.all().select_related('profile').order_by('-date_joined')
    permission_classes = [IsAuthenticated, IsAdminRole]
    pagination_class = None
    http_method_names = ['get', 'post', 'patch', 'delete', 'head', 'options']

    def get_serializer_class(self):
        if self.action == 'create':
            return AdminCreateUserSerializer
        if self.action == 'partial_update':
            return AdminUserUpdateSerializer
        return UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = AdminCreateUserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = AdminUserUpdateSerializer(data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        new_role = serializer.validated_data.get('role')
        if new_role is None:
            return Response(
                {'role': ['This field is required.']},
                status=status.HTTP_400_BAD_REQUEST,
            )
        if instance.id == request.user.id and new_role != 'admin':
            return Response(
                {'detail': 'You cannot remove your own admin role.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        UserProfile.objects.update_or_create(
            user=instance,
            defaults={'role': new_role},
        )
        instance.refresh_from_db()
        if hasattr(instance, 'profile'):
            instance.profile.refresh_from_db()
        return Response(UserSerializer(instance).data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.id == request.user.id:
            return Response(
                {'detail': 'You cannot delete your own account.'},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return super().destroy(request, *args, **kwargs)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_request(request):
    email = request.data.get('email', '').strip()
    if not email:
        return Response({'success': False, 'message': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:5173')
        reset_link = f"{frontend_url}/reset-password?uid={uid}&token={token}"
        send_mail(
            subject='IPNS — Password Reset Request',
            message=(
                f"Hello,\n\nYou requested a password reset.\n\n"
                f"Click the link below to reset your password:\n{reset_link}\n\n"
                f"This link expires in 24 hours.\n\n"
                f"If you did not request this, ignore this email.\n\n— IPNS Team"
            ),
            from_email=getattr(settings, 'DEFAULT_FROM_EMAIL', 'noreply@ipns.rw'),
            recipient_list=[email],
            fail_silently=False,
        )
    except User.DoesNotExist:
        pass

    return Response({
        'success': True,
        'message': 'If an account with that email exists, a reset link has been sent.'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def password_reset_confirm(request):
    uid = request.data.get('uid', '')
    token = request.data.get('token', '')
    new_password = request.data.get('new_password', '')

    if not uid or not token or not new_password:
        return Response({'success': False, 'message': 'uid, token and new_password are required.'}, status=status.HTTP_400_BAD_REQUEST)

    if len(new_password) < 8:
        return Response({'success': False, 'message': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user_id = force_str(urlsafe_base64_decode(uid))
        user = User.objects.get(pk=user_id)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        return Response({'success': False, 'message': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

    if not default_token_generator.check_token(user, token):
        return Response({'success': False, 'message': 'Reset link is invalid or has expired.'}, status=status.HTTP_400_BAD_REQUEST)

    user.set_password(new_password)
    user.save()
    Token.objects.filter(user=user).delete()

    return Response({'success': True, 'message': 'Password reset successfully. Please log in.'}, status=status.HTTP_200_OK)
