import requests
import json

BASE_URL = "http://localhost:8000/api/v1"
TOKEN = "312938d4308452747d49171a88827e5657651367"

headers = {
    "Authorization": f"Token {TOKEN}",
    "Content-Type": "application/json"
}

print("=" * 60)
print("TEST: Medicine search endpoint")
print("=" * 60)
response = requests.get(f"{BASE_URL}/medicines/?search=Paracetamol", headers=headers)
print(f"Status: {response.status_code}")
print(f"Response: {json.dumps(response.json(), indent=2)}")
