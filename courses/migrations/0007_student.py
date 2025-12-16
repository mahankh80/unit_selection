# Generated manually

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('courses', '0006_alter_course_capacity_alter_course_exam_time_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Student',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('student_id', models.CharField(max_length=20, unique=True, verbose_name='شماره دانشجویی')),
                ('first_name', models.CharField(max_length=100, verbose_name='نام')),
                ('last_name', models.CharField(max_length=100, verbose_name='نام خانوادگی')),
                ('email', models.EmailField(max_length=254, verbose_name='ایمیل')),
                ('phone', models.CharField(blank=True, max_length=20, null=True, verbose_name='شماره تلفن')),
                ('major', models.CharField(blank=True, max_length=100, null=True, verbose_name='رشته تحصیلی')),
                ('entry_year', models.PositiveIntegerField(blank=True, null=True, verbose_name='سال ورود')),
                ('is_active', models.BooleanField(default=True, verbose_name='فعال')),
                ('created_at', models.DateTimeField(auto_now_add=True, verbose_name='تاریخ ایجاد')),
                ('updated_at', models.DateTimeField(auto_now=True, verbose_name='تاریخ به‌روزرسانی')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='student_profile', to=settings.AUTH_USER_MODEL, verbose_name='کاربر')),
            ],
            options={
                'verbose_name': 'دانشجو',
                'verbose_name_plural': 'دانشجویان',
                'ordering': ['student_id'],
            },
        ),
    ]

