from rest_framework import serializers
from .models import Medicine, MedicineCategory


class MedicineCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicineCategory
        fields = ['id', 'name', 'description', 'created_at', 'updated_at']


class MedicineSerializer(serializers.ModelSerializer):
    category = MedicineCategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=MedicineCategory.objects.all(),
        write_only=True,
        source='category',
        required=False
    )

    class Meta:
        model = Medicine
        fields = ['id', 'name', 'generic_name', 'category', 'category_id', 'description', 
                  'strength', 'unit', 'manufacturer', 'is_active', 'created_at', 'updated_at']


class MedicineListSerializer(serializers.ModelSerializer):
    """Simplified medicine serializer for list views."""
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Medicine
        fields = ['id', 'name', 'generic_name', 'category_name', 'strength', 'unit', 'manufacturer', 'is_active']
