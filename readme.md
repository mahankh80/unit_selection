# Backend - سامانه انتخاب واحد

Backend این پروژه با Django و Django REST Framework نوشته شده است.

## 🚀 راه‌اندازی

### 1. نصب Dependencies

```bash
cd es
pip install -r requirements.txt
```

### 2. Migrate کردن Database

```bash
python manage.py migrate
```

### 3. ایجاد Admin User

```bash
python manage.py createsuperuser
```

اطلاعات زیر را وارد کنید:
- **Username**: admin (یا هر نام دلخواهی)
- **Email**: admin@example.com
- **Password**: پسورد دلخواهی (مثلاً admin123)

### 4. اجرای Server

```bash
python manage.py runserver
```

Server روی `http://localhost:8000` اجرا می‌شود.

---

## 📡 API Endpoints

### Authentication

#### 1. Login (ورود)
```
POST /api/auth/login/
Content-Type: application/json

{
    "username": "admin",
    "password": "admin123"
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
        "last_name": "احمدی",
        "email": "admin@example.com"
    }
}
```

#### 2. Logout (خروج)
```
POST /api/auth/logout/
Authorization: Token abc123...

Response:
{
    "message": "با موفقیت خارج شدید"
}
```

#### 3. Current User (اطلاعات کاربر)
```
GET /api/auth/me/
Authorization: Token abc123...

Response:
{
    "id": 1,
    "username": "admin",
    "type": "admin",
    "is_staff": true,
    "first_name": "علی",
    "last_name": "احمدی",
    "email": "admin@example.com"
}
```

### Courses (مدیریت دروس)

#### 1. لیست دروس
```
GET /api/courses/
Authorization: Token abc123...
```

#### 2. ایجاد درس جدید
```
POST /api/courses/
Authorization: Token abc123...
Content-Type: application/json

{
    "name": "ریاضی عمومی",
    "code": "MATH101",
    "units": 3,
    "capacity": 30,
    "professor": "دکتر احمدی",
    "time": "شنبه 14-16",
    "location": "کلاس 301",
    "exam_time": "1403/10/15 - 14:00",
    "course_type": "GENERAL",
    "prerequisites": []
}
```

#### 3. ویرایش درس
```
PUT /api/courses/{id}/
Authorization: Token abc123...
```

#### 4. حذف درس
```
DELETE /api/courses/{id}/
Authorization: Token abc123...
```

---

## 🔑 نکات مهم

1. **Token Authentication**: بعد از login، token دریافت شده را در header های بعدی با فرمت زیر ارسال کنید:
   ```
   Authorization: Token abc123...
   ```

2. **CORS**: فرانت روی `localhost:3000` اجازه دسترسی دارد.

3. **Admin Panel**: برای مدیریت دستی می‌توانید به `/admin/` مراجعه کنید.

---

## 📦 Dependencies

- Django 5.1.1
- Django REST Framework 3.15.2
- django-cors-headers 4.3.1


