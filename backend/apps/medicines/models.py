from django.db import models


class MedicineCategory(models.Model):
    """Categories for medicines (e.g., Antibiotics, Painkillers, etc.)."""
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Medicine Categories"

    def __str__(self):
        return self.name


class Medicine(models.Model):
    """Master catalog of medicines."""
    name = models.CharField(max_length=200, db_index=True)
    generic_name = models.CharField(max_length=200, blank=True, null=True)
    category = models.ForeignKey(
        MedicineCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='medicines'
    )
    description = models.TextField(blank=True, null=True)
    strength = models.CharField(max_length=100, blank=True, null=True)  # e.g., "500mg", "10ml"
    unit = models.CharField(max_length=50, blank=True, null=True)  # e.g., "tablet", "capsule", "ml"
    manufacturer = models.CharField(max_length=200, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Medicines"
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        if self.strength:
            return f"{self.name} ({self.strength})"
        return self.name
