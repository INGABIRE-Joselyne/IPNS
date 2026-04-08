from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import InsuranceProviderViewSet

router = DefaultRouter()
router.register(r'providers', InsuranceProviderViewSet, basename='insurance-provider')

app_name = 'insurance'

urlpatterns = [
    path('', include(router.urls)),
]
