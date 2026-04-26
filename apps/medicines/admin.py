from django.contrib import admin
from .models import MedicineCategory, Medicine


@admin.register(MedicineCategory)
class MedicineCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'created_at']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(Medicine)
class MedicineAdmin(admin.ModelAdmin):
    list_display = ['name', 'generic_name', 'category', 'strength', 'manufacturer', 'is_active', 'created_at']
    list_filter = ['is_active', 'category']
    search_fields = ['name', 'generic_name', 'manufacturer']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'generic_name', 'category')
        }),
        ('Details', {
            'fields': ('description', 'strength', 'unit', 'manufacturer')
        }),
        ('Status', {
            'fields': ('is_active',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
