"""
Main API URL configuration for IPNS.
"""
import rest_framework.urlpatterns
from django.urls import path, include

# Monkey patch to prevent ValueError when registering suffix converter multiple times
original_register = rest_framework.urlpatterns.register_converter

def patched_register(converter, name):
    try:
        original_register(converter, name)
    except ValueError:
        pass  # Already registered

rest_framework.urlpatterns.register_converter = patched_register

urlpatterns = [
    # Auth API
    path('auth/', include('apps.auth_api.urls')),
    
    # Locations API
    path('locations/', include('apps.locations.urls')),
    
    # Insurance API
    path('insurance/', include('apps.insurance.urls')),
    
    # Medicines API
    path('medicines/', include('apps.medicines.urls')),
    
    # Pharmacies API
    path('pharmacies/', include('apps.pharmacies.urls')),
    
    # Inventory API
    path('inventory/', include('apps.inventory.urls')),
]
