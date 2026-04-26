from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PharmacyViewSet

router = DefaultRouter()
router.register(r'', PharmacyViewSet, basename='pharmacy')

app_name = 'pharmacies'

urlpatterns = [
    path('', include(router.urls)),
]
