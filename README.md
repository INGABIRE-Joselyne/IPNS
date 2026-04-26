# IPNS Backend Development Guide

## Project Structure

```
backend/
├── config/              # Django project settings
│   ├── settings.py     # Main settings file
│   ├── urls.py         # Main URL routing
│   └── wsgi.py
├── apps/               # Django applications
│   ├── common/         # Shared utilities and base classes
│   ├── locations/      # Province, District, Sector management
│   ├── insurance/      # Insurance provider management
│   ├── medicines/      # Medicine catalog
│   ├── pharmacies/     # Pharmacy management
│   └── inventory/      # Stock/Inventory management
├── api/                # API configuration and URLs
├── utils/              # Utility functions and helpers
├── db.sqlite3          # Database file
├── manage.py           # Django management
└── requirements.txt    # Python dependencies
```

## App Structure

Each app follows this structure:
```
app_name/
├── __init__.py
├── models.py           # Database models
├── serializers.py      # DRF serializers (for API)
├── views.py            # API views (viewsets)
├── urls.py             # App-specific URL routing
├── admin.py            # Django admin configuration
```

## Models Overview

### Locations App
- **Province**: Rwanda's provinces
- **District**: Districts within provinces
- **Sector**: Sectors within districts

### Insurance App
- **InsuranceProvider**: Insurance companies (RSSB, MMI, etc.)

### Medicines App
- **MedicineCategory**: Categories for medicines
- **Medicine**: Master catalog of medicines

### Pharmacies App
- **Pharmacy**: Pharmacy information with location, hours, insurance partnerships
- **PharmacyWorkingHour**: Detailed working hours per day

### Inventory App
- **Stock**: Medicine inventory at each pharmacy
- **StockMovement**: Audit log for stock changes

## API Endpoints

All endpoints are under `/api/v1/`

### Locations
- `GET /api/v1/locations/provinces/` - List all provinces
- `GET /api/v1/locations/provinces/{id}/districts/` - Get districts for a province
- `GET /api/v1/locations/districts/` - List all districts
- `GET /api/v1/locations/districts/{id}/sectors/` - Get sectors for a district
- `GET /api/v1/locations/sectors/` - List all sectors

### Insurance
- `GET /api/v1/insurance/providers/` - List all insurance providers
- `POST /api/v1/insurance/providers/` - Create a new insurance provider

### Medicines
- `GET /api/v1/medicines/` - List all medicines
- `GET /api/v1/medicines/search/?q=paracetamol` - Search medicines
- `POST /api/v1/medicines/` - Create a new medicine
- `GET /api/v1/medicines/categories/` - List medicine categories

### Pharmacies
- `GET /api/v1/pharmacies/` - List all pharmacies
- `GET /api/v1/pharmacies/by_district/?district_id=1` - Get pharmacies by district
- `GET /api/v1/pharmacies/open_now/` - Get currently open pharmacies
- `GET /api/v1/pharmacies/{id}/status/` - Get pharmacy status
- `POST /api/v1/pharmacies/` - Register a new pharmacy

### Inventory
- `GET /api/v1/inventory/stock/` - List all stock
- `GET /api/v1/inventory/stock/by_pharmacy/?pharmacy_id=1` - Get stock for a pharmacy
- `GET /api/v1/inventory/stock/search_medicine/?medicine_id=1&district_id=1` - Search medicine availability
- `GET /api/v1/inventory/stock/out_of_stock/` - Get out-of-stock medicines
- `GET /api/v1/inventory/movements/` - Get stock movement history

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
pip install -r requirements.txt
```

### 2. Create Migrations
```bash
python manage.py makemigrations
```

### 3. Apply Migrations
```bash
python manage.py migrate
```

### 4. Create Superuser
```bash
python manage.py createsuperuser
```

### 5. Run Development Server
```bash
python manage.py runserver
```

Visit `http://localhost:8000/admin/` to access Django admin.

## API Features

### Search and Filtering
- **Medicine Search**: `GET /api/v1/medicines/search/?q=paracetamol`
- **Filter Pharmacies by District**: `GET /api/v1/pharmacies/?district_id=1`
- **Filter Pharmacies by Insurance**: `GET /api/v1/pharmacies/?insurance_id=1`
- **Filter Stock by Status**: `GET /api/v1/inventory/stock/?is_in_stock=true`

### Pharmacy Status
Automatically calculates pharmacy status based on operating hours:
- `open`: Pharmacy is currently open
- `closing_soon`: Closing within 1 hour
- `closed`: Pharmacy is closed

### Stock Management
- Tracks quantity, price, and expiry date
- Marks medicines as in-stock or out-of-stock
- Maintains audit log with StockMovement

## Database Design

Uses SQLite (easily upgradeable to PostgreSQL/MySQL).

### Key Relationships
- Pharmacy → Sector → District → Province
- Pharmacy → InsuranceProvider (Many-to-Many)
- Stock → Pharmacy + Medicine (Unique pair)
- Stock → Medicine

### Indexes
Created on frequently searched fields:
- Medicine.name
- Pharmacy.name
- Stock.pharmacy & Stock.is_in_stock

## Best Practices Implemented

1. **Clean Architecture**: Separate concerns into different apps
2. **DRY Principle**: Reusable serializers and base classes
3. **Consistent Naming**: Clear, descriptive names for models and endpoints
4. **Proper Relationships**: Use ForeignKey and ManyToMany correctly
5. **Admin Interface**: Fully configured Django admin
6. **API Documentation**: Well-organized viewsets with docstrings
7. **Filtering & Search**: Implemented for all major models
8. **Timestamps**: All models have created_at and updated_at
9. **Status Tracking**: Automatic status calculation for pharmacies
10. **Audit Logging**: Stock movements are logged for tracking

## Common Tasks

### Add a New Medicine
```python
from apps.medicines.models import Medicine, MedicineCategory

category = MedicineCategory.objects.get(id=1)
medicine = Medicine.objects.create(
    name="Paracetamol",
    generic_name="Acetaminophen",
    category=category,
    strength="500mg",
    unit="tablet",
    manufacturer="Some Pharma"
)
```

### Register a New Pharmacy
```python
from apps.pharmacies.models import Pharmacy
from apps.locations.models import Sector
from datetime import time

sector = Sector.objects.get(id=1)
pharmacy = Pharmacy.objects.create(
    name="Health Center Pharmacy",
    sector=sector,
    phone_number="+250788123456",
    opening_time=time(8, 0),
    closing_time=time(20, 0)
)
# Add insurance partnerships
from apps.insurance.models import InsuranceProvider
rssb = InsuranceProvider.objects.get(code="RSSB")
pharmacy.insurance_providers.add(rssb)
```

### Update Stock
```python
from apps.inventory.models import Stock
from apps.medicines.models import Medicine
from apps.pharmacies.models import Pharmacy
from datetime import date

medicine = Medicine.objects.get(id=1)
pharmacy = Pharmacy.objects.get(id=1)

stock, created = Stock.objects.get_or_create(
    pharmacy=pharmacy,
    medicine=medicine,
    defaults={'quantity': 100, 'price': '5.99', 'expiry_date': date(2025, 12, 31)}
)
```

## Notes
- All models use auto-incrementing integer IDs
- Timestamps are stored with timezone support
- The system is designed to handle multiple pharmacies and large medicine catalogs
- Currently uses SQLite; easy to migrate to PostgreSQL/MySQL for production
