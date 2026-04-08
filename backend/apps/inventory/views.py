from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.filters import SearchFilter, OrderingFilter

from .models import Stock, StockMovement
from .serializers import StockSerializer, StockListSerializer, StockMovementSerializer


class StockViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing medicine stock/inventory.
    - List all stock (with search, filter, and pagination)
    - Create, retrieve, update, delete stock records
    """
    queryset = Stock.objects.select_related(
        'pharmacy__sector__district', 'medicine'
    ).prefetch_related('movements')
    serializer_class = StockSerializer
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['medicine__name', 'pharmacy__name']
    ordering_fields = ['medicine__name', 'pharmacy__name', 'quantity', 'last_updated']
    ordering = ['-last_updated']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StockListSerializer
        return StockSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by pharmacy
        pharmacy_id = self.request.query_params.get('pharmacy_id')
        if pharmacy_id:
            queryset = queryset.filter(pharmacy_id=pharmacy_id)
        
        # Filter by medicine
        medicine_id = self.request.query_params.get('medicine_id')
        if medicine_id:
            queryset = queryset.filter(medicine_id=medicine_id)
        
        # Filter by district
        district_id = self.request.query_params.get('district_id')
        if district_id:
            queryset = queryset.filter(pharmacy__sector__district_id=district_id)
        
        # Filter by in-stock status
        is_in_stock = self.request.query_params.get('is_in_stock')
        if is_in_stock is not None:
            queryset = queryset.filter(is_in_stock=is_in_stock.lower() == 'true')
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def by_pharmacy(self, request):
        """Get all stock for a specific pharmacy."""
        pharmacy_id = request.query_params.get('pharmacy_id')
        if not pharmacy_id:
            return Response({'detail': 'pharmacy_id parameter required'}, status=400)
        
        stocks = self.get_queryset().filter(pharmacy_id=pharmacy_id)
        serializer = StockListSerializer(stocks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search_medicine(self, request):
        """Search for a specific medicine across all pharmacies."""
        medicine_id = request.query_params.get('medicine_id')
        district_id = request.query_params.get('district_id')
        
        if not medicine_id:
            return Response({'detail': 'medicine_id parameter required'}, status=400)
        
        queryset = self.get_queryset().filter(medicine_id=medicine_id, is_in_stock=True)
        
        if district_id:
            queryset = queryset.filter(pharmacy__sector__district_id=district_id)
        
        serializer = StockListSerializer(queryset, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """Get all out-of-stock medicines."""
        stocks = self.get_queryset().filter(is_in_stock=False)
        serializer = StockListSerializer(stocks, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def expired(self, request):
        """Get all expired medicines."""
        all_stocks = self.get_queryset()
        expired_stocks = [stock for stock in all_stocks if stock.is_expired]
        serializer = StockListSerializer(expired_stocks, many=True)
        return Response(serializer.data)


class StockMovementViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for viewing stock movements (audit log).
    Read-only access to stock movement history.
    """
    queryset = StockMovement.objects.select_related('stock', 'created_by')
    serializer_class = StockMovementSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['created_at']
    ordering = ['-created_at']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by stock
        stock_id = self.request.query_params.get('stock_id')
        if stock_id:
            queryset = queryset.filter(stock_id=stock_id)
        
        # Filter by movement type
        movement_type = self.request.query_params.get('movement_type')
        if movement_type:
            queryset = queryset.filter(movement_type=movement_type)
        
        return queryset
