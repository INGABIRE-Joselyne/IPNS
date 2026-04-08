from rest_framework import status
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.authtoken.models import Token

from .serializers import PharmacyRegistrationSerializer, LoginSerializer, UserSerializer


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
