"""
تست ایجاد درس جدید بدون فیلدهای قدیمی
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
    print("❌ Login ناموفق!")
    exit(1)

token = login_response.json()["token"]
headers = {"Authorization": f"Token {token}"}

# ایجاد درس جدید (بدون فیلدهای قدیمی)
course_data = {
    "name": "مبانی برنامه‌نویسی",
    "code": "100",
    "units": 3,
    "course_type": "THEORETICAL",
    "prerequisites": []
}

print("📤 ارسال درخواست ایجاد درس...")
print(f"Data: {json.dumps(course_data, ensure_ascii=False, indent=2)}")

response = requests.post(
    f"{BASE_URL}/api/courses/",
    headers=headers,
    json=course_data
)

print(f"\n📥 Status Code: {response.status_code}")

if response.status_code == 201:
    print("✅ درس با موفقیت ایجاد شد!")
    print(f"Response:\n{json.dumps(response.json(), ensure_ascii=False, indent=2)}")
else:
    print("❌ خطا در ایجاد درس!")
    print(f"Response: {response.text}")

