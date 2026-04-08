from django.db import models
from django.db.models import Q
from django.utils import timezone
from django.contrib.auth.models import User


class PharmacyManager(models.Manager):
    """Custom manager for Pharmacy model."""
    
    def active(self):
        """Return only active pharmacies."""
        return self.filter(is_active=True)


class Pharmacy(models.Model):
    """Pharmacy information and details."""
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='pharmacy',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=200, db_index=True)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='pharmacy_logos/', blank=True, null=True)
    
    # Location information
    sector = models.ForeignKey(
        'locations.Sector',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pharmacies'
    )
    street_address = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.FloatField(blank=True, null=True)
    longitude = models.FloatField(blank=True, null=True)
    
    # Contact information
    phone_number = models.CharField(max_length=20)
    email = models.EmailField(blank=True, null=True)
    
    # Insurance partnerships
    insurance_providers = models.ManyToManyField(
        'insurance.InsuranceProvider',
        related_name='pharmacies',
        blank=True
    )
    
    # Operating hours (stored as time in format HH:MM)
    opening_time = models.TimeField()  # e.g., 08:00
    closing_time = models.TimeField()  # e.g., 22:00
    
    # Status
    is_active = models.BooleanField(default=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = PharmacyManager()
    
    class Meta:
        ordering = ['name']
        verbose_name_plural = "Pharmacies"
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]
    
    def __str__(self):
        return self.name
    
    def get_current_status(self):
        """
        Get the current status of the pharmacy.
        Returns: 'open', 'closed', or 'closing_soon'
        """
        now = timezone.now().time()
        
        if self.opening_time <= now < self.closing_time:
            # Check if closing soon (within 1 hour)
            from datetime import timedelta
            closing_soon_threshold = (
                timezone.datetime.combine(timezone.now().date(), self.closing_time) -
                timedelta(hours=1)
            ).time()
            
            if now >= closing_soon_threshold:
                return 'closing_soon'
            return 'open'
        return 'closed'


class PharmacyWorkingHour(models.Model):
    """Alternative: detailed working hours per day of week."""
    DAYS_OF_WEEK = [
        (0, 'Monday'),
        (1, 'Tuesday'),
        (2, 'Wednesday'),
        (3, 'Thursday'),
        (4, 'Friday'),
        (5, 'Saturday'),
        (6, 'Sunday'),
    ]
    
    pharmacy = models.ForeignKey(
        Pharmacy,
        on_delete=models.CASCADE,
        related_name='working_hours'
    )
    day_of_week = models.IntegerField(choices=DAYS_OF_WEEK)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_closed = models.BooleanField(default=False)  # For holidays or closed days
    
    class Meta:
        unique_together = ('pharmacy', 'day_of_week')
        verbose_name_plural = "Pharmacy Working Hours"
    
    def __str__(self):
        return f"{self.pharmacy.name} - {self.get_day_of_week_display()}"
