"""
Test Course and CourseOffering APIs
"""

import requests
import json

BASE_URL = "http://localhost:8000"

def print_result(title, response):
    print(f"\n{'='*60}")
    print(f"{title}")
    print(f"{'='*60}")
    print(f"Status: {response.status_code}")
    try:
        data = response.json()
        print(json.dumps(data, indent=2, ensure_ascii=False))
    except:
        print(response.text)


def test_classes_api():
    print("Testing Course and CourseOffering APIs...")
    
    # 1. Login
    print("\n1. Login...")
    login_response = requests.post(
        f"{BASE_URL}/api/auth/login/",
        json={"username": "admin", "password": "admin123"}
    )
    
    if login_response.status_code != 200:
        print("Login failed!")
        return
    
    token = login_response.json()["token"]
    headers = {"Authorization": f"Token {token}"}
    print(f"Token: {token[:30]}...")
    
    # 2. Courses list (Course)
    print("\n2. Courses list (Course definition)...")
    response = requests.get(f"{BASE_URL}/api/courses/", headers=headers)
    print_result("GET /api/courses/", response)
    
    if response.status_code == 200:
        courses = response.json()
        print(f"Number of courses: {len(courses)}")
        if courses:
            course_id = courses[0]["id"]
            print(f"First course ID: {course_id}")
    
    # 3. Classes list (CourseOffering)
    print("\n3. Classes list (Course offering)...")
    response = requests.get(f"{BASE_URL}/api/classes/", headers=headers)
    print_result("GET /api/classes/", response)
    
    if response.status_code == 200:
        classes = response.json()
        print(f"Number of classes: {len(classes)}")
    
    # 4. Classes statistics
    print("\n4. Classes statistics...")
    response = requests.get(f"{BASE_URL}/api/classes/stats/", headers=headers)
    print_result("GET /api/classes/stats/", response)
    
    # 5. Create new class
    print("\n5. Create new class...")
    if 'course_id' in locals():
        new_class = {
            "course_id": course_id,
            "instructor": "Dr. Mohammadi",
            "class_number": "02",
            "capacity": 25,
            "class_time": "Monday 10-12",
            "exam_time": "2024/04/15 - 9:00",
            "semester": "2024-1"
        }
        
        response = requests.post(
            f"{BASE_URL}/api/classes/",
            headers=headers,
            json=new_class
        )
        print_result("POST /api/classes/", response)
        
        if response.status_code == 201:
            class_id = response.json()["id"]
            print(f"New class created with ID: {class_id}")
            
            # 6. Delete test class
            print("\n6. Delete test class...")
            response = requests.delete(
                f"{BASE_URL}/api/classes/{class_id}/",
                headers=headers
            )
            print(f"DELETE /api/classes/{class_id}/: {response.status_code}")
    
    print("\n" + "="*60)
    print("API tests completed!")
    print("="*60)


if __name__ == "__main__":
    try:
        test_classes_api()
    except requests.exceptions.ConnectionError:
        print("\nERROR: Django server is not running!")
        print("python manage.py runserver")
    except Exception as e:
        print(f"\nError: {e}")

