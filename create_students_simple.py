import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.contrib.auth import get_user_model
from courses.models import Student

User = get_user_model()

students = [
    ("4012345678", "علی", "احمدی", "ali.ahmadi@example.com", "09123456789", "مهندسی کامپیوتر", 1400),
    ("4012345679", "فاطمه", "رضایی", "fateme.rezaei@example.com", "09123456790", "مهندسی نرم‌افزار", 1400),
    ("4012345680", "محمد", "کریمی", "mohammad.karimi@example.com", "09123456791", "مهندسی برق", 1401),
    ("4012345681", "زهرا", "محمدی", "zahra.mohammadi@example.com", "09123456792", "مهندسی صنایع", 1401),
    ("4012345682", "حسین", "نوری", "hossein.nouri@example.com", "09123456793", "مهندسی مکانیک", 1402),
]

password = "student123"

for sid, fname, lname, email, phone, major, year in students:
    try:
        student = Student.objects.get(student_id=sid)
        print(f"⚠ دانشجو {sid} قبلاً وجود دارد")
    except Student.DoesNotExist:
        user = User.objects.create_user(
            username=sid,
            email=email,
            password=password,
            first_name=fname,
            last_name=lname,
            is_staff=False
        )
        student = Student.objects.create(
            user=user,
            student_id=sid,
            first_name=fname,
            last_name=lname,
            email=email,
            phone=phone,
            major=major,
            entry_year=year
        )
        print(f"✓ دانشجو {sid} - {fname} {lname} ایجاد شد")

print("\n✅ تمام!")
print("📝 رمز عبور همه: student123")

