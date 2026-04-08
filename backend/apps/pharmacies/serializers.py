from rest_framework import serializers
from .models import Pharmacy, PharmacyWorkingHour
from apps.locations.serializers import SectorDetailSerializer
from apps.insurance.serializers import InsuranceProviderSerializer


class PharmacyWorkingHourSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = PharmacyWorkingHour
        fields = ['id', 'day_of_week', 'day_display', 'opening_time', 'closing_time', 'is_closed']


class PharmacySerializer(serializers.ModelSerializer):
    sector = SectorDetailSerializer(read_only=True)
    sector_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('apps.locations.models', fromlist=['Sector']).Sector.objects.all(),
        write_only=True,
        source='sector',
        required=False
    )
    insurance_providers = InsuranceProviderSerializer(many=True, read_only=True)
    insurance_provider_ids = serializers.PrimaryKeyRelatedField(
        queryset=__import__('apps.insurance.models', fromlist=['InsuranceProvider']).InsuranceProvider.objects.all(),
        write_only=True,
        many=True,
        source='insurance_providers',
        required=False
    )
    current_status = serializers.SerializerMethodField()
    working_hours = PharmacyWorkingHourSerializer(many=True, read_only=True)
    
    class Meta:
        model = Pharmacy
        fields = ['id', 'name', 'description', 'logo', 'sector', 'sector_id', 'street_address', 
                  'latitude', 'longitude', 'phone_number', 'email', 'insurance_providers',
                  'insurance_provider_ids', 'opening_time', 'closing_time', 'is_active',
                  'current_status', 'working_hours', 'created_at', 'updated_at']
    
    def get_current_status(self, obj):
        return obj.get_current_status()


class PharmacyListSerializer(serializers.ModelSerializer):
    """Simplified pharmacy serializer for list views."""
    sector_name = serializers.CharField(source='sector.name', read_only=True)
    district_name = serializers.CharField(source='sector.district.name', read_only=True)
    current_status = serializers.SerializerMethodField()
    insurance_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Pharmacy
        fields = ['id', 'name', 'logo', 'phone_number', 'sector_name', 'district_name', 
                  'opening_time', 'closing_time', 'is_active', 'current_status', 'insurance_count']
    
    def get_current_status(self, obj):
        return obj.get_current_status()
    
    def get_insurance_count(self, obj):
        return obj.insurance_providers.count()
