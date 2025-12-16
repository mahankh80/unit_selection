"""
اسکریپت برای ایجاد دانشجویان نمونه
"""

import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Student

User = get_user_model()

students_data = [
    {
        "student_id": "4012345678",
        "first_name": "علی",
        "last_name": "احمدی",
        "email": "ali.ahmadi@example.com",
        "phone": "09123456789",
        "major": "مهندسی کامپیوتر",
        "entry_year": 1400,
        "password": "student123"
    },
    {
        "student_id": "4012345679",
        "first_name": "فاطمه",
        "last_name": "رضایی",
        "email": "fateme.rezaei@example.com",
        "phone": "09123456790",
        "major": "مهندسی نرم‌افزار",
        "entry_year": 1400,
        "password": "student123"
    },
    {
        "student_id": "4012345680",
        "first_name": "محمد",
        "last_name": "کریمی",
        "email": "mohammad.karimi@example.com",
        "phone": "09123456791",
        "major": "مهندسی برق",
        "entry_year": 1401,
        "password": "student123"
    },
    {
        "student_id": "4012345681",
        "first_name": "زهرا",
        "last_name": "محمدی",
        "email": "zahra.mohammadi@example.com",
        "phone": "09123456792",
        "major": "مهندسی صنایع",
        "entry_year": 1401,
        "password": "student123"
    },
    {
        "student_id": "4012345682",
        "first_name": "حسین",
        "last_name": "نوری",
        "email": "hossein.nouri@example.com",
        "phone": "09123456793",
        "major": "مهندسی مکانیک",
        "entry_year": 1402,
        "password": "student123"
    },
]

created_count = 0
updated_count = 0

for student_data in students_data:
    password = student_data.pop("password")
    student_id = student_data["student_id"]
    
    try:
        # بررسی اینکه آیا دانشجو قبلاً وجود دارد
        student = Student.objects.get(student_id=student_id)
        
        # اگر دانشجو وجود داشت، User را به‌روزرسانی کن
        if not student.user:
            user = User.objects.create_user(
                username=student_id,
                email=student_data["email"],
                password=password,
                first_name=student_data["first_name"],
                last_name=student_data["last_name"],
                is_staff=False,
                is_superuser=False
            )
            student.user = user
            student.save()
        else:
            # به‌روزرسانی اطلاعات
            student.user.set_password(password)
            student.user.email = student_data["email"]
            student.user.first_name = student_data["first_name"]
            student.user.last_name = student_data["last_name"]
            student.user.save()
            
            for key, value in student_data.items():
                setattr(student, key, value)
            student.save()
        
        updated_count += 1
        print(f'⚠ دانشجو "{student.full_name}" با شماره دانشجویی {student_id} به‌روزرسانی شد')
        
    except Student.DoesNotExist:
        # ایجاد User برای دانشجو
        user = User.objects.create_user(
            username=student_id,
            email=student_data["email"],
            password=password,
            first_name=student_data["first_name"],
            last_name=student_data["last_name"],
            is_staff=False,
            is_superuser=False
        )
        
        # ایجاد Student
        student = Student.objects.create(
            user=user,
            **student_data
        )
        
        created_count += 1
        print(f'✓ دانشجو "{student.full_name}" با شماره دانشجویی {student_id} ایجاد شد')

print(f'\n✅ {created_count} دانشجو ایجاد شد و {updated_count} دانشجو به‌روزرسانی شد')
print(f'📝 رمز عبور همه دانشجویان: student123')
print('\n📋 اطلاعات ورود:')
print('=' * 50)
for student_data in students_data:
    print(f'شماره دانشجویی: {student_data["student_id"]}')
    print(f'نام: {student_data["first_name"]} {student_data["last_name"]}')
    print(f'رمز عبور: student123')
    print('-' * 50)

