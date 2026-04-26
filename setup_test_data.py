"""
Complete setup script to populate database with medicines, pharmacies, and stock data
Run with: python setup_test_data.py
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from datetime import datetime, timedelta
from decimal import Decimal

from apps.medicines.models import MedicineCategory, Medicine
from apps.pharmacies.models import Pharmacy
from apps.locations.models import Province, District, Sector
from apps.inventory.models import Stock
from django.contrib.auth.models import User

print("=" * 60)
print("SETTING UP TEST DATA")
print("=" * 60)

# Step 1: Create categories
print("\n1. Creating medicine categories...")
categories = [
    ('Antibiotics', 'Medicines to treat bacterial infections'),
    ('Pain Relievers', 'Medicines for pain management'),
    ('Anti-inflammatories', 'Medicines to reduce inflammation'),
]

cat_objects = {}
for name, desc in categories:
    cat, created = MedicineCategory.objects.get_or_create(
        name=name,
        defaults={'description': desc}
    )
    cat_objects[name] = cat
    status = "✓ Created" if created else "  Exists"
    print(f"  {status}: {name}")

# Step 2: Create medicines
print("\n2. Creating medicines...")
medicines_data = [
    ('Amoxicillin', '500mg', 'Amoxycillin', 'Pfizer', 'Antibiotics'),
    ('Paracetamol', '500mg', 'Acetaminophen', 'Novartis', 'Pain Relievers'),
    ('Ibuprofen', '400mg', 'Ibuprofen', 'Bayer', 'Anti-inflammatories'),
    ('Aspirin', '100mg', 'Acetylsalicylic acid', 'Bayer', 'Pain Relievers'),
    ('Azithromycin', '500mg', 'Azithromycin', 'Pfizer', 'Antibiotics'),
]

med_objects = []
for name, strength, generic, manufacturer, category_name in medicines_data:
    med, created = Medicine.objects.get_or_create(
        name=name,
        defaults={
            'strength': strength,
            'generic_name': generic,
            'manufacturer': manufacturer,
            'category': cat_objects[category_name]
        }
    )
    med_objects.append(med)
    status = "✓ Created" if created else "  Exists"
    print(f"  {status}: {name} ({strength})")

# Step 3: Get or create locations
print("\n3. Setting up locations...")
province, _ = Province.objects.get_or_create(name='Kigali City')
district, _ = District.objects.get_or_create(
    name='Gasabo',
    defaults={'province': province}
)
sector, _ = Sector.objects.get_or_create(
    name='Ndera',
    defaults={'district': district}
)
print(f"  ✓ Location: {province.name} > {district.name} > {sector.name}")

# Step 4: Create pharmacies
print("\n4. Creating pharmacies...")
pharmacies_data = [
    ('City Pharmacy', '+250788123456', '-1.9536', '29.8739', 'Main street'),
    ('Health Plus', '+250701234567', '-1.9545', '29.8745', 'KG road'),
    ('MediCare', '+250788765432', '-1.9550', '29.8750', 'Ave street'),
]

pharm_objects = []
for name, phone, lat, lng, street in pharmacies_data:
    # Create user for pharmacy
    username = name.lower().replace(' ', '_')
    user, _ = User.objects.get_or_create(
        username=username,
        defaults={
            'email': f'{username}@pharmacy.com',
            'first_name': name,
            'is_active': True
        }
    )
    
    pharm, created = Pharmacy.objects.get_or_create(
        name=name,
        defaults={
            'user': user,
            'phone_number': phone,
            'latitude': float(lat),
            'longitude': float(lng),
            'street_address': street,
            'sector': sector,
            'opening_time': timezone.now().time().replace(hour=8, minute=0),
            'closing_time': timezone.now().time().replace(hour=22, minute=0),
            'is_active': True
        }
    )
    pharm_objects.append(pharm)
    status = "✓ Created" if created else "  Exists"
    print(f"  {status}: {name}")

# Step 5: Create stock records
print("\n5. Creating stock records...")
stock_count = 0
for pharmacy in pharm_objects:
    for medicine in med_objects:
        stock, created = Stock.objects.get_or_create(
            pharmacy=pharmacy,
            medicine=medicine,
            defaults={
                'quantity': 50,
                'price': Decimal('5000.00'),
                'is_in_stock': True,
                'expiry_date': (timezone.now() + timedelta(days=365)).date()
            }
        )
        if created:
            stock_count += 1
            print(f"  ✓ {medicine.name} @ {pharmacy.name} (Qty: 50)")

print(f"\n  Total stock records created: {stock_count}")
print(f"  Total stock records in DB: {Stock.objects.count()}")

print("\n" + "=" * 60)
print("SETUP COMPLETE!")
print("=" * 60)
print("\nNow try searching for medicines in the frontend:")
print("- Search for: 'Amoxicillin', 'Paracetamol', 'Ibuprofen', etc.")
print("- Available At section should show pharmacies with stock")
