from rest_framework import serializers
from .models import Province, District, Sector


class ProvinceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Province
        fields = ['id', 'name', 'code', 'created_at', 'updated_at']


class SectorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sector
        fields = ['id', 'name', 'code', 'created_at', 'updated_at']


class DistrictSerializer(serializers.ModelSerializer):
    province = ProvinceSerializer(read_only=True)
    province_id = serializers.PrimaryKeyRelatedField(
        queryset=Province.objects.all(),
        write_only=True,
        source='province'
    )
    sectors = SectorSerializer(many=True, read_only=True)

    class Meta:
        model = District
        fields = ['id', 'name', 'code', 'province', 'province_id', 'sectors', 'created_at', 'updated_at']


class DistrictSimpleSerializer(serializers.ModelSerializer):
    """Simplified district serializer without province details."""
    class Meta:
        model = District
        fields = ['id', 'name', 'code']


class SectorDetailSerializer(serializers.ModelSerializer):
    district = DistrictSimpleSerializer(read_only=True)

    class Meta:
        model = Sector
        fields = ['id', 'name', 'code', 'district', 'created_at', 'updated_at']
