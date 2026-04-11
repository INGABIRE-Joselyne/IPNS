from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from apps.common.permissions import IsAdminRole

from .models import Medicine, MedicineCategory
from .serializers import (
    MedicineSerializer,
    MedicineListSerializer,
    MedicineCategorySerializer
)


class MedicineCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing medicine categories.
    - List/retrieve: public
    - Create, update, delete: admin only
    """
    queryset = MedicineCategory.objects.all()
    serializer_class = MedicineCategorySerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method in ('GET', 'HEAD', 'OPTIONS'):
            return [AllowAny()]
        return [IsAuthenticated(), IsAdminRole()]


class MedicineViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing medicines.
    - List all medicines (with search, filter, and pagination)
    - Create, retrieve, update, delete a medicine

    Unpaginated list so pharmacists and admins can search the full national catalog.
    """
    queryset = Medicine.objects.select_related('category')
    serializer_class = MedicineSerializer
    pagination_class = None
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['name', 'generic_name', 'manufacturer']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'list':
            return MedicineListSerializer
        return MedicineSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == 'true')
        
        return queryset

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search medicines by name, generic name, or manufacturer.
        Query parameters: q or search (alias)
        """
        search_term = (
            request.query_params.get('q', '').strip()
            or request.query_params.get('search', '').strip()
        )
        if not search_term:
            return Response({'detail': 'Search term required (use q or search)'}, status=400)

        medicines = (
            Medicine.objects.filter(is_active=True)
            .filter(
                Q(name__icontains=search_term)
                | Q(generic_name__icontains=search_term)
                | Q(manufacturer__icontains=search_term)
            )
            .distinct()
            .order_by('name')[:200]
        )
        serializer = MedicineListSerializer(medicines, many=True)
        return Response(serializer.data)
