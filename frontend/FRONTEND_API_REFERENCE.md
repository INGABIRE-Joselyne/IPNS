# Frontend API Reference

Quick reference for making API calls in the frontend.

## Base URL
```
http://localhost:8000/api/v1/
```

## Usage

### Import API Utilities
```javascript
import { apiGet, apiPost, endpoints } from '../utils/api'
```

### GET Request
```javascript
// List all medicines
const medicines = await apiGet(endpoints.medicines)

// List with filters
const pharmacies = await apiGet(endpoints.pharmacies, {
  district_id: 1,
  insurance_id: 2
})

// Search
const results = await apiGet(endpoints.medicineSearch, { q: 'paracetamol' })
```

### POST Request
```javascript
const newPharmacy = await apiPost(endpoints.pharmacies, {
  name: 'New Pharmacy',
  phone_number: '+250788123456'
})
```

## Available Endpoints

### Medicines
```javascript
// List medicines
await apiGet(endpoints.medicines)

// Search medicines
await apiGet(endpoints.medicineSearch, { q: 'paracetamol' })

// List categories
await apiGet(endpoints.medicineCategories)
```

### Pharmacies
```javascript
// List all pharmacies
await apiGet(endpoints.pharmacies)

// Pharmacies in district
await apiGet(endpoints.pharmaciesByDistrict, { district_id: 1 })

// Open pharmacies now
await apiGet(endpoints.pharmaciesOpenNow)
```

### Locations
```javascript
// Provinces
await apiGet(endpoints.provinces)

// Districts of a province
await apiGet(`${endpoints.provinces}1/districts/`)

// Districts list
await apiGet(endpoints.districts)

// Sectors
await apiGet(endpoints.sectors)
```

### Insurance
```javascript
// List providers
await apiGet(endpoints.insurance)

// Filter by active
await apiGet(endpoints.insurance, { is_active: true })
```

### Inventory
```javascript
// Get stock
await apiGet(endpoints.stock)

// Stock for pharmacy
await apiGet(endpoints.stockByPharmacy, { pharmacy_id: 1 })

// Medicine availability
await apiGet(endpoints.searchMedicineAvailability, { 
  medicine_id: 1,
  district_id: 1 
})

// Out of stock
await apiGet(endpoints.outOfStock)

// Expired items
await apiGet(endpoints.expiredStock)
```

## Response Handling

All successful responses are serialized JSON.

### Example with Error Handling
```javascript
try {
  const data = await apiGet(endpoints.medicines)
  console.log(data)
} catch (error) {
  console.error('Failed to fetch medicines:', error)
}
```

### Pagination
Responses include pagination info:
```javascript
{
  count: 100,
  next: "http://...",
  previous: null,
  results: [...]
}
```

Access results:
```javascript
const response = await apiGet(endpoints.medicines)
const medicines = response.results || response
```

## Common Patterns

### Loading State
```javascript
const [isLoading, setIsLoading] = useState(false)

const handleSearch = async () => {
  setIsLoading(true)
  try {
    const data = await apiGet(endpoints.medicines)
    // Handle data
  } finally {
    setIsLoading(false)
  }
}
```

### Error Handling
```javascript
const [error, setError] = useState(null)

try {
  const data = await apiGet(...)
} catch (error) {
  setError(error.message)
}
```

### Filtering
```javascript
// Get pharmacies in Kigali with RSSB insurance
await apiGet(endpoints.pharmacies, {
  district_id: 1,
  insurance_id: 1
})
```

### Search
```javascript
// Medicine search
await apiGet(endpoints.medicineSearch, { q: 'paracetamol' })

// Check availability by district
await apiGet(endpoints.searchMedicineAvailability, {
  medicine_id: 1,
  district_id: 1
})
```

## Status Codes

- `200` - Success
- `400` - Bad request
- `404` - Not found
- `500` - Server error

## Tips

1. **Check for both formats**: Some endpoints return array, others return object
   ```javascript
   const data = response.results || response
   ```

2. **Use pagination parameters**:
   ```javascript
   await apiGet(endpoints.medicines, { 
     page: 1,
     page_size: 50 
   })
   ```

3. **Chain filters**:
   ```javascript
   await apiGet(endpoints.pharmacies, {
     district_id: 1,
     insurance_id: 2,
     is_active: true
   })
   ```

4. **Handle optional params**:
   ```javascript
   const params = { medicine_id: 1 }
   if (districtId) params.district_id = districtId
   
   await apiGet(endpoints.searchMedicineAvailability, params)
   ```

---

For detailed API documentation, see `API_DOCUMENTATION.md` in the backend folder.
