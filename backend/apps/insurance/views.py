from rest_framework import viewsets
from .models import InsuranceProvider
from .serializers import InsuranceProviderSerializer


class InsuranceProviderViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing insurance providers.
    - List all insurance providers
    - Create, retrieve, update, delete an insurance provider
    - Filter by active status
    """
    queryset = InsuranceProvider.objects.all()
    serializer_class = InsuranceProviderSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        return queryset
