from django.db import models
from django.core.validators import MinValueValidator
from django.utils import timezone


class Stock(models.Model):
    """Inventory/Stock of medicines at each pharmacy."""
    pharmacy = models.ForeignKey(
        'pharmacies.Pharmacy',
        on_delete=models.CASCADE,
        related_name='stocks'
    )
    medicine = models.ForeignKey(
        'medicines.Medicine',
        on_delete=models.CASCADE,
        related_name='pharmacy_stocks'
    )
    quantity = models.IntegerField(
        validators=[MinValueValidator(0)],
        default=0
    )
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    expiry_date = models.DateField(null=True, blank=True)
    is_in_stock = models.BooleanField(default=True)
    last_updated = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('pharmacy', 'medicine')
        ordering = ['-last_updated']
        indexes = [
            models.Index(fields=['pharmacy', 'is_in_stock']),
            models.Index(fields=['medicine', 'is_in_stock']),
        ]
    
    def __str__(self):
        return f"{self.medicine.name} @ {self.pharmacy.name}"
    
    @property
    def is_expired(self):
        """Check if the medicine is expired."""
        if self.expiry_date:
            return self.expiry_date < timezone.now().date()
        return False
    
    @property
    def is_low_stock(self, threshold=5):
        """Check if stock is running low."""
        return self.quantity <= threshold


class StockMovement(models.Model):
    """Log of stock movements for audit and tracking."""
    MOVEMENT_TYPES = [
        ('IN', 'Stock In'),
        ('OUT', 'Stock Out'),
        ('ADJUST', 'Adjustment'),
        ('EXPIRY', 'Expired/Removed'),
    ]
    
    stock = models.ForeignKey(
        Stock,
        on_delete=models.CASCADE,
        related_name='movements'
    )
    movement_type = models.CharField(max_length=10, choices=MOVEMENT_TYPES)
    quantity_change = models.IntegerField()  # Can be positive or negative
    reason = models.TextField(blank=True, null=True)
    created_by = models.ForeignKey(
        'auth.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = "Stock Movements"
    
    def __str__(self):
        return f"{self.get_movement_type_display()} - {self.stock.medicine.name} @ {self.stock.pharmacy.name}"
