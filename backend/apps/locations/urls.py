from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProvinceViewSet, DistrictViewSet, SectorViewSet

router = DefaultRouter()
router.register(r'provinces', ProvinceViewSet, basename='province')
router.register(r'districts', DistrictViewSet, basename='district')
router.register(r'sectors', SectorViewSet, basename='sector')

app_name = 'locations'

urlpatterns = [
    path('', include(router.urls)),
]
