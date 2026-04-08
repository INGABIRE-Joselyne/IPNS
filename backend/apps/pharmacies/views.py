from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Pharmacy
from .serializers import PharmacySerializer, PharmacyListSerializer


class PharmacyViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing pharmacies.
    - List all pharmacies (with search, filter, and pagination)
    - Create, retrieve, update, delete a pharmacy
    """
    queryset = Pharmacy.objects.select_related('sector__district__province').prefetch_related('insurance_providers')
    serializer_class = PharmacySerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'phone_number', 'email']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']
    permission_classes = [AllowAny]  # Explicitly allow all by default
    
    def get_serializer_class(self):
        if self.action == 'list':
            return PharmacyListSerializer
        return PharmacySerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by sector
        sector_id = self.request.query_params.get('sector_id')
        if sector_id:
            queryset = queryset.filter(sector_id=sector_id)
        
        # Filter by district
        district_id = self.request.query_params.get('district_id')
        if district_id:
            queryset = queryset.filter(sector__district_id=district_id)
        
        # Filter by insurance provider
        insurance_id = self.request.query_params.get('insurance_id')
        if insurance_id:
            queryset = queryset.filter(insurance_providers__id=insurance_id)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset
    
    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def profile(self, request):
        """Get the current authenticated user's pharmacy profile."""
        try:
            pharmacy = request.user.pharmacy
            serializer = PharmacySerializer(pharmacy)
            return Response(serializer.data)
        except Pharmacy.DoesNotExist:
            return Response(
                {'detail': 'No pharmacy found for this user'},
                status=status.HTTP_404_NOT_FOUND
            )
    
    @action(detail=False, methods=['get'])
    def by_district(self, request):
        """Get all pharmacies in a specific district."""
        district_id = request.query_params.get('district_id')
        if not district_id:
            return Response({'detail': 'district_id parameter required'}, status=400)
        
        pharmacies = self.get_queryset().filter(sector__district_id=district_id)
        serializer = PharmacyListSerializer(pharmacies, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def open_now(self, request):
        """Get all currently open pharmacies."""
        pharmacies = []
        for pharmacy in self.get_queryset():
            if pharmacy.get_current_status() == 'open':
                pharmacies.append(pharmacy)
        
        serializer = PharmacyListSerializer(pharmacies, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Get the current status of a specific pharmacy."""
        pharmacy = self.get_object()
        return Response({
            'id': pharmacy.id,
            'name': pharmacy.name,
            'status': pharmacy.get_current_status(),
            'opening_time': pharmacy.opening_time,
            'closing_time': pharmacy.closing_time,
        })
