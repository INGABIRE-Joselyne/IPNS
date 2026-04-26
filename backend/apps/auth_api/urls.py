from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AdminUserViewSet, current_user, login, pharmacy_register

app_name = 'auth'

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')

urlpatterns = [
    path('register/', pharmacy_register, name='pharmacy-register'),
    path('login/', login, name='login'),
    path('user/', current_user, name='current-user'),
    path('', include(router.urls)),
]
