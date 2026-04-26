import math
from decimal import Decimal, InvalidOperation

from django.db.models import Q
from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.response import Response

from .models import Stock, StockMovement
from .serializers import StockListSerializer, StockMovementSerializer, StockSerializer


def _haversine_km(lat1, lon1, lat2, lon2):
    """Great-circle distance in kilometres (WGS84 sphere approximation)."""
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlmb = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dlmb / 2) ** 2
    return 2 * r * math.asin(min(1.0, math.sqrt(a)))


class StockViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing medicine stock/inventory.
    - List all stock (with search, filter, and pagination)
    - Create, retrieve, update, delete stock records
    """
    queryset = Stock.objects.select_related(
        'pharmacy__sector__district__province', 'medicine'
    ).prefetch_related('movements')
    serializer_class = StockSerializer
    pagination_class = None
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ['medicine__name', 'pharmacy__name']
    ordering_fields = ['medicine__name', 'pharmacy__name', 'quantity', 'last_updated']
    ordering = ['-last_updated']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return StockListSerializer
        return StockSerializer

    def create(self, request, *args, **kwargs):
        pharmacy_id = request.data.get('pharmacy_id')
        medicine_id = request.data.get('medicine_id')
        if pharmacy_id and medicine_id:
            existing = Stock.objects.filter(
                pharmacy_id=pharmacy_id, medicine_id=medicine_id
            ).first()
            if existing:
                try:
                    add_qty = int(request.data.get('quantity', 0) or 0)
                except (TypeError, ValueError):
                    add_qty = 0
                existing.quantity = max(0, existing.quantity + add_qty)
                if request.data.get('price') not in (None, ''):
                    try:
                        existing.price = Decimal(str(request.data['price']))
                    except (InvalidOperation, TypeError, ValueError):
                        pass
                ed = request.data.get('expiry_date')
                if ed:
                    existing.expiry_date = ed
                existing.is_in_stock = existing.quantity > 0
                existing.save()
                serializer = self.get_serializer(existing)
                return Response(serializer.data, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)

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
        """Pharmacies that currently have this medicine in stock (quantity > 0, not expired)."""
        medicine_id = request.query_params.get('medicine_id')
        district_id = request.query_params.get('district_id')
        sector_id = request.query_params.get('sector_id')
        user_lat = request.query_params.get('lat') or request.query_params.get('user_lat')
        user_lng = request.query_params.get('lng') or request.query_params.get('user_lng')

        if not medicine_id:
            return Response({'detail': 'medicine_id parameter required'}, status=400)

        today = timezone.now().date()
        queryset = (
            self.get_queryset()
            .filter(
                medicine_id=medicine_id,
                is_in_stock=True,
                quantity__gt=0,
                pharmacy__is_active=True,
            )
            .filter(Q(expiry_date__isnull=True) | Q(expiry_date__gte=today))
        )

        if district_id:
            queryset = queryset.filter(pharmacy__sector__district_id=district_id)

        if sector_id:
            queryset = queryset.filter(pharmacy__sector_id=sector_id)

        lat_u = lng_u = None
        try:
            if user_lat is not None and user_lng is not None and str(user_lat) != '' and str(user_lng) != '':
                lat_u = float(user_lat)
                lng_u = float(user_lng)
        except (TypeError, ValueError):
            lat_u = lng_u = None

        rows = []
        for stock in queryset:
            data = dict(StockListSerializer(stock).data)
            data['distance_km'] = None
            if lat_u is not None and lng_u is not None:
                plat, plng = stock.pharmacy.latitude, stock.pharmacy.longitude
                if plat is not None and plng is not None:
                    data['distance_km'] = round(
                        _haversine_km(lat_u, lng_u, float(plat), float(plng)), 2
                    )
            rows.append(data)

        if lat_u is not None:
            rows.sort(
                key=lambda d: (
                    d['distance_km'] is None,
                    d['distance_km'] if d['distance_km'] is not None else 1e9,
                )
            )

        return Response(rows)
    
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
