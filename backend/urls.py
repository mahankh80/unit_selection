from django.contrib import admin
from django.urls import include, path
from rest_framework.authtoken.views import obtain_auth_token

urlpatterns = [
    path("admin/", admin.site.urls),
    # لاگین مدیر (و هر کاربر دیگری) از طریق توکن DRF
    path("api/auth/login/", obtain_auth_token, name="api-login"),
    # اپ دروس
    path("api/", include("courses.urls")),
]
