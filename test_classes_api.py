"""
تست API های Course و CourseOffering
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_result(title, response):
    print(f"\n{'='*60}")
    print(f"📌 {title}")
    print(f"{'='*60}")
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except:
        print(response.text)


def test_classes_api():
    print("🚀 تست API های Course و CourseOffering...")
    
    # 1. Login
    print("\n1️⃣ Login...")
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={"username": "admin", "password": "admin123"}
    )
    
    if login_response.status_code != 200:
        print("❌ Login ناموفق!")
        return
    
    token = login_response.json()["token"]
    headers = {"Authorization": f"Token {token}"}
    print(f"✅ Token: {token[:30]}...")
    
    # 2. لیست دروس (Course)
    print("\n2️⃣ لیست دروس (تعریف درس)...")
    response = requests.get(f"{BASE_URL}/api/courses/", headers=headers)
    print_result("GET /api/courses/", response)
    
    if response.status_code == 200:
        courses = response.json()
        print(f"تعداد دروس: {len(courses)}")
        if courses:
            course_id = courses[0]["id"]
            print(f"ID اولین درس: {course_id}")
    
    # 3. لیست کلاس‌ها (CourseOffering)
    print("\n3️⃣ لیست کلاس‌ها (برگزاری درس)...")
    response = requests.get(f"{BASE_URL}/api/classes/", headers=headers)
    print_result("GET /api/classes/", response)
    
    if response.status_code == 200:
        classes = response.json()
        print(f"تعداد کلاس‌ها: {len(classes)}")
    
    # 4. آمار کلاس‌ها
    print("\n4️⃣ آمار کلاس‌ها...")
    response = requests.get(f"{BASE_URL}/api/classes/stats/", headers=headers)
    print_result("GET /api/classes/stats/", response)
    
    # 5. ایجاد کلاس جدید
    print("\n5️⃣ ایجاد کلاس جدید...")
    if 'course_id' in locals():
        new_class = {
            "course_id": course_id,
            "instructor": "دکتر محمدی",
            "class_number": "02",
            "capacity": 25,
            "class_time": "دوشنبه 10-12",
            "exam_time": "1404/04/15 - ساعت 9",
            "semester": "1404-1"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/classes/",
            headers=headers,
            json=new_class
        )
        print_result("POST /api/classes/", response)
        
        if response.status_code == 201:
            class_id = response.json()["id"]
            print(f"✅ کلاس جدید ایجاد شد با ID: {class_id}")
            
            # 6. حذف کلاس تست
            print("\n6️⃣ حذف کلاس تست...")
            response = requests.delete(
                f"{BASE_URL}/api/classes/{class_id}/",
                headers=headers
            )
            print(f"DELETE /api/classes/{class_id}/: {response.status_code}")
    
    print("\n" + "="*60)
    print("✅ تست API ها کامل شد!")
    print("="*60)


if __name__ == "__main__":
    try:
        test_classes_api()
    except requests.exceptions.ConnectionError:
        print("\n❌ خطا: سرور Django در حال اجرا نیست!")
        print("python manage.py runserver")
    except Exception as e:
        print(f"\n❌ خطا: {e}")
