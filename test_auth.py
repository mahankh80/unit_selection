"""
Authentication Test Script
To run: python test_auth.py
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_response(response, title):
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response:\n{json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Response: {response.text}")


def test_authentication():
    print("\nStarting Authentication test...")
    
    # 1. Test Login with wrong credentials
    print("\n1. Test Login with wrong password...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={
            "username": "admin",
            "password": "wrongpassword"
        }
    )
    print_response(response, "Login with wrong password (should be 401)")
    
    # 2. Test Login with empty data
    print("\n2. Test Login without data...")
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={}
    )
    print_response(response, "Login without data (should be 400)")
    
    # 3. Test successful Login
    print("\n3. Test successful Login...")
    print("Enter your admin username and password:")
    username = input("Username: ").strip() or "admin"
    password = input("Password: ").strip() or "admin123"
    
    response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={
            "username": username,
            "password": password
        }
    )
    print_response(response, "Successful Login (should be 200 and have token)")
    
    if response.status_code != 200:
        print("\nLogin failed! Please:")
        print("   1. Make sure Django server is running (python manage.py runserver)")
        print("   2. Create a superuser (python manage.py createsuperuser)")
        print("   3. Enter correct username and password")
        return
    
    # Get token
    token = response.json().get("token")
    print(f"\nToken received: {token[:20]}...")
    
    # 4. Test Current User
    print("\n4. Test get user information...")
    response = requests.get(
        f"{BASE_URL}/api/auth/me/",
        headers={"Authorization": f"Token {token}"}
    )
    print_response(response, "User information (should be 200)")
    
    # 5. Test access without Token
    print("\n5. Test access without Token...")
    response = requests.get(f"{BASE_URL}/api/auth/me/")
    print_response(response, "Access without Token (should be 401)")
    
    # 6. Test Logout
    print("\n6. Test Logout...")
    response = requests.post(
        f"{BASE_URL}/api/auth/logout/",
        headers={"Authorization": f"Token {token}"}
    )
    print_response(response, "Logout (should be 200)")
    
    # 7. Test access with expired Token
    print("\n7. Test access with expired Token...")
    response = requests.get(
        f"{BASE_URL}/api/auth/me/",
        headers={"Authorization": f"Token {token}"}
    )
    print_response(response, "Access with expired Token (should be 401)")
    
    print("\n" + "="*60)
    print("Tests completed!")
    print("="*60)


if __name__ == "__main__":
    try:
        test_authentication()
    except requests.exceptions.ConnectionError:
        print("\nERROR: Cannot connect to server!")
        print("Please make sure Django server is running:")
        print("   cd es")
        print("   python manage.py runserver")
    except KeyboardInterrupt:
        print("\n\nTest stopped by user.")
    except Exception as e:
        print(f"\nUnexpected error: {e}")


