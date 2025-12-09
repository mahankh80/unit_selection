from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Course(models.Model):
    """
    مدل تعریف درس - فقط اطلاعات پایه درس
    """
    name = models.CharField(max_length=255, verbose_name="نام درس")
    code = models.CharField(max_length=50, unique=True, verbose_name="کد درس")
    units = models.PositiveIntegerField(verbose_name="تعداد واحد")
    
    # این فیلدها موقتاً باقی می‌مانند تا migration انجام شود
    capacity = models.PositiveIntegerField(
        verbose_name="ظرفیت",
        default=0,
        blank=True,
    )
    professor = models.CharField(
        max_length=255,
        verbose_name="استاد",
        blank=True,
        default="",
    )
    time = models.CharField(
        max_length=255,
        verbose_name="زمان",
        blank=True,
        default="",
    )
    location = models.CharField(
        max_length=255,
        verbose_name="مکان",
        blank=True,
        default="",
    )
    exam_time = models.CharField(
        max_length=255,
        verbose_name="زمان امتحان",
        blank=True,
        default="",
    )
    
    prerequisites = models.ManyToManyField(
        "self", 
        blank=True, 
        symmetrical=False, 
        related_name="dependent_courses",
        verbose_name="پیش‌نیازها"
    )
    
    COURSE_TYPE_CHOICES = [
        ("THEORETICAL", "نظری"),
        ("PRACTICAL", "عملی"),
        ("GENERAL", "عمومی"),
        ("ELECTIVE", "اختیاری"),
    ]
    course_type = models.CharField(
        max_length=20, 
        choices=COURSE_TYPE_CHOICES,
        default="THEORETICAL",
        verbose_name="نوع درس"
    )

    class Meta:
        verbose_name = "درس"
        verbose_name_plural = "دروس"
        ordering = ["code"]

    def __str__(self) -> str:
        return f"{self.code} - {self.name}"


class CourseOffering(models.Model):
    """
    مدل برگزاری کلاس - هر بار که یک درس برگزار می‌شود
    """
    course = models.ForeignKey(
        Course, 
        on_delete=models.CASCADE,
        related_name="offerings",
        verbose_name="درس"
    )
    instructor = models.CharField(max_length=255, verbose_name="استاد")
    class_number = models.CharField(max_length=50, verbose_name="شماره کلاس")
    capacity = models.PositiveIntegerField(verbose_name="ظرفیت")
    enrolled_count = models.PositiveIntegerField(default=0, verbose_name="تعداد ثبت‌نام")
    class_time = models.CharField(max_length=255, verbose_name="زمان کلاس")
    exam_time = models.CharField(max_length=255, verbose_name="زمان امتحان")
    semester = models.CharField(
        max_length=50,
        default="1404-1",
        verbose_name="نیمسال"
    )
    is_active = models.BooleanField(default=True, verbose_name="فعال")
    
    class Meta:
        verbose_name = "کلاس"
        verbose_name_plural = "کلاس‌ها"
        ordering = ["course__code", "class_number"]
        unique_together = [["course", "class_number", "semester"]]
    
    def __str__(self) -> str:
        return f"{self.course.code} - {self.instructor} - کلاس {self.class_number}"
    
    @property
    def is_full(self) -> bool:
        """آیا کلاس پر است؟"""
        return self.enrolled_count >= self.capacity
    
    @property
    def available_seats(self) -> int:
        """تعداد صندلی‌های خالی"""
        return max(0, self.capacity - self.enrolled_count)
