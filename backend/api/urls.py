"""
Main API URL configuration for IPNS.
"""
from django.urls import path, include

urlpatterns = [
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
