from django.contrib import admin

from .models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "professor", "capacity")
    search_fields = ("code", "name", "professor")
