# IPNS API Documentation

## Base URL
```
http://localhost:8000/api/v1/
```

## Database Models

### Locations App
```
Province
├── id (Integer, PK)
├── name (String, unique)
├── code (String, unique)
├── created_at (DateTime)
└── updated_at (DateTime)

District
├── id (Integer, PK)
├── name (String)
├── code (String, unique)
├── province_id (FK → Province)
├── created_at (DateTime)
└── updated_at (DateTime)

Sector
├── id (Integer, PK)
├── name (String)
├── code (String, unique)
├── district_id (FK → District)
├── created_at (DateTime)
└── updated_at (DateTime)
```

### Insurance App
```
InsuranceProvider
├── id (Integer, PK)
├── name (String, unique)
├── code (String, unique)
├── description (Text, optional)
├── contact_email (Email, optional)
├── contact_phone (String, optional)
├── is_active (Boolean, default=True)
├── created_at (DateTime)
└── updated_at (DateTime)
```

### Medicines App
```
MedicineCategory
├── id (Integer, PK)
├── name (String, unique)
├── description (Text, optional)
├── created_at (DateTime)
└── updated_at (DateTime)

Medicine
├── id (Integer, PK)
├── name (String, indexed)
├── generic_name (String, optional)
├── category_id (FK → MedicineCategory, optional)
├── description (Text, optional)
├── strength (String, optional) - e.g., "500mg"
├── unit (String, optional) - e.g., "tablet"
├── manufacturer (String, optional)
├── is_active (Boolean, default=True)
├── created_at (DateTime)
└── updated_at (DateTime)
```

### Pharmacies App
```
Pharmacy
├── id (Integer, PK)
├── name (String, indexed)
├── description (Text, optional)
├── sector_id (FK → Sector, optional)
├── street_address (String, optional)
├── latitude (Float, optional)
├── longitude (Float, optional)
├── phone_number (String)
├── email (String, optional)
├── insurance_providers (M2M → InsuranceProvider)
├── opening_time (Time) - HH:MM format
├── closing_time (Time) - HH:MM format
├── is_active (Boolean, default=True)
├── created_at (DateTime)
└── updated_at (DateTime)

PharmacyWorkingHour
├── id (Integer, PK)
├── pharmacy_id (FK → Pharmacy)
├── day_of_week (Integer) - 0=Monday, 6=Sunday
├── opening_time (Time)
├── closing_time (Time)
├── is_closed (Boolean, default=False)
```

### Inventory App
```
Stock
├── id (Integer, PK)
├── pharmacy_id (FK → Pharmacy)
├── medicine_id (FK → Medicine)
├── quantity (Integer, default=0)
├── price (Decimal, optional)
├── expiry_date (Date, optional)
├── is_in_stock (Boolean, default=True)
├── last_updated (DateTime, auto-updated)
└── created_at (DateTime)

StockMovement
├── id (Integer, PK)
├── stock_id (FK → Stock)
├── movement_type (String) - IN|OUT|ADJUST|EXPIRY
├── quantity_change (Integer)
├── reason (Text, optional)
├── created_by_id (FK → User, optional)
└── created_at (DateTime)
```

## API Endpoints

### Locations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/locations/provinces/` | List all provinces |
| POST | `/locations/provinces/` | Create province |
| GET | `/locations/provinces/{id}/` | Get province details |
| PUT | `/locations/provinces/{id}/` | Update province |
| DELETE | `/locations/provinces/{id}/` | Delete province |
| GET | `/locations/provinces/{id}/districts/` | Get districts of province |
| GET | `/locations/districts/` | List all districts |
| POST | `/locations/districts/` | Create district |
| GET | `/locations/districts/{id}/` | Get district details |
| PUT | `/locations/districts/{id}/` | Update district |
| DELETE | `/locations/districts/{id}/` | Delete district |
| GET | `/locations/districts/{id}/sectors/` | Get sectors of district |
| GET | `/locations/sectors/` | List all sectors |
| POST | `/locations/sectors/` | Create sector |
| GET | `/locations/sectors/{id}/` | Get sector details |
| PUT | `/locations/sectors/{id}/` | Update sector |
| DELETE | `/locations/sectors/{id}/` | Delete sector |

### Insurance
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/insurance/providers/` | List all insurance providers |
| POST | `/insurance/providers/` | Create insurance provider |
| GET | `/insurance/providers/{id}/` | Get provider details |
| PUT | `/insurance/providers/{id}/` | Update provider |
| DELETE | `/insurance/providers/{id}/` | Delete provider |

**Query Parameters:**
- `is_active=true|false` - Filter by active status

### Medicines
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/medicines/` | List all medicines |
| POST | `/medicines/` | Create medicine |
| GET | `/medicines/{id}/` | Get medicine details |
| PUT | `/medicines/{id}/` | Update medicine |
| DELETE | `/medicines/{id}/` | Delete medicine |
| GET | `/medicines/search/?q=term` | Search medicines |
| GET | `/medicines/categories/` | List medicine categories |
| POST | `/medicines/categories/` | Create category |
| GET | `/medicines/categories/{id}/` | Get category details |

