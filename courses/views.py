from rest_framework import permissions, viewsets, filters
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Course, CourseOffering
from .serializers import (
    CourseSerializer, 
    CourseOfferingSerializer,
    CourseOfferingSimpleSerializer
)


class IsAdminUserOrReadOnly(permissions.BasePermission):
    """فقط مدیر می‌تواند تغییر ایجاد کند، بقیه فقط خواندن."""

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class CourseViewSet(viewsets.ModelViewSet):
    """ViewSet برای مدیریت دروس (تعریف درس)"""
    
    queryset = Course.objects.all().order_by("code")
    serializer_class = CourseSerializer
    permission_classes = [permissions.IsAuthenticated, IsAdminUserOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "code"]
    ordering_fields = ["code", "name", "units"]


class CourseOfferingViewSet(viewsets.ModelViewSet):
    """ViewSet برای مدیریت کلاس‌ها (برگزاری درس)"""
    
    queryset = CourseOffering.objects.select_related("course").filter(is_active=True)
    permission_classes = [permissions.IsAuthenticated, IsAdminUserOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["course__name", "course__code", "instructor", "class_number"]
    ordering_fields = ["course__code", "class_number", "enrolled_count"]
    
    def get_serializer_class(self):
        """انتخاب Serializer بر اساس action"""
        if self.action == "list":
            return CourseOfferingSimpleSerializer
        return CourseOfferingSerializer
    
    def get_queryset(self):
        """فیلتر کلاس‌ها بر اساس query parameters"""
        queryset = super().get_queryset()
        
        # فیلتر بر اساس ترم
        semester = self.request.query_params.get("semester", None)
        if semester:
            queryset = queryset.filter(semester=semester)
        
        # فیلتر بر اساس استاد
        instructor = self.request.query_params.get("instructor", None)
        if instructor:
            queryset = queryset.filter(instructor__icontains=instructor)
        
        # فیلتر کلاس‌های پر
        only_available = self.request.query_params.get("only_available", None)
        if only_available and only_available.lower() == "true":
            queryset = [obj for obj in queryset if obj.available_seats > 0]
        
        return queryset
    
    @action(detail=False, methods=["get"])
    def stats(self, request):
        """آمار کلی کلاس‌ها"""
        offerings = self.get_queryset()
        
        total = len(offerings) if isinstance(offerings, list) else offerings.count()
        full_classes = sum(1 for o in offerings if o.is_full)
        total_capacity = sum(o.capacity for o in offerings)
        total_enrolled = sum(o.enrolled_count for o in offerings)
        
        return Response({
            "total_classes": total,
            "full_classes": full_classes,
            "total_capacity": total_capacity,
            "total_enrolled": total_enrolled,
            "average_fill_rate": round(total_enrolled / total_capacity * 100, 1) if total_capacity > 0 else 0,
        })
    
    @action(detail=True, methods=["post"])
    def enroll(self, request, pk=None):
        """ثبت‌نام در کلاس (برای آینده)"""
        offering = self.get_object()
        
        if offering.is_full:
            return Response(
                {"error": "کلاس پر است"},
                status=400
            )
        
        # TODO: در آینده باید Student model و Enrollment بسازیم
        offering.enrolled_count += 1
        offering.save()
        
        return Response({
            "message": "ثبت‌نام موفق",
            "enrolled_count": offering.enrolled_count,
            "available_seats": offering.available_seats,
        })
