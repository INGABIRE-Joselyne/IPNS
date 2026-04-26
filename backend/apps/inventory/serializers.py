from rest_framework import serializers
from .models import Stock, StockMovement
from apps.medicines.serializers import MedicineListSerializer
from apps.pharmacies.serializers import PharmacyListSerializer


class StockMovementSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    movement_type_display = serializers.CharField(source='get_movement_type_display', read_only=True)
    
    class Meta:
        model = StockMovement
        fields = ['id', 'movement_type', 'movement_type_display', 'quantity_change', 
                  'reason', 'created_by_username', 'created_at']


class StockSerializer(serializers.ModelSerializer):
    medicine = MedicineListSerializer(read_only=True)
    medicine_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('apps.medicines.models', fromlist=['Medicine']).Medicine.objects.all(),
        write_only=True,
        source='medicine'
    )
    pharmacy = PharmacyListSerializer(read_only=True)
    pharmacy_id = serializers.PrimaryKeyRelatedField(
        queryset=__import__('apps.pharmacies.models', fromlist=['Pharmacy']).Pharmacy.objects.all(),
        write_only=True,
        source='pharmacy'
    )
    is_expired = serializers.SerializerMethodField()
    movements = StockMovementSerializer(many=True, read_only=True)
    
    class Meta:
        model = Stock
        fields = ['id', 'pharmacy', 'pharmacy_id', 'medicine', 'medicine_id', 
                  'quantity', 'price', 'expiry_date', 'is_in_stock', 'is_expired',
                  'movements', 'created_at', 'last_updated']
    
    def get_is_expired(self, obj):
        return obj.is_expired


class StockListSerializer(serializers.ModelSerializer):
    """Simplified stock serializer for list views."""
    medicine_name = serializers.CharField(source='medicine.name', read_only=True)
    generic_name = serializers.CharField(source='medicine.generic_name', read_only=True)
    pharmacy_id = serializers.IntegerField(source='pharmacy.id', read_only=True)
    pharmacy_name = serializers.CharField(source='pharmacy.name', read_only=True)
    pharmacy_logo = serializers.ImageField(source='pharmacy.logo', read_only=True)
    street_address = serializers.CharField(source='pharmacy.street_address', read_only=True)
    phone_number = serializers.CharField(source='pharmacy.phone_number', read_only=True)
    latitude = serializers.FloatField(source='pharmacy.latitude', read_only=True)
    longitude = serializers.FloatField(source='pharmacy.longitude', read_only=True)
    sector_name = serializers.SerializerMethodField()
    district_name = serializers.SerializerMethodField()
    province_name = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Stock
        fields = [
            'id', 'medicine_name', 'generic_name', 'pharmacy_id', 'pharmacy_name', 'pharmacy_logo',
            'street_address', 'phone_number', 'latitude', 'longitude',
            'sector_name', 'district_name', 'province_name',
            'quantity', 'price', 'is_in_stock', 'is_expired', 'last_updated',
        ]

    def get_sector_name(self, obj):
        try:
            return obj.pharmacy.sector.name
        except Exception:
            return None

    def get_district_name(self, obj):
        try:
            return obj.pharmacy.sector.district.name
        except Exception:
            return None

    def get_province_name(self, obj):
        try:
            return obj.pharmacy.sector.district.province.name
        except Exception:
            return None
    
    def get_is_expired(self, obj):
        return obj.is_expired
