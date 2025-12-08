from rest_framework import permissions, viewsets

from .models import Course
from .serializers import CourseSerializer


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """فقط مدیر می‌تواند تغییر ایجاد کند، بقیه فقط خواندن."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all().order_by("code")
    serializer_class = CourseSerializer
    permission_classes = [IsAdminUserOrReadOnly]
