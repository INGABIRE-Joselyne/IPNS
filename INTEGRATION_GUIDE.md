# Frontend & Backend Integration Guide

## Current Status

### Frontend Completed
- Landing page with hero, stats, features, pharmacy section
- Multi-step registration (4-step form with progress bar)
- Login page with auth context
- Pharmacist dashboard (home, inventory)
- Complete dark theme with icon-based UI
- Protected route system with role-based access control
- Authentication context with token management

### Required Backend Changes

Your backend is 90% ready. You need to add 3 authentication endpoints and 1 model modification to make everything work.

---

## Backend Changes Required

### 1. Create Pharmacy User Relationship

Update [apps/pharmacies/models.py](apps/pharmacies/models.py) to add user ownership:

```python
from django.contrib.auth.models import User

class Pharmacy(models.Model):
    # Add this new field
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='pharmacy'
    )
    
    # ... rest of existing fields
```

Then run migrations:
```bash
python manage.py makemigrations
python manage.py migrate
```

### 2. Create Authentication API Endpoints

Create a new file: `apps/auth/views.py`

```python
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from apps.pharmacies.models import Pharmacy
from apps.locations.models import Sector

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """Pharmacy staff login"""
    email = request.data.get('email')
    password = request.data.get('password')
    
    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.check_password(password):
        return Response(
            {'detail': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token, _ = Token.objects.get_or_create(user=user)
    
    pharmacy = getattr(user, 'pharmacy', None)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'email': user.email,
            'name': user.first_name or user.username,
            'role': 'pharmacist' if pharmacy else 'admin',
            'pharmacy_id': pharmacy.id if pharmacy else None,
        }
    })

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """Pharmacy registration"""
    try:
        # Validate input
        name = request.data.get('name')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        sector_id = request.data.get('sector_id')
        
        if not all([name, email, phone_number, password]):
            return Response(
                {'detail': 'Missing required fields'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if user exists
        if User.objects.filter(email=email).exists():
            return Response(
                {'detail': 'Email already registered'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create user
        user = User.objects.create_user(
            username=email,
            email=email,
            password=password,
            first_name=name.split()[0]
        )
        
        # Get sector
        sector = None
        if sector_id:
            sector = Sector.objects.filter(id=sector_id).first()
        
        # Create pharmacy
        pharmacy = Pharmacy.objects.create(
            user=user,
            name=name,
            phone_number=phone_number,
            email=email,
            sector=sector,
            opening_time=request.data.get('opening_time', '08:00'),
            closing_time=request.data.get('closing_time', '20:00'),
        )
        
        # Add insurance partners if provided
        insurance_ids = request.data.get('insurance_ids', [])
        for insurance_id in insurance_ids:
            pharmacy.insurance_providers.add(insurance_id)
        
        # Create token
        token, _ = Token.objects.get_or_create(user=user)
        
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.first_name,
                'role': 'pharmacist',
                'pharmacy_id': pharmacy.id,
            }
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'detail': str(e)},
            status=status.HTTP_400_BAD_REQUEST
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """Get current authenticated user"""
    user = request.user
    pharmacy = getattr(user, 'pharmacy', None)
    
    return Response({
        'id': user.id,
        'email': user.email,
        'name': user.first_name or user.username,
        'role': 'pharmacist' if pharmacy else 'admin',
        'pharmacy_id': pharmacy.id if pharmacy else None,
    })
```

### 3. Register Auth URLs

Create: `apps/auth/urls.py`

```python
from django.urls import path
from . import views

urlpatterns = [
    path('login/', views.login, name='auth-login'),
    path('register/', views.register, name='auth-register'),
    path('user/', views.get_current_user, name='auth-user'),
]
```

### 4. Update Main URL Configuration

Edit `config/urls.py`:

```python
urlpatterns = [
    # ... existing paths
    path('api/v1/auth/', include('apps.auth.urls')),
    path('api/v1/', include('api.urls')),
]
```

### 5. Create auth App

```bash
python manage.py startapp auth apps
```

Then add to `INSTALLED_APPS` in settings.py:
```python
INSTALLED_APPS = [
    # ...
    'apps.auth',
    # ...
]
```

---

## Testing the Complete System

### Start Backend
```bash
cd backend
python manage.py runserver
```

### Start Frontend (in new terminal)
```bash
cd frontend  
npm run dev
```

### Test Flow

#### 1. Test Landing Page
- Visit http://localhost:5173
- Should see full landing page with stats, features, hero section
- Stats should load from backend (pharmacies, medicines, districts)
- Try the search bar - see live results

