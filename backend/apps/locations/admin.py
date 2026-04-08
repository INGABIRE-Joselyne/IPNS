from django.contrib import admin
from .models import Province, District, Sector


@admin.register(Province)
class ProvinceAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'created_at']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(District)
class DistrictAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'province', 'created_at']
    list_filter = ['province']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Sector)
class SectorAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'district', 'created_at']
    list_filter = ['district__province', 'district']
    search_fields = ['name', 'code']
    readonly_fields = ['created_at', 'updated_at']
