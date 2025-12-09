from rest_framework import serializers

from .models import Course, CourseOffering


class CourseSerializer(serializers.ModelSerializer):
    """Serializer برای مدل Course (تعریف درس)"""
    
    class Meta:
        model = Course
        fields = [
            "id",
            "name",
            "code",
            "units",
            "course_type",
            "prerequisites",
            # فیلدهای زیر موقتاً باقی می‌مانند (optional با default)
            "capacity",
            "professor",
            "time",
            "location",
            "exam_time",
        ]
        read_only_fields = ["id"]
        extra_kwargs = {
            "capacity": {"required": False},
            "professor": {"required": False},
            "time": {"required": False},
            "location": {"required": False},
            "exam_time": {"required": False},
        }


class CourseOfferingSerializer(serializers.ModelSerializer):
    """Serializer برای مدل CourseOffering (برگزاری کلاس)"""
    
    # نمایش اطلاعات درس به صورت nested
    course_detail = CourseSerializer(source="course", read_only=True)
    
    # فقط ID درس برای ایجاد/ویرایش
    course_id = serializers.PrimaryKeyRelatedField(
        queryset=Course.objects.all(),
        source="course",
        write_only=True
    )
    
    # فیلدهای محاسباتی
    is_full = serializers.ReadOnlyField()
    available_seats = serializers.ReadOnlyField()
    
    class Meta:
        model = CourseOffering
        fields = [
            "id",
            "course_id",          # برای ایجاد/ویرایش
            "course_detail",       # برای نمایش
            "instructor",
            "class_number",
            "capacity",
            "enrolled_count",
            "class_time",
            "exam_time",
            "semester",
            "is_active",
            "is_full",
            "available_seats",
        ]
        read_only_fields = ["id", "enrolled_count", "is_full", "available_seats"]


class CourseOfferingSimpleSerializer(serializers.ModelSerializer):
    """Serializer ساده برای نمایش لیست کلاس‌ها"""
    
    course_name = serializers.CharField(source="course.name", read_only=True)
    course_code = serializers.CharField(source="course.code", read_only=True)
    course_units = serializers.IntegerField(source="course.units", read_only=True)
    
    class Meta:
        model = CourseOffering
        fields = [
            "id",
            "course_name",
            "course_code",
            "course_units",
            "instructor",
            "class_number",
            "capacity",
            "enrolled_count",
            "class_time",
            "exam_time",
            "is_full",
        ]
