from django.contrib import admin

from .models import Course, CourseOffering


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "units", "course_type")
    list_filter = ("course_type", "units")
    search_fields = ("code", "name")
    filter_horizontal = ("prerequisites",)
    
    fieldsets = (
        ("اطلاعات پایه", {
            "fields": ("code", "name", "units", "course_type")
        }),
        ("پیش‌نیازها", {
            "fields": ("prerequisites",)
        }),
        # فیلدهای موقت - بعداً حذف می‌شوند
        ("فیلدهای قدیمی (موقت)", {
            "fields": ("professor", "capacity", "time", "location", "exam_time"),
            "classes": ["collapse"],
        }),
    )


@admin.register(CourseOffering)
class CourseOfferingAdmin(admin.ModelAdmin):
    list_display = (
        "get_course_code", 
        "get_course_name", 
        "instructor", 
        "class_number",
        "capacity",
        "enrolled_count",
        "is_full",
        "semester",
        "is_active"
    )
    list_filter = ("semester", "is_active", "course__course_type")
    search_fields = (
        "course__code", 
        "course__name", 
        "instructor", 
        "class_number"
    )
    list_editable = ("is_active", "capacity")
    
    fieldsets = (
        ("درس", {
            "fields": ("course",)
        }),
        ("اطلاعات کلاس", {
            "fields": (
                "instructor",
                "class_number",
                "capacity",
                "enrolled_count",
            )
        }),
        ("زمان‌بندی", {
            "fields": ("class_time", "exam_time")
        }),
        ("تنظیمات", {
            "fields": ("semester", "is_active")
        }),
    )
    
    def get_course_code(self, obj):
        return obj.course.code
    get_course_code.short_description = "کد درس"
    get_course_code.admin_order_field = "course__code"
    
    def get_course_name(self, obj):
        return obj.course.name
    get_course_name.short_description = "نام درس"
    get_course_name.admin_order_field = "course__name"
