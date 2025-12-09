from django.contrib import admin
from django.urls import include, path
from courses.auth_views import login, logout, current_user

urlpatterns = [
    path("admin/", admin.site.urls),
    # Authentication endpoints
    path("api/auth/login/", login, name="api-login"),
    path("api/auth/logout/", logout, name="api-logout"),
    path("api/auth/me/", current_user, name="api-current-user"),
    # اپ دروس
    path("api/", include("courses.urls")),
]
