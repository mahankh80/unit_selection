# 🔗 راهنمای اتصال Frontend به Backend

این فایل توضیح می‌دهد که فرانت چگونه به بک‌اند وصل شده و چطور از آن استفاده کنیم.

---

## ✅ تغییرات انجام شده

### 1. **API Utility** (`lib/api.ts`)

یک utility کامل برای ارتباط با Backend:

**Functions:**
- `login(credentials)` - ورود به سیستم
- `logout()` - خروج از سیستم  
- `getCurrentUser()` - دریافت اطلاعات کاربر فعلی
- `isAuthenticated()` - بررسی لاگین بودن
- `isAdmin()` - بررسی Admin بودن
- `getToken()`, `setToken()`, `removeToken()` - مدیریت Token
- `getUser()`, `setUser()`, `removeUser()` - مدیریت اطلاعات کاربر

**استفاده:**
```typescript
import { login } from "@lib/api";

const response = await login({
  username: "admin",
  password: "admin123"
});

console.log(response.token);
console.log(response.user);
```

---

### 2. **Auth Context** (`lib/AuthContext.tsx`)

Context برای مدیریت وضعیت authentication در کل اپلیکیشن:

**Provides:**
- `user` - اطلاعات کاربر لاگین شده
- `isAuthenticated` - آیا لاگین کرده؟
- `isLoading` - در حال بارگذاری؟
- `logout()` - تابع خروج

**استفاده:**
```typescript
import { useAuth } from "@lib/AuthContext";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();
  
  return (
    <div>
      {isAuthenticated && <p>خوش آمدید {user?.username}</p>}
      <button onClick={logout}>خروج</button>
    </div>
  );
}
```

---

### 3. **صفحه Login** (`app/auth/login/page.tsx`)

صفحه ورود به API واقعی وصل شده:

**ویژگی‌ها:**
- ✅ فراخوانی API برای login
- ✅ ذخیره Token و User در localStorage
- ✅ نمایش خطاها
- ✅ Redirect به `/admin` بعد از login موفق
- ✅ بررسی Admin بودن کاربر

**فلوی کار:**
1. کاربر username و password وارد می‌کنه
2. کلیک روی "ورود به سامانه"
3. فراخوانی `POST /api/auth/login/`
4. ذخیره token و user در localStorage
5. Redirect به `/admin`

---

### 4. **Admin Layout** (`app/admin/layout.tsx`)

پنل Admin به Auth Context وصل شده:

**ویژگی‌ها:**
- ✅ نمایش نام کاربر در sidebar
- ✅ دکمه Logout فعال
- ✅ محافظت خودکار (اگر لاگین نباشی redirect به login)

---

### 5. **Root Layout** (`app/layout.tsx`)

`AuthProvider` به کل اپلیکیشن اضافه شده:

```typescript
<AuthProvider>
  {children}
</AuthProvider>
```

---

## 🚀 نحوه استفاده

### مرحله 1: اطمینان از اجرای Backend

```bash
cd es
python manage.py runserver
```

Backend باید روی `http://localhost:8000` در حال اجرا باشد.

---

### مرحله 2: اجرای Frontend

```bash
npm run dev
```

Frontend روی `http://localhost:3000` اجرا می‌شود.

---

### مرحله 3: تست Login

1. به `http://localhost:3000` برو
2. روی "مدیر" کلیک کن
3. وارد کن:
   - **نام کاربری**: `admin`
   - **رمز عبور**: `admin123`
4. کلیک روی "ورود به سامانه"
5. باید به `/admin` منتقل بشی

---

## 🔐 Authentication Flow

### Login:
```
User Input (username, password)
    ↓
POST /api/auth/login/
    ↓
Receive { token, user }
    ↓
Save to localStorage
    ↓
Redirect to /admin
```

### Protected Routes:
```
User visits /admin
    ↓
AuthContext checks token
    ↓
Token valid? → Show page
Token invalid? → Redirect to /auth/login
```

### Logout:
```
Click "خروج از سیستم"
    ↓
POST /api/auth/logout/
    ↓
Clear localStorage
    ↓
Redirect to /auth/login
```

---

## 🛠️ API Configuration

Backend URL تنظیم شده در `lib/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
```

برای تغییر URL، یک فایل `.env.local` در root پروژه بساز:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## 📝 LocalStorage Data

بعد از login، این داده‌ها در localStorage ذخیره می‌شن:

```javascript
// Token
localStorage.getItem("auth_token")
// "59d14794b1b15cefbe84758760e88f..."

// User Info
localStorage.getItem("user")
// {"id":1,"username":"admin","type":"admin","is_staff":true,...}
```

---

## 🐛 مشکلات رایج و راه حل

### 1. خطای CORS
**علت**: Backend CORS رو درست تنظیم نکرده
**راه حل**: مطمئن شو `django-cors-headers` نصب و تنظیم شده

### 2. Token Invalid
**علت**: Token منقضی شده یا حذف شده
**راه حل**: Logout کن و دوباره Login کن

### 3. Cannot connect to Backend
**علت**: Backend در حال اجرا نیست
**راه حل**: `python manage.py runserver` رو اجرا کن

### 4. Login موفق ولی redirect نمی‌شه
**علت**: کاربر Admin نیست (`is_staff=False`)
**راه حل**: در Django admin کاربر رو staff کن

---

## ✨ قابلیت‌های آینده

این ساختار آماده است برای:
- [ ] Login دانشجو
- [ ] Refresh Token
- [ ] Remember Me
- [ ] Password Recovery
- [ ] Session Timeout

---

## 📊 وضعیت فعلی

| قابلیت | وضعیت |
|--------|-------|
| Login Admin | ✅ کامل |
| Logout | ✅ کامل |
| Protected Routes | ✅ کامل |
| Token Management | ✅ کامل |
| Error Handling | ✅ کامل |
| User Context | ✅ کامل |
| Login Student | ⏳ آینده |

---

🎉 **فرانت و بک‌اند با موفقیت به هم وصل شدند!**


