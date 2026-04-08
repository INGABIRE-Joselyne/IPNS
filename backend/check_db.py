import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from apps.pharmacies.models import Pharmacy
from apps.inventory.models import Stock

# List all users
users = User.objects.all()
print(f"Total users: {users.count()}")
for user in users:
    print(f"  - {user.username} ({user.email})")
    try:
        token = Token.objects.get(user=user)
        print(f"    Token: {token.key}")
    except Token.DoesNotExist:
        print(f"    No token")
    
    try:
        pharmacy = Pharmacy.objects.get(user=user)
        print(f"    Pharmacy: {pharmacy.name} (ID: {pharmacy.id})")
    except Pharmacy.DoesNotExist:
        print(f"    No pharmacy")

print("\n---\n")

# List all pharmacies
pharmacies = Pharmacy.objects.all()
print(f"Total pharmacies: {pharmacies.count()}")
for pharmacy in pharmacies:
    print(f"  - {pharmacy.name} (ID: {pharmacy.id})")

print("\n---\n")

# List all stock records
stocks = Stock.objects.all()
print(f"Total stock records: {stocks.count()}")
for stock in stocks[:5]:
    print(f"  - {stock.medicine.name} @ {stock.pharmacy.name} (Qty: {stock.quantity})")

print("\n---\n")

# Check medicines count
from apps.medicines.models import Medicine
medicines = Medicine.objects.all()
print(f"Total medicines: {medicines.count()}")
