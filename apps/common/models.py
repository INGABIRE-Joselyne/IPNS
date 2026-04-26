from django.db import models
from django.contrib.auth.models import User


class BaseModel(models.Model):
    """Abstract base model with common fields for all models."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True


class UserProfile(models.Model):
    """User profile to store additional user information like role."""
    ROLE_CHOICES = [
        ('pharmacist', 'Pharmacist'),
        ('admin', 'Admin'),
        ('patient', 'Patient'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='pharmacist')
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.email} - {self.role}"
    
    class Meta:
        db_table = 'common_user_profile'
        ordering = ['-created_at']
