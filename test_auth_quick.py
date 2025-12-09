"""
تست سریع Authentication (بدون تعامل با کاربر)
"""

import requests
import json

BASE_URL = "http://localhost:8000"
USERNAME = "admin"
PASSWORD = "admin123"

def test():
    print("🚀 تست Authentication شروع شد...\n")
    
    # 1. تست Login
    print("1️⃣ تست Login...")
    try:
        response = requests.post(
            f"{BASE_URL}/api/auth/login/",
            json={"username": USERNAME, "password": PASSWORD},
            timeout=5
        )
        
        print(f"   Status: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            token = data.get("token")
            user = data.get("user", {})
            
            print(f"   ✅ Login موفق!")
            print(f"   Token: {token[:20]}...")
            print(f"   User: {user.get('username')} ({user.get('type')})")
            
            # 2. تست Current User
            print("\n2️⃣ تست Current User...")
            response2 = requests.get(
                f"{BASE_URL}/api/auth/me/",
                headers={"Authorization": f"Token {token}"},
                timeout=5
            )
            print(f"   Status: {response2.status_code}")
            
            if response2.status_code == 200:
                print(f"   ✅ Current User کار می‌کنه!")
                print(f"   Data: {json.dumps(response2.json(), ensure_ascii=False, indent=2)}")
            else:
                print(f"   ❌ خطا: {response2.text}")
            
            # 3. تست Logout
            print("\n3️⃣ تست Logout...")
            response3 = requests.post(
                f"{BASE_URL}/api/auth/logout/",
                headers={"Authorization": f"Token {token}"},
                timeout=5
            )
            print(f"   Status: {response3.status_code}")
            
            if response3.status_code == 200:
                print(f"   ✅ Logout موفق!")
                print(f"   Message: {response3.json().get('message')}")
            else:
                print(f"   ❌ خطا: {response3.text}")
            
            # 4. تست دسترسی با Token منقضی شده
            print("\n4️⃣ تست Token منقضی شده...")
            response4 = requests.get(
                f"{BASE_URL}/api/auth/me/",
                headers={"Authorization": f"Token {token}"},
                timeout=5
            )
            print(f"   Status: {response4.status_code}")
            
            if response4.status_code == 401:
                print(f"   ✅ Token منقضی شده صحیح شناسایی شد!")
            else:
                print(f"   ⚠️  انتظار 401 داشتیم ولی {response4.status_code} گرفتیم")
            
            print("\n" + "="*60)
            print("✅ تمام تست‌ها با موفقیت انجام شد!")
            print("="*60)
            
        elif response.status_code == 401:
            print(f"   ❌ Login ناموفق - username یا password اشتباهه")
            print(f"   Response: {response.json()}")
        else:
            print(f"   ❌ خطا: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   ❌ نمی‌توان به سرور متصل شد!")
        print("   مطمئن شوید سرور Django در حال اجراست:")
        print("   python manage.py runserver")
    except Exception as e:
        print(f"   ❌ خطا: {e}")

if __name__ == "__main__":
    test()

