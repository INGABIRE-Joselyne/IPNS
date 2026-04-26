from django.db import models


class Province(models.Model):
    """Represents a province in Rwanda."""
    name = models.CharField(max_length=100, unique=True)
    code = models.CharField(max_length=10, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name_plural = "Provinces"

    def __str__(self):
        return self.name


class District(models.Model):
    """Represents a district in Rwanda, belongs to a province."""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    province = models.ForeignKey(Province, on_delete=models.CASCADE, related_name='districts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['province', 'name']
        unique_together = ('name', 'province')
        verbose_name_plural = "Districts"

    def __str__(self):
        return f"{self.name}, {self.province.name}"


class Sector(models.Model):
    """Represents a sector in Rwanda, belongs to a district."""
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=10, unique=True)
    district = models.ForeignKey(District, on_delete=models.CASCADE, related_name='sectors')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['district', 'name']
        unique_together = ('name', 'district')
        verbose_name_plural = "Sectors"

    def __str__(self):
        return f"{self.name}, {self.district.name}"
