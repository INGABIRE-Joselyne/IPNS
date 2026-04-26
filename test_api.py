import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
TOKEN = "312938d4308452747d49171a88827e5657651367"

headers = {
    "Authorization": f"Token {TOKEN}",
    "Content-Type": "application/json"
}

print("=" * 60)
print("TEST 1: GET inventory stock list")
print("=" * 60)
response = requests.get(f"{BASE_URL}/inventory/stock/?pharmacy_id=3", headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "=" * 60)
print("TEST 2: POST new stock record")
print("=" * 60)
data = {
    "medicine": 1,
    "pharmacy": 3,
    "quantity": 10
}
print(f"Sending: {json.dumps(data, indent=2)}")
response = requests.post(f"{BASE_URL}/inventory/stock/", json=data, headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")

print("\n" + "=" * 60)
print("TEST 3: GET medicine list")
print("=" * 60)
response = requests.get(f"{BASE_URL}/medicines/?search=Paracetamol", headers=headers)
print(f"Status: {response.status_code}")
print(f"Response (first 2): {json.dumps(response.json()[:2] if isinstance(response.json(), list) else {'results': response.json().get('results', [])[:2]}, indent=2)}")
