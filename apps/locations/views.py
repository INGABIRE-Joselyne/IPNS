from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status

from .models import Province, District, Sector
from .serializers import (
    ProvinceSerializer, 
    DistrictSerializer, 
    SectorSerializer,
    SectorDetailSerializer
)


class ProvinceViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing provinces.
    - List all provinces
    - Create, retrieve, update, delete a province
    """
    queryset = Province.objects.all()
    serializer_class = ProvinceSerializer

    @action(detail=True, methods=['get'])
    def districts(self, request, pk=None):
        """Get all districts for a specific province."""
        province = self.get_object()
        districts = province.districts.all()
        serializer = DistrictSerializer(districts, many=True)
        return Response(serializer.data)


class DistrictViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing districts.
    - List all districts (with optional filtering by province)
    - Create, retrieve, update, delete a district
    """
    queryset = District.objects.select_related('province')
    serializer_class = DistrictSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        province_id = self.request.query_params.get('province')
        if province_id:
            queryset = queryset.filter(province_id=province_id)
        return queryset

    @action(detail=True, methods=['get'])
    def sectors(self, request, pk=None):
        """Get all sectors for a specific district."""
        district = self.get_object()
        sectors = district.sectors.all()
        serializer = SectorDetailSerializer(sectors, many=True)
        return Response(serializer.data)


class SectorViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing sectors.
    - List all sectors (with optional filtering by district)
    - Create, retrieve, update, delete a sector
    """
    queryset = Sector.objects.select_related('district', 'district__province')
    serializer_class = SectorDetailSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        district_id = self.request.query_params.get('district')
        if district_id:
            queryset = queryset.filter(district_id=district_id)
        return queryset
