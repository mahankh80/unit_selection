from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import authenticate


@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    """
    Login endpoint برای Admin
    
    Request:
        {
            "username": "admin",
            "password": "password123"
        }
    
    Response:
        {
            "token": "abc123...",
            "user": {
                "id": 1,
                "username": "admin",
                "type": "admin",
                "is_staff": true,
                "first_name": "علی",
                "last_name": "احمدی"
            }
        }
    """
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "لطفاً نام کاربری و رمز عبور را وارد کنید"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # احراز هویت
    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"error": "نام کاربری یا رمز عبور اشتباه است"},
            status=status.HTTP_401_UNAUTHORIZED,
        )

    # فقط staff/admin میتونه وارد بشه
    if not user.is_staff:
        return Response(
            {"error": "شما دسترسی مدیریت ندارید"},
            status=status.HTTP_403_FORBIDDEN,
        )

    # ایجاد یا دریافت token
    token, created = Token.objects.get_or_create(user=user)

    # Response با اطلاعات کامل
    return Response(
        {
            "token": token.key,
            "user": {
                "id": user.id,
                "username": user.username,
                "type": "admin",
                "is_staff": user.is_staff,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
            },
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout(request):
    """
    Logout endpoint - پاک کردن token کاربر
    
    Headers:
        Authorization: Token abc123...
    
    Response:
        {
            "message": "با موفقیت خارج شدید"
        }
    """
    try:
        # پاک کردن token کاربر
        request.user.auth_token.delete()
        return Response(
            {"message": "با موفقیت خارج شدید"},
            status=status.HTTP_200_OK,
        )
    except Exception as e:
        return Response(
            {"error": "خطا در خروج از سیستم"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    دریافت اطلاعات کاربر لاگین شده
    
    Headers:
        Authorization: Token abc123...
    
    Response:
        {
            "id": 1,
            "username": "admin",
            "type": "admin",
            "is_staff": true,
            "first_name": "علی",
            "last_name": "احمدی"
        }
    """
    user = request.user
    
    return Response(
        {
            "id": user.id,
            "username": user.username,
            "type": "admin" if user.is_staff else "student",
            "is_staff": user.is_staff,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
        },
        status=status.HTTP_200_OK,
    )


