from rest_framework import serializers
from .models import InsuranceProvider


class InsuranceProviderSerializer(serializers.ModelSerializer):
    class Meta:
        model = InsuranceProvider
        fields = ['id', 'name', 'code', 'description', 'contact_email', 'contact_phone', 'is_active', 'created_at', 'updated_at']
