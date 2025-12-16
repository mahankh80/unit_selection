"""
Management command برای ایجاد دانشجویان نمونه
استفاده: python manage.py create_sample_students
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from courses.models import Student

User = get_user_model()


class Command(BaseCommand):
    help = 'ایجاد دانشجویان نمونه در دیتابیس'

    def handle(self, *args, **options):
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
            
            # بررسی اینکه آیا دانشجو قبلاً وجود دارد
            student, created = Student.objects.get_or_create(
                student_id=student_id,
                defaults=student_data
            )
            
            if created:
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
                student.user = user
                student.save()
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ دانشجو "{student.full_name}" با شماره دانشجویی {student_id} ایجاد شد'
                    )
                )
            else:
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
                self.stdout.write(
                    self.style.WARNING(
                        f'⚠ دانشجو "{student.full_name}" با شماره دانشجویی {student_id} به‌روزرسانی شد'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✅ {created_count} دانشجو ایجاد شد و {updated_count} دانشجو به‌روزرسانی شد'
            )
        )
        self.stdout.write(
            self.style.SUCCESS(
                f'📝 رمز عبور همه دانشجویان: student123'
            )
        )

