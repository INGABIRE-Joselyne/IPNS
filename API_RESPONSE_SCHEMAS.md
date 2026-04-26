# IPNS API Response Schemas

This document shows the exact structure of API responses for frontend integration.

## Locations

### Province
```json
{
    "id": 1,
    "name": "Kigali City",
    "code": "KGL",
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

### District
```json
{
    "id": 1,
    "name": "Gasabo",
    "code": "GAS",
    "province": {
        "id": 1,
        "name": "Kigali City",
        "code": "KGL",
        "created_at": "2024-04-08T10:30:00Z",
        "updated_at": "2024-04-08T10:30:00Z"
    },
    "province_id": 1,
    "sectors": [
        {
            "id": 1,
            "name": "Gisozi",
            "code": "GZ",
            "created_at": "2024-04-08T10:30:00Z",
            "updated_at": "2024-04-08T10:30:00Z"
        }
    ],
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

### Sector
```json
{
    "id": 1,
    "name": "Gisozi",
    "code": "GZ",
    "district": {
        "id": 1,
        "name": "Gasabo",
        "code": "GAS"
    },
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

## Insurance

### Insurance Provider
```json
{
    "id": 1,
    "name": "Rwanda Social Security Board",
    "code": "RSSB",
    "description": "RSSB health insurance",
    "contact_email": "info@rssb.rw",
    "contact_phone": "+250720123456",
    "is_active": true,
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

Insurance Provider List Response:
```json
{
    "count": 5,
    "next": null,
    "previous": null,
    "results": [
        { ...insurance provider... },
        { ...insurance provider... }
    ]
}
```

## Medicines

### Medicine Category
```json
{
    "id": 1,
    "name": "Painkillers",
    "description": "Pain relieving medications",
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

### Medicine (Detail)
```json
{
    "id": 1,
    "name": "Paracetamol",
    "generic_name": "Acetaminophen",
    "category": {
        "id": 1,
        "name": "Painkillers",
        "description": "Pain relieving medications",
        "created_at": "2024-04-08T10:30:00Z",
        "updated_at": "2024-04-08T10:30:00Z"
    },
    "category_id": 1,
    "description": "Acetaminophen for pain relief",
    "strength": "500mg",
    "unit": "tablet",
    "manufacturer": "Generic Pharma",
    "is_active": true,
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

### Medicine (List)
```json
{
    "id": 1,
    "name": "Paracetamol",
    "generic_name": "Acetaminophen",
    "category_name": "Painkillers",
    "strength": "500mg",
    "unit": "tablet",
    "manufacturer": "Generic Pharma",
    "is_active": true
}
```

## Pharmacies

### Pharmacy (Detail)
```json
{
    "id": 1,
    "name": "Health Center Pharmacy",
    "description": "Main pharmacy at health center",
    "sector": {
        "id": 1,
        "name": "Gisozi",
        "code": "GZ",
        "district": {
            "id": 1,
            "name": "Gasabo",
            "code": "GAS"
        },
        "created_at": "2024-04-08T10:30:00Z",
        "updated_at": "2024-04-08T10:30:00Z"
    },
    "sector_id": 1,
    "street_address": "Kigali, Rwanda",
    "latitude": -1.9505,
    "longitude": 30.0619,
    "phone_number": "+250788123456",
    "email": "pharmacy@healthcenter.rw",
    "insurance_providers": [
        {
            "id": 1,
            "name": "Rwanda Social Security Board",
            "code": "RSSB",
            "description": "RSSB health insurance",
            "contact_email": "info@rssb.rw",
            "contact_phone": "+250720123456",
            "is_active": true,
            "created_at": "2024-04-08T10:30:00Z",
            "updated_at": "2024-04-08T10:30:00Z"
        }
    ],
    "insurance_provider_ids": [1],
    "opening_time": "08:00:00",
    "closing_time": "20:00:00",
    "is_active": true,
    "current_status": "open",
    "working_hours": [
        {
            "id": 1,
            "day_of_week": 0,
            "day_display": "Monday",
            "opening_time": "08:00:00",
            "closing_time": "20:00:00",
            "is_closed": false
        }
    ],
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

### Pharmacy (List)
```json
{
    "id": 1,
    "name": "Health Center Pharmacy",
    "phone_number": "+250788123456",
    "sector_name": "Gisozi",
    "district_name": "Gasabo",
    "opening_time": "08:00:00",
    "closing_time": "20:00:00",
    "is_active": true,
    "current_status": "open",
    "insurance_count": 2
}
```

### Pharmacy Current Status
```json
{
    "id": 1,
    "name": "Health Center Pharmacy",
    "status": "open",
    "opening_time": "08:00:00",
    "closing_time": "20:00:00"
}
```

Status values:
- `"open"` - Currently open
- `"closing_soon"` - Closing within 1 hour
- `"closed"` - Currently closed

## Inventory

### Stock (Detail)
```json
{
    "id": 1,
    "pharmacy": {
        "id": 1,
        "name": "Health Center Pharmacy",
        "phone_number": "+250788123456",
        "sector_name": "Gisozi",
        "district_name": "Gasabo",
        "opening_time": "08:00:00",
        "closing_time": "20:00:00",
        "is_active": true,
        "current_status": "open",
        "insurance_count": 2
    },
    "pharmacy_id": 1,
    "medicine": {
        "id": 1,
        "name": "Paracetamol",
        "generic_name": "Acetaminophen",
        "category_name": "Painkillers",
        "strength": "500mg",
        "unit": "tablet",
        "manufacturer": "Generic Pharma",
        "is_active": true
    },
    "medicine_id": 1,
    "quantity": 50,
    "price": "5.99",
    "expiry_date": "2025-12-31",
    "is_in_stock": true,
    "is_expired": false,
    "movements": [
        {
            "id": 1,
            "movement_type": "IN",
            "movement_type_display": "Stock In",
            "quantity_change": 50,
            "reason": "New delivery",
            "created_by_username": "pharmacist1",
            "created_at": "2024-04-08T10:30:00Z"
        }
    ],
    "created_at": "2024-04-08T10:30:00Z",
    "last_updated": "2024-04-08T10:30:00Z"
}
```

### Stock (List)
```json
{
    "id": 1,
    "medicine_name": "Paracetamol",
    "pharmacy_name": "Health Center Pharmacy",
    "district_name": "Gasabo",
    "quantity": 50,
    "price": "5.99",
    "is_in_stock": true,
    "is_expired": false,
    "last_updated": "2024-04-08T10:30:00Z"
}
```

### Stock Movement
```json
{
    "id": 1,
    "movement_type": "IN",
    "movement_type_display": "Stock In",
    "quantity_change": 50,
    "reason": "New delivery from supplier",
    "created_by_username": "pharmacist1",
    "created_at": "2024-04-08T10:30:00Z"
}
```

## List Responses

All list endpoints follow this pagination structure:
```json
{
    "count": 100,
    "next": "http://localhost:8000/api/v1/medicines/?page=2",
    "previous": null,
    "results": [
        { ...item 1... },
        { ...item 2... },
        { ...item 3... }
    ]
}
```

## Error Responses

### Not Found (404)
```json
{
    "detail": "Not found."
}
```

### Invalid Data (400)
```json
{
    "field_name": ["Error message"]
}
```

### Unauthorized (401)
```json
{
    "detail": "Authentication credentials were not provided."
}
```

## Frontend Integration Notes

1. **Pagination**: Check `count` and `next` fields for implementing infinite scroll or pagination
2. **Current Status**: Use the `current_status` field to display pharmacy status with colors
3. **Search**: Use `/medicines/search/?q=term` for auto-complete features
4. **Filtering**: Chain multiple query parameters: `?district_id=1&insurance_id=1&is_active=true`
5. **Error Handling**: Always check for `detail` or field-specific error messages
6. **Timestamps**: All timestamps are in ISO 8601 format (UTC)
7. **Null Values**: Some fields may be optional (null in JSON), handle accordingly
8. **List Queries**: Use `search=term` and `ordering=-field` for better UX
