from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from apps.pharmacies.models import Pharmacy
from apps.locations.models import Sector
from apps.common.models import UserProfile


class PharmacyRegistrationSerializer(serializers.Serializer):
    """Serializer for pharmacy registration."""
    # User credentials
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    
    # Pharmacy information
    pharmacy_name = serializers.CharField(max_length=200)
    phone_number = serializers.CharField(max_length=20)
    logo = serializers.ImageField(required=False, allow_null=True)
    
    # Location
    sector_id = serializers.IntegerField()
    street_address = serializers.CharField(max_length=255, required=False, allow_blank=True)
    
    # Operating hours
    opening_time = serializers.TimeField()
    closing_time = serializers.TimeField()
    
    # Insurance partnerships
    insurance_ids = serializers.ListField(
        child=serializers.IntegerField(),
        required=False,
        default=list
    )
    
    def create(self, validated_data):
        """Create a new pharmacy and associated user."""
        # Extract user-related fields
        email = validated_data.pop('email')
        password = validated_data.pop('password')
        
        # Extract pharmacy-related fields
        pharmacy_name = validated_data.pop('pharmacy_name')
        phone_number = validated_data.pop('phone_number')
        sector_id = validated_data.pop('sector_id')
        insurance_ids = validated_data.pop('insurance_ids', [])
        logo = validated_data.pop('logo', None)
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )
        
        # Create user profile with pharmacist role
        UserProfile.objects.create(user=user, role='pharmacist')
        
        # Create pharmacy
        sector = Sector.objects.get(id=sector_id)
        pharmacy = Pharmacy.objects.create(
            user=user,
            name=pharmacy_name,
            phone_number=phone_number,
            email=email,
            sector=sector,
            logo=logo,
            **validated_data
        )
        
        # Add insurance providers
        if insurance_ids:
            pharmacy.insurance_providers.set(insurance_ids)
        
        # Create token
        token, _ = Token.objects.get_or_create(user=user)
        
        return {
            'user': user,
            'pharmacy': pharmacy,
            'token': token.key
        }


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        """Validate credentials and return user with token."""
        email = data['email']
        password = data['password']
        
        try:
            user = User.objects.get(email=email)
            if not user.check_password(password):
                raise serializers.ValidationError("Invalid credentials")
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")
        
        token, _ = Token.objects.get_or_create(user=user)
        data['user'] = user
        data['token'] = token.key
        return data


class UserSerializer(serializers.ModelSerializer):
    """Serializer for user information."""
    pharmacy = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'pharmacy']
    
    def get_pharmacy(self, obj):
        """Get pharmacy for this user."""
        try:
            pharmacy = obj.pharmacy
            return {
                'id': pharmacy.id,
                'name': pharmacy.name,
                'phone_number': pharmacy.phone_number,
                'email': pharmacy.email,
                'opening_time': pharmacy.opening_time,
                'closing_time': pharmacy.closing_time,
                'is_active': pharmacy.is_active
            }
        except Pharmacy.DoesNotExist:
            return None
    
    def get_role(self, obj):
        """Get user role from UserProfile."""
        try:
            return obj.profile.role
        except:
            return 'pharmacist'  # Default role
