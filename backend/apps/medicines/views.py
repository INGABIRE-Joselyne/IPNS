from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Medicine, MedicineCategory
from .serializers import (
    MedicineSerializer,
    MedicineListSerializer,
    MedicineCategorySerializer
)


class MedicineCategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing medicine categories.
    - List all categories
    - Create, retrieve, update, delete a category
    """
    queryset = MedicineCategory.objects.all()
    serializer_class = MedicineCategorySerializer


class MedicineViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing medicines.
    - List all medicines (with search, filter, and pagination)
    - Create, retrieve, update, delete a medicine
    """
    queryset = Medicine.objects.select_related('category')
    serializer_class = MedicineSerializer
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
        Search medicines by name or generic name.
        Query parameter: q (search term)
        """
        search_term = request.query_params.get('q', '')
        if not search_term:
            return Response({'detail': 'Search term required'}, status=400)
        
        medicines = Medicine.objects.filter(
            name__icontains=search_term
        ) | Medicine.objects.filter(
            generic_name__icontains=search_term
        )
        serializer = MedicineListSerializer(medicines[:20], many=True)
        return Response(serializer.data)
