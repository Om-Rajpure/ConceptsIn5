import requests

try:
    response = requests.get('http://localhost:8000/api/admin/stats/')
    print(f"Status Code: {response.status_code}")
    print(response.json())
except Exception as e:
    print(f"Request failed: {e}")
