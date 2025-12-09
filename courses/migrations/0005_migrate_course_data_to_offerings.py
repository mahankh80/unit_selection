# Generated manually for data migration

from django.db import migrations


def migrate_courses_to_offerings(apps, schema_editor):
    """
    انتقال داده‌های professor, time, location از Course به CourseOffering
    """
    Course = apps.get_model("courses", "Course")
    CourseOffering = apps.get_model("courses", "CourseOffering")
    
    for course in Course.objects.all():
        # اگر این فیلدها مقدار دارند، یک CourseOffering بسازیم
        if course.professor and course.time:
            CourseOffering.objects.create(
                course=course,
                instructor=course.professor,
                class_number="01",  # شماره پیش‌فرض کلاس
                capacity=course.capacity if course.capacity else 30,
                enrolled_count=0,
                class_time=course.time,
                exam_time=course.exam_time if course.exam_time else "نامشخص",
                semester="1404-1",  # ترم جاری
                is_active=True,
            )
            print(f"✓ کلاس برای درس {course.code} - {course.name} ایجاد شد")


def reverse_migration(apps, schema_editor):
    """
    برگرداندن داده‌ها در صورت rollback
    """
    CourseOffering = apps.get_model("courses", "CourseOffering")
    CourseOffering.objects.all().delete()


class Migration(migrations.Migration):
    
    dependencies = [
        ("courses", "0004_alter_course_options_alter_course_capacity_and_more"),
    ]
    
    operations = [
        migrations.RunPython(
            migrate_courses_to_offerings,
            reverse_code=reverse_migration
        ),
    ]
