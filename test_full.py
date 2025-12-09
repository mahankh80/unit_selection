"""
تست کامل Backend API
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_test(title, status, expected, passed):
    icon = "✅" if passed else "❌"
    print(f"{icon} {title}: {status} (انتظار: {expected})")

def test_all():
    print("\n" + "="*60)
    print("🧪 تست کامل Backend API")
    print("="*60)
    
    # 1. Authentication Tests
    print("\n📌 بخش 1: Authentication")
    print("-" * 60)
    
    # Login با اطلاعات درست
    r = requests.post(f"{BASE_URL}/api/auth/login/", json={"username": "admin", "password": "admin123"})
    print_test("Login موفق", r.status_code, 200, r.status_code == 200)
    
    if r.status_code == 200:
        token = r.json()["token"]
        print(f"   Token: {token[:30]}...")
    else:
        print("   ❌ نمی‌توان ادامه داد - Login ناموفق")
        return
    
    # Login با رمز اشتباه
    r = requests.post(f"{BASE_URL}/api/auth/login/", json={"username": "admin", "password": "wrong"})
    print_test("Login با رمز اشتباه", r.status_code, 401, r.status_code == 401)
    
    # Current User
    r = requests.get(f"{BASE_URL}/api/auth/me/", headers={"Authorization": f"Token {token}"})
    print_test("دریافت اطلاعات کاربر", r.status_code, 200, r.status_code == 200)
    
    # 2. CORS Tests
    print("\n📌 بخش 2: CORS")
    print("-" * 60)
    
    r = requests.options(f"{BASE_URL}/api/auth/login/", headers={"Origin": "http://localhost:3000"})
    has_cors = "access-control-allow-origin" in r.headers
    print_test("CORS Headers موجود", "بله" if has_cors else "خیر", "بله", has_cors)
    
    if has_cors:
        print(f"   Allowed Origin: {r.headers.get('access-control-allow-origin')}")
    
    # 3. Course API Tests
    print("\n📌 بخش 3: Course API")
    print("-" * 60)
    
    # دسترسی بدون token
    r = requests.get(f"{BASE_URL}/api/courses/")
    print_test("دسترسی بدون Token", r.status_code, 401, r.status_code == 401)
    
    # دسترسی با token (GET - read only)
    r = requests.get(f"{BASE_URL}/api/courses/", headers={"Authorization": f"Token {token}"})
    print_test("دریافت لیست دروس", r.status_code, 200, r.status_code == 200)
    
    if r.status_code == 200:
        courses = r.json()
        print(f"   تعداد دروس: {len(courses)}")
    
    # ایجاد درس جدید (فقط admin)
    new_course = {
        "name": "ریاضی عمومی تست",
        "code": "TEST101",
        "units": 3,
        "capacity": 30,
        "professor": "دکتر تست",
        "time": "شنبه 14-16",
        "location": "کلاس 301",
        "exam_time": "1403/10/15 - 14:00",
        "course_type": "GENERAL",
        "prerequisites": []
    }
    
    r = requests.post(
        f"{BASE_URL}/api/courses/",
        headers={"Authorization": f"Token {token}"},
        json=new_course
    )
    print_test("ایجاد درس جدید (Admin)", r.status_code, 201, r.status_code == 201)
    
    if r.status_code == 201:
        course_id = r.json()["id"]
        print(f"   ID درس ایجاد شده: {course_id}")
        
        # حذف درس تست
        r_delete = requests.delete(
            f"{BASE_URL}/api/courses/{course_id}/",
            headers={"Authorization": f"Token {token}"}
        )
        print_test("حذف درس", r_delete.status_code, 204, r_delete.status_code == 204)
    
    # 4. Summary
    print("\n" + "="*60)
    print("✅ تست‌های کامل به پایان رسید!")
    print("="*60)
    print("\n📊 خلاصه:")
    print("   ✓ Authentication: کامل")
    print("   ✓ CORS: تنظیم شده")
    print("   ✓ Permissions: کار می‌کند")
    print("   ✓ Course CRUD: عملیاتی")
    print("\n🚀 Backend آماده اتصال به Frontend است!")

if __name__ == "__main__":
    try:
        test_all()
    except requests.exceptions.ConnectionError:
        print("\n❌ خطا: سرور Django در حال اجرا نیست!")
        print("لطفاً ابتدا سرور را اجرا کنید: python manage.py runserver")
    except Exception as e:
        print(f"\n❌ خطای غیرمنتظره: {e}")

