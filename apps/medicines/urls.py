from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicineViewSet, MedicineCategoryViewSet

router = DefaultRouter()
router.register(r'categories', MedicineCategoryViewSet, basename='medicine-category')
router.register(r'', MedicineViewSet, basename='medicine')

app_name = 'medicines'

urlpatterns = [
    path('', include(router.urls)),
]
