from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import AdminUserViewSet, current_user, login, pharmacy_register, password_reset_request, password_reset_confirm

app_name = 'auth'

router = DefaultRouter()
router.register(r'admin/users', AdminUserViewSet, basename='admin-user')

urlpatterns = [
    path('register/', pharmacy_register, name='pharmacy-register'),
    path('login/', login, name='login'),
    path('user/', current_user, name='current-user'),
    path('password-reset/', password_reset_request, name='password-reset-request'),
    path('password-reset/confirm/', password_reset_confirm, name='password-reset-confirm'),
    path('', include(router.urls)),
]
