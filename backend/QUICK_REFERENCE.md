# IPNS Backend - Quick Reference Guide

## 🚀 Quick Start (5 minutes)

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create database tables
python manage.py makemigrations
python manage.py migrate

# 4. Create admin account
python manage.py createsuperuser
# Follow prompts for username, email, password

# 5. Start server
python manage.py runserver

# 6. Open in browser
# Admin: http://localhost:8000/admin/
# API:   http://localhost:8000/api/v1/
```

## 📱 API Quick Reference

| Feature | Endpoint | Method |
|---------|----------|--------|
| List medicines | `/medicines/` | GET |
| Search medicine | `/medicines/search/?q=term` | GET |
| List pharmacies | `/pharmacies/` | GET |
| Pharmacies in district | `/pharmacies/?district_id=1` | GET |
| Open pharmacies now | `/pharmacies/open_now/` | GET |
| Check pharmacy status | `/pharmacies/{id}/status/` | GET |
| Find medicine availability | `/inventory/stock/search_medicine/?medicine_id=1&district_id=1` | GET |
| List locations | `/locations/provinces/` | GET |

## 🗂️ File Organization

### By Responsibility
- **Models**: `apps/*/models.py` - Database structure
- **APIs**: `apps/*/serializers.py` & `views.py` - REST endpoints
- **Admin**: `apps/*/admin.py` - Django admin interface
- **URLs**: `api/urls.py` - Route all endpoints
- **Settings**: `config/settings.py` - App configuration

### By Feature
- **Locations**: Provinces, Districts, Sectors
- **Insurance**: Insurance provider management
- **Medicines**: Medicine catalog with search
- **Pharmacies**: Pharmacy info with status engine
- **Inventory**: Stock tracking with audit log

## 📊 Entity Relationships

```
Province
  └─ District
      └─ Sector
          └─ Pharmacy
              ├─ InsuranceProvider (M2M)
              ├─ Stock (M2M through Medicine)
              └─ WorkingHours
  
Medicine
  ├─ Category
  └─ Stock (at each Pharmacy)
      └─ StockMovement (Audit Log)
```

## 🔌 Common API Patterns

### Get List with Filtering
```
GET /api/v1/pharmacies/?district_id=1&is_active=true&search=health
```

### Nested Data (Relationships)
```
GET /api/v1/districts/{id}/sectors/  # Get sectors in district
GET /api/v1/provinces/{id}/districts/  # Get districts in province
```

### Search
```
GET /api/v1/medicines/search/?q=paracetamol
GET /api/v1/inventory/stock/search_medicine/?medicine_id=1&district_id=1
```

### Custom Actions
```
GET /api/v1/pharmacies/open_now/
GET /api/v1/pharmacies/{id}/status/
GET /api/v1/inventory/stock/out_of_stock/
GET /api/v1/inventory/stock/expired/
```

## 🛠️ Development Commands

```bash
# Run Django shell for testing
python manage.py shell

# Make changes to models
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create migrations without running them
python manage.py makemigrations --dry-run

# Reset database (WARNING: deletes all data)
python manage.py migrate zero

# Create sample data
python manage.py shell
# Then use code examples from README.md

# Run tests
python manage.py test

# Check database
python manage.py dbshell
```

## 📈 Admin Interface Features

- **Pharmacy Admin**: Shows current status (🟢 Open, 🟡 Closing Soon, 🔴 Closed)
- **Stock Admin**: Lists medicine quantity, price, expiry date
- **Search**: Search by name, code, phone number across apps
- **Filters**: Filter by status, category, location, date
- **Inline Editing**: Edit related records directly

Access at: `http://localhost:8000/admin/`

## 🔍 Debug Checklist

If API returns errors:

1. **Check 404 errors**
   - Verify resource exists in admin
   - Check model relationships

2. **Check validation errors (400)**
   - Required fields: pharmacy_id, medicine_id
   - Unique together: pharmacy + medicine in Stock
   - Valid choices: movement_type (IN, OUT, ADJUST, EXPIRY)

3. **Check permissions**
   - All endpoints currently allow anonymous access
   - Implement authentication if needed

4. **Check pagination**
   - Default page size: 20 items
   - Use `?page=2` for next page
   - Check `count` field for total items

## 📝 Important Notes

1. **Timestamps**: All times are in UTC (Africa/Kigali timezone set in settings)
2. **Pharmacy Status**: Calculated real-time from opening/closing times
3. **Stock Expiry**: Check `is_expired` property
4. **Insurance M2M**: Use `insurance_provider_ids` list for updates
5. **Locations**: Hierarchical - Province → District → Sector

## 🎯 Frontend Developer Checklist

- [ ] Save API base URL: `http://localhost:8000/api/v1/`
- [ ] Check API_DOCUMENTATION.md for all endpoints
- [ ] Study API_RESPONSE_SCHEMAS.md for response structure
- [ ] Test endpoints in browser or Postman first
- [ ] Use `?search=term` for autocomplete features
- [ ] Handle pagination with `next` field
- [ ] Display pharmacy status with colors
- [ ] Filter locations from provinces down to sectors

## 🚨 Common Issues & Solutions

**Issue**: "ModuleNotFoundError: No module named 'rest_framework'"
- **Solution**: `pip install -r requirements.txt`

**Issue**: "No such table: apps_pharmacy"
- **Solution**: `python manage.py migrate`

**Issue**: "Page not found" on API endpoint
- **Solution**: Check URL format matches route structure in `api/urls.py`

**Issue**: CORS errors from frontend
- **Solution**: CORS already configured for localhost:3000 and localhost:5173

**Issue**: Cannot login to admin
- **Solution**: Create superuser: `python manage.py createsuperuser`

## 📞 Support Files

- **README.md** - Initial setup & examples
- **API_DOCUMENTATION.md** - All endpoints (41 total)
- **API_RESPONSE_SCHEMAS.md** - Exact JSON structure
- **.env.example** - Configuration template
- **BACKEND_SETUP_SUMMARY.md** - Full overview

## 🎉 You're All Set!

The backend is ready for:
- ✅ API testing
- ✅ Frontend integration
- ✅ Data entry in admin
- ✅ Team collaboration
- ✅ Production deployment (with config updates)

**Happy Coding! 🚀**
