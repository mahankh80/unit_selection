from rest_framework import serializers

from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = [
            "id",
            "name",
            "code",
            "units",
            "capacity",
            "professor",
            "time",
            "location",
            "exam_time",
            "course_type",
            "prerequisites",
        ]
