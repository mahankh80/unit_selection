"""
Test creating new course without old fields
"""

import requests
import json

BASE_URL = "http://localhost:8000"

# Login
login_response = requests.post(
    f"{BASE_URL}/api/auth/login/",
    json={"username": "admin", "password": "admin123"}
)

if login_response.status_code != 200:
    print("Login failed!")
    exit(1)

token = login_response.json()["token"]
headers = {"Authorization": f"Token {token}"}

# Create new course (without old fields)
course_data = {
    "name": "Programming Fundamentals",
    "code": "100",
    "units": 3,
    "course_type": "THEORETICAL",
    "prerequisites": []
}

print("Sending course creation request...")
print(f"Data: {json.dumps(course_data, ensure_ascii=False, indent=2)}")

response = requests.post(
    f"{BASE_URL}/api/courses/",
    headers=headers,
    json=course_data
)

print(f"\nStatus Code: {response.status_code}")

if response.status_code == 201:
    print("Course created successfully!")
    print(f"Response:\n{json.dumps(response.json(), ensure_ascii=False, indent=2)}")
else:
    print("Error creating course!")
    print(f"Response: {response.text}")


