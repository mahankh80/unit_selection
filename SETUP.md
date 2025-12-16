# 📖 راهنمای راه‌اندازی Backend

این راهنما مراحل کامل راه‌اندازی backend را شرح می‌دهد.

---

## ✅ پیش‌نیازها

- Python 3.8+
- pip

---

## 🚀 مراحل راه‌اندازی

### مرحله 1: نصب Dependencies

```bash
cd es
pip install -r requirements.txt
```

**نکته**: اگر خطا گرفتید، ابتدا یک virtual environment بسازید:

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# سپس دوباره نصب کنید
pip install -r requirements.txt
```

---

### مرحله 2: Migrate کردن Database

```bash
python manage.py migrate
```

این دستور جداول مورد نیاز را در database ایجاد می‌کند.

**خروجی موفق**:
```
Running migrations:
  Applying contenttypes.0001_initial... OK
  Applying auth.0001_initial... OK
  Applying admin.0001_initial... OK
  ...
  Applying courses.0001_initial... OK
```

---

### مرحله 3: ایجاد Admin User

```bash
python manage.py createsuperuser
```

اطلاعات زیر را وارد کنید:

```
Username: admin
Email address: admin@example.com
Password: admin123
Password (again): admin123
```

**نکته**: پسورد را به خاطر بسپارید! برای login نیاز دارید.

---

### مرحله 4: اجرای Server

```bash
python manage.py runserver
```

**خروجی موفق**:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

✅ Server شما آماده است! روی `http://localhost:8000` در حال اجرا است.

---

## 🧪 تست Authentication

### روش 1: با اسکریپت تست

```bash
# در یک terminal جدید (سرور باید در حال اجرا باشد)
pip install requests
python test_auth.py
```

این اسکریپت تمام endpointهای authentication را تست می‌کند.

---

### روش 2: با curl

#### 1. Login

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d "{\"username\": \"admin\", \"password\": \"admin123\"}"
```

**پاسخ موفق**:
```json
{
  "token": "abc123...",
  "user": {
    "id": 1,
    "username": "admin",
    "type": "admin",
    "is_staff": true,
    "first_name": "",
    "last_name": "",
    "email": "admin@example.com"
  }
}
```

#### 2. Current User

```bash
curl -X GET http://localhost:8000/api/auth/me/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

#### 3. Logout

```bash
curl -X POST http://localhost:8000/api/auth/logout/ \
  -H "Authorization: Token YOUR_TOKEN_HERE"
```

---

### روش 3: با Postman یا Insomnia

1. Import کردن collection
2. ایجاد یک request به `POST http://localhost:8000/api/auth/login/`
3. در Body، JSON زیر را قرار دهید:
   ```json
   {
     "username": "admin",
     "password": "admin123"
   }
   ```
4. Send کنید و token را دریافت کنید
5. برای requestهای بعدی، در Headers اضافه کنید:
   ```
   Authorization: Token YOUR_TOKEN
   ```

---

## ✅ چک‌لیست راه‌اندازی

- [ ] Dependencies نصب شد (`pip install -r requirements.txt`)
- [ ] Migration انجام شد (`python manage.py migrate`)
- [ ] Admin user ساخته شد (`python manage.py createsuperuser`)
- [ ] Server در حال اجراست (`python manage.py runserver`)
- [ ] Login موفق بود (token دریافت شد)
- [ ] Current user کار می‌کند
- [ ] Logout موفق بود

---

## 🐛 رفع مشکلات رایج

### مشکل 1: `ModuleNotFoundError: No module named 'corsheaders'`

**راه حل**:
```bash
pip install django-cors-headers
```

### مشکل 2: `no such table: authtoken_token`

**راه حل**:
```bash
python manage.py migrate
```

### مشکل 3: Login با خطای 401 مواجه می‌شود

**راه حل**:
- مطمئن شوید username و password درست هستند
- مطمئن شوید user ساخته شده `is_staff=True` دارد
- می‌توانید در Django admin panel (`http://localhost:8000/admin/`) بررسی کنید

### مشکل 4: CORS errors در browser

**راه حل**:
- مطمئن شوید `django-cors-headers` نصب شده
- مطمئن شوید frontend روی `localhost:3000` اجرا می‌شود
- تنظیمات CORS در `settings.py` را بررسی کنید

---

## 📝 نکات مهم

1. **Token را حفظ کنید**: بعد از login، token را در localStorage یا cookie ذخیره کنید
2. **Token در Headers**: برای هر request احراز هویت شده، token را با فرمت `Authorization: Token YOUR_TOKEN` ارسال کنید
3. **Logout**: حتماً بعد از logout، token را از frontend حذف کنید

---

## 🎉 اگر همه چیز کار کرد...

می‌توانید به مرحله بعد (اتصال Frontend به Backend) بروید! 🚀


