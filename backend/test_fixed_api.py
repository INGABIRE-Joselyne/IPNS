import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
TOKEN = "312938d4308452747d49171a88827e5657651367"

headers = {
    "Authorization": f"Token {TOKEN}",
    "Content-Type": "application/json"
}

print("=" * 60)
print("TEST: POST new stock record with CORRECT field names")
print("=" * 60)
data = {
    "medicine_id": 1,
    "pharmacy_id": 3,
    "quantity": 10
}
print(f"Sending: {json.dumps(data, indent=2)}")
response = requests.post(f"{BASE_URL}/inventory/stock/", json=data, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

if response.status_code == 201:
    print("\n✅ SUCCESS! Stock record created!")
    stock_id = response.json()['id']
    
    print("\n" + "=" * 60)
    print("TEST: GET inventory after creating stock")
    print("=" * 60)
    response = requests.get(f"{BASE_URL}/inventory/stock/?pharmacy_id=3", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {json.dumps(response.json(), indent=2)}")
else:
    print("\n❌ FAILED! Check response above for errors")
