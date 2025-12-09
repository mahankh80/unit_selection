"""
اسکریپت تست Authentication
برای اجرا: python test_auth.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_response(response, title):
    print(f"\n{'='*60}")
    print(f"📌 {title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response:\n{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Response: {response.text}")


def test_authentication():
    print("\n🚀 شروع تست Authentication...")
    
    # 1. تست Login با اطلاعات نادرست
    print("\n1️⃣ تست Login با رمز اشتباه...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={
            "username": "admin",
            "password": "wrongpassword"
        }
    )
    print_response(response, "Login با رمز اشتباه (باید 401 باشه)")
    
    # 2. تست Login با اطلاعات خالی
    print("\n2️⃣ تست Login بدون اطلاعات...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={}
    )
    print_response(response, "Login بدون اطلاعات (باید 400 باشه)")
    
    # 3. تست Login موفق
    print("\n3️⃣ تست Login موفق...")
    print("⚠️  نام کاربری و رمز عبور admin خود را وارد کنید:")
    username = input("Username: ").strip() or "admin"
    password = input("Password: ").strip() or "admin123"
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={
            "username": username,
            "password": password
        }
    )
    print_response(response, "Login موفق (باید 200 و token داشته باشه)")
    
    if response.status_code != 200:
        print("\n❌ Login ناموفق بود! لطفاً:")
        print("   1. مطمئن شوید سرور Django در حال اجراست (python manage.py runserver)")
        print("   2. یک superuser ساخته باشید (python manage.py createsuperuser)")
        print("   3. نام کاربری و رمز عبور را درست وارد کرده باشید")
        return
    
    # دریافت token
    token = response.json().get("token")
    print(f"\n✅ Token دریافت شد: {token[:20]}...")
    
    # 4. تست Current User
    print("\n4️⃣ تست دریافت اطلاعات کاربر...")
    response = requests.get(
        f"{BASE_URL}/api/auth/me/",
        headers={"Authorization": f"Token {token}"}
    )
    print_response(response, "اطلاعات کاربر (باید 200 باشه)")
    
    # 5. تست دسترسی بدون Token
    print("\n5️⃣ تست دسترسی بدون Token...")
    response = requests.get(f"{BASE_URL}/api/auth/me/")
    print_response(response, "دسترسی بدون Token (باید 401 باشه)")
    
    # 6. تست Logout
    print("\n6️⃣ تست Logout...")
    response = requests.post(
        f"{BASE_URL}/api/auth/logout/",
        headers={"Authorization": f"Token {token}"}
    )
    print_response(response, "Logout (باید 200 باشه)")
    
    # 7. تست دسترسی با Token منقضی شده
    print("\n7️⃣ تست دسترسی با Token منقضی شده...")
    response = requests.get(
        f"{BASE_URL}/api/auth/me/",
        headers={"Authorization": f"Token {token}"}
    )
    print_response(response, "دسترسی با Token منقضی (باید 401 باشه)")
    
    print("\n" + "="*60)
    print("✅ تست‌ها به پایان رسید!")
    print("="*60)


if __name__ == "__main__":
    try:
        test_authentication()
    except requests.exceptions.ConnectionError:
        print("\n❌ خطا: نمی‌توان به سرور متصل شد!")
        print("لطفاً مطمئن شوید سرور Django در حال اجراست:")
        print("   cd es")
        print("   python manage.py runserver")
    except KeyboardInterrupt:
        print("\n\n⛔ تست توسط کاربر متوقف شد.")
    except Exception as e:
        print(f"\n❌ خطای غیرمنتظره: {e}")

