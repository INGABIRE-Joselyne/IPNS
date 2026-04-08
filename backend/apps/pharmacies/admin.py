from django.contrib import admin
from .models import Pharmacy, PharmacyWorkingHour


class PharmacyWorkingHourInline(admin.TabularInline):
    model = PharmacyWorkingHour
    extra = 0


@admin.register(Pharmacy)
class PharmacyAdmin(admin.ModelAdmin):
    list_display = ['name', 'phone_number', 'sector', 'get_status', 'is_active', 'created_at']
    list_filter = ['is_active', 'sector__district__province', 'sector__district']
    search_fields = ['name', 'phone_number', 'email']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [PharmacyWorkingHourInline]
    filter_horizontal = ['insurance_providers']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'is_active')
        }),
        ('Location', {
            'fields': ('sector', 'street_address', 'latitude', 'longitude')
        }),
        ('Contact Information', {
            'fields': ('phone_number', 'email')
        }),
        ('Operating Hours', {
            'fields': ('opening_time', 'closing_time')
        }),
        ('Insurance Partnerships', {
            'fields': ('insurance_providers',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def get_status(self, obj):
        status = obj.get_current_status()
        colors = {
            'open': '🟢',
            'closing_soon': '🟡',
            'closed': '🔴'
        }
        return f"{colors.get(status, '')} {status.capitalize()}"
    get_status.short_description = "Current Status"


@admin.register(PharmacyWorkingHour)
class PharmacyWorkingHourAdmin(admin.ModelAdmin):
    list_display = ['pharmacy', 'day_of_week', 'opening_time', 'closing_time', 'is_closed']
    list_filter = ['day_of_week', 'is_closed']
    search_fields = ['pharmacy__name']
