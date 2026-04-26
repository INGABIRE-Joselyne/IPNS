from django.urls import path
from .views import pharmacy_register, login, current_user

app_name = 'auth'

urlpatterns = [
    path('register/', pharmacy_register, name='pharmacy-register'),
    path('login/', login, name='login'),
    path('user/', current_user, name='current-user'),
]