**Query Parameters:**
- `search=term` - Search by name/generic name/manufacturer
- `category_id=id` - Filter by category
- `is_active=true|false` - Filter by status
- `ordering=name,-created_at` - Sort results

### Pharmacies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pharmacies/` | List all pharmacies |
| POST | `/pharmacies/` | Register pharmacy |
| GET | `/pharmacies/{id}/` | Get pharmacy details |
| PUT | `/pharmacies/{id}/` | Update pharmacy |
| DELETE | `/pharmacies/{id}/` | Delete pharmacy |
| GET | `/pharmacies/by_district/` | Get pharmacies by district |
| GET | `/pharmacies/open_now/` | Get currently open pharmacies |
| GET | `/pharmacies/{id}/status/` | Get pharmacy current status |

**Query Parameters:**
- `sector_id=id` - Filter by sector
- `district_id=id` - Filter by district
- `insurance_id=id` - Filter by insurance provider
- `is_active=true|false` - Filter by active status
- `search=term` - Search by name/phone/email
- `ordering=name,-created_at` - Sort results

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/inventory/stock/` | List all stock |
| POST | `/inventory/stock/` | Add stock |
| GET | `/inventory/stock/{id}/` | Get stock details |
| PUT | `/inventory/stock/{id}/` | Update stock |
| DELETE | `/inventory/stock/{id}/` | Delete stock |
| GET | `/inventory/stock/by_pharmacy/` | Get pharmacy stock |
| GET | `/inventory/stock/search_medicine/` | Search medicine availability |
| GET | `/inventory/stock/out_of_stock/` | Get out-of-stock medicines |
| GET | `/inventory/stock/expired/` | Get expired medicines |
| GET | `/inventory/movements/` | Get stock movement history |

**Query Parameters for Pharmacy:**
- `pharmacy_id=id` - Filter by pharmacy
- `medicine_id=id` - Filter by medicine
- `district_id=id` - Filter by district
- `is_in_stock=true|false` - Filter by stock status

**Query Parameters for Search:**
- `medicine_id=id` - Medicine to search (required)
- `district_id=id` - District to search (optional)

**Query Parameters for Movements:**
- `stock_id=id` - Filter by stock
- `movement_type=IN|OUT|ADJUST|EXPIRY` - Filter by type

## Example Requests

### Get all pharmacies in Kigali District
```
GET /api/v1/pharmacies/?district_id=1
```

### Search for Paracetamol in Kigali
```
GET /api/v1/medicines/search/?q=paracetamol
GET /api/v1/inventory/stock/search_medicine/?medicine_id=5&district_id=1
```

### Get open pharmacies with RSSB insurance
```
GET /api/v1/pharmacies/open_now/?insurance_id=1
```

### Update pharmacy stock
```
PUT /api/v1/inventory/stock/10/
{
    "quantity": 50,
    "price": "5.99",
    "is_in_stock": true
}
```

### Register a new pharmacy
```
POST /api/v1/pharmacies/
{
    "name": "Health Center Pharmacy",
    "phone_number": "+250788123456",
    "sector_id": 1,
    "opening_time": "08:00",
    "closing_time": "20:00",
    "insurance_provider_ids": [1, 2]
}
```

## Response Format

### Success Response (2xx)
```json
{
    "id": 1,
    "name": "Medicine Name",
    "created_at": "2024-04-08T10:30:00Z",
    "updated_at": "2024-04-08T10:30:00Z"
}
```

### Paginated Response
```json
{
    "count": 100,
    "next": "http://localhost:8000/api/v1/medicines/?page=2",
    "previous": null,
    "results": [...]
}
```

### Error Response (4xx/5xx)
```json
{
    "detail": "Not found." 
}
```

## Status Codes
- `200 OK` - Successful GET/PUT/PATCH
- `201 Created` - Successful POST
- `204 No Content` - Successful DELETE
- `400 Bad Request` - Invalid data
- `404 Not Found` - Resource not found
- `500 Server Error` - Internal server error

## Pharmacy Status

The `get_current_status()` method returns:
- `"open"` - Pharmacy is currently open (between opening_time and closing_time)
- `"closing_soon"` - Pharmacy will close within 1 hour
- `"closed"` - Pharmacy is closed

## Pagination
Default page size: 20 items
- Use `?page=1` to get first page
- Use `?page_size=50` to change page size

## Filtering & Search
- `search=term` - Case-insensitive search
- `ordering=field` - Ascending order
- `ordering=-field` - Descending order

## Database Constraints
- Province.name, Province.code - Unique
- District.code - Unique
- Sector.code - Unique
- Stock.pharmacy + Stock.medicine - Unique together
- InsuranceProvider.name, InsuranceProvider.code - Unique
- Medicine.name, Manufacturer - Indexed for fast search
