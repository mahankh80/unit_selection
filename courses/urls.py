from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import CourseViewSet, CourseOfferingViewSet

router = DefaultRouter()
router.register(r"courses", CourseViewSet, basename="course")
router.register(r"classes", CourseOfferingViewSet, basename="class")

urlpatterns = [
    path("", include(router.urls)),
]
