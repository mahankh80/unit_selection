from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Course(models.Model):
    name = models.CharField(max_length=255)
    code = models.CharField(max_length=50, unique=True)
    units = models.PositiveIntegerField()
    capacity = models.PositiveIntegerField()
    professor = models.CharField(max_length=255)
    time = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    exam_time = models.CharField(max_length=255)
    prerequisites = models.ManyToManyField("self", blank=True, symmetrical=False, related_name="dependent_courses")
    COURSE_TYPE_CHOICES = [
        ("GENERAL", "عمومی"),
        ("PRACTICAL", "عملی"),
        ("CORE", "اصلی"),
        ("SPECIALIZED", "تخصصی"),
    ]
    course_type = models.CharField(max_length=20, choices=COURSE_TYPE_CHOICES)

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"
