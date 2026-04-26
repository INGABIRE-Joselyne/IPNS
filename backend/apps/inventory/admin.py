from django.contrib import admin
from .models import Stock, StockMovement


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ['medicine', 'pharmacy', 'quantity', 'price', 'is_in_stock', 'is_expired', 'last_updated']
    list_filter = ['is_in_stock', 'pharmacy', 'medicine__category']
    search_fields = ['medicine__name', 'pharmacy__name']
    readonly_fields = ['last_updated', 'created_at']
    
    fieldsets = (
        ('Medicine & Pharmacy', {
            'fields': ('pharmacy', 'medicine')
        }),
        ('Stock Information', {
            'fields': ('quantity', 'price', 'is_in_stock')
        }),
        ('Expiry', {
            'fields': ('expiry_date',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'last_updated'),
            'classes': ('collapse',)
        }),
    )


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ['stock', 'movement_type', 'quantity_change', 'created_by', 'created_at']
    list_filter = ['movement_type', 'created_at']
    search_fields = ['stock__medicine__name', 'stock__pharmacy__name']
    readonly_fields = ['created_at']
