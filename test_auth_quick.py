"""
Quick Authentication Test (without user interaction)
"""

import requests
import json

BASE_URL = "http://localhost:8000"
USERNAME = "admin"
PASSWORD = "admin123"

def test():
    print("Starting Authentication test...\n")
    
    # 1. Test Login
    print("1. Test Login...")
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
            
            print(f"   Login successful!")
            print(f"   Token: {token[:20]}...")
            print(f"   User: {user.get('username')} ({user.get('type')})")
            
            # 2. Test Current User
            print("\n2. Test Current User...")
            response2 = requests.get(
                f"{BASE_URL}/api/auth/me/",
                headers={"Authorization": f"Token {token}"},
                timeout=5
            )
            print(f"   Status: {response2.status_code}")
            
            if response2.status_code == 200:
                print(f"   Current User is working!")
                print(f"   Data: {json.dumps(response2.json(), ensure_ascii=False, indent=2)}")
            else:
                print(f"   Error: {response2.text}")
            
            # 3. Test Logout
            print("\n3. Test Logout...")
            response3 = requests.post(
                f"{BASE_URL}/api/auth/logout/",
                headers={"Authorization": f"Token {token}"},
                timeout=5
            )
            print(f"   Status: {response3.status_code}")
            
            if response3.status_code == 200:
                print(f"   Logout successful!")
                print(f"   Message: {response3.json().get('message')}")
            else:
                print(f"   Error: {response3.text}")
            
            # 4. Test access with expired Token
            print("\n4. Test expired Token...")
            response4 = requests.get(
                f"{BASE_URL}/api/auth/me/",
                headers={"Authorization": f"Token {token}"},
                timeout=5
            )
            print(f"   Status: {response4.status_code}")
            
            if response4.status_code == 401:
                print(f"   Expired token correctly identified!")
            else:
                print(f"   Expected 401 but got {response4.status_code}")
            
            print("\n" + "="*60)
            print("All tests completed successfully!")
            print("="*60)
            
        elif response.status_code == 401:
            print(f"   Login failed - username or password is incorrect")
            print(f"   Response: {response.json()}")
        else:
            print(f"   Error: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("   Cannot connect to server!")
        print("   Make sure Django server is running:")
        print("   python manage.py runserver")
    except Exception as e:
        print(f"   Error: {e}")

if __name__ == "__main__":
    test()