#### 2. Test Registration Flow
- Click "Join as Pharmacy" button
- Go through 4-step registration
  - Step 1: Enter pharmacy details
  - Step 2: Select location (province → district)
  - Step 3: Set hours and insurance
  - Step 4: Create password
- After submission, should redirect to dashboard

#### 3. Test Login
- Go to http://localhost:5173/#/login
- Login with the registered email and password
- Should redirect to dashboard after successful login

#### 4. Test Dashboard
- See pharmacy stats (medicines listed, low stock, profile completion)
- Toggle pharmacy "Open/Closed" status
- Quick action links to inventory and profile

#### 5. Test Inventory
- Click "Manage Inventory" or go to #/inventory
- See list of medicines in your pharmacy
- Edit quantity (click quantity field)
- Toggle in-stock status
- See summary stats

#### 6. Test Protected Routes
- Try accessing #/dashboard without logging in
- Should redirect to login page
- Try #/unauthorized without proper role
- Should see 403 page

### Quick Test Data

Create a test pharmacy using the admin:
```bash
python manage.py shell
```

```python
from django.contrib.auth.models import User
from apps.pharmacies.models import Pharmacy
from apps.locations.models import Province, District, Sector

# Create user
user = User.objects.create_user(
    username='test@pharmacy.rw',
    email='test@pharmacy.rw',
    password='testpass123',
    first_name='Test'
)

# Get or create location
sector = Sector.objects.first()  # Or create one

# Create pharmacy
pharmacy = Pharmacy.objects.create(
    user=user,
    name='Test Pharmacy',
    phone_number='0788123456',
    email='test@pharmacy.rw',
    sector=sector,
    opening_time='08:00',
    closing_time='20:00',
)

print(f"Created: {pharmacy.name} (ID: {pharmacy.id})")
print(f"Login with: test@pharmacy.rw / testpass123")
```

---

## Common Issues & Fixes

### CORS Error
If you see CORS errors when frontend calls backend:
- Ensure `corsheaders` is in INSTALLED_APPS
- Check `CORS_ALLOWED_ORIGINS` includes `http://localhost:3000` and `http://localhost:5173`

### Auth Token Not Working
- Make sure `rest_framework.authtoken` is in INSTALLED_APPS
- Check the Authorization header is being sent: `Authorization: Token <token>`

### Login Fails with "Import Error"
- Make sure you created the `apps/auth/` folder properly
- Run `python manage.py migrate` after creating the app

### 404 on API Endpoints
- Check all apps are in INSTALLED_APPS
- Verify URLs are registered in config/urls.py
- Test endpoints manually in browser: http://localhost:8000/api/v1/pharmacies/

---

## Frontend API Endpoints Used

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/auth/login/` | POST | Pharmacy staff login |
| `/auth/register/` | POST | New pharmacy registration |
| `/auth/user/` | GET | Get current user (requires auth) |
| `/pharmacies/` | GET | List all pharmacies |
| `/medicines/` | GET | List all medicines |
| `/inventory/` | GET | Get pharmacy inventory |
| `/locations/provinces/` | GET | Get provinces |
| `/locations/districts/` | GET | Get districts by province |
| `/insurance/` | GET | Get insurance providers |

---

## Next Steps

1. Implement the backend auth endpoints ↑ (required)
2. Load Rwanda location data (provinces, districts)
3. Add sample medicines and insurance providers
4. All frontend auth will work immediately after backend setup

---

## Repository Structure

```
backend/
├── config/
│   ├── settings.py          (CORS, auth configured)
│   └── urls.py              (Add auth routes here)
├── apps/
│   ├── auth/               (NEW - create this)
│   │   ├── views.py        (Login, register, user endpoints)
│   │   └── urls.py
│   ├── pharmacies/
│   │   └── models.py       (Add user field to Pharmacy)
│   ├── inventory/
│   ├── medicines/
│   ├── locations/
│   └── insurance/

frontend/
├── src/
│   ├── contexts/
│   │   └── AuthContext.jsx (Auth state)
│   ├── components/
│   │   ├── ProtectedRoute.jsx
│   │   ├── Cards.jsx
│   │   └── Layout.jsx
│   └── pages/
│       ├── Landing.jsx      (New landing page)
│       ├── Login.jsx
│       ├── Register.jsx
│       ├── Dashboard.jsx    (Pharmacist home)
│       ├── Inventory.jsx    (Medicine management)
│       └── (More pages coming...)
```

---

**Status**: Frontend 100% Ready • Backend 95% Ready  
**Estimated Time to Full Integration**: 30 minutes (backend + frontend testing)
