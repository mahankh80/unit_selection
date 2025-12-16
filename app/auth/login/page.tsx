"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@components/form/TextField";
import { PasswordField } from "@components/form/PasswordField";
import { PrimaryButton } from "@components/ui/PrimaryButton";
import { login, studentLogin, instructorLogin } from "@lib/api";

type UserType = "student" | "admin" | "instructor";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("admin");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!studentId.trim() || !password.trim()) {
      setError("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    setIsSubmitting(true);

    try {
      let response;
      
      if (userType === "student") {
        // ورود دانشجو
        response = await studentLogin({
          student_id: studentId,
          password: password,
        });

        // بررسی نوع کاربر
        if (response.user.type !== "student") {
          setError("شما دانشجو نیستید");
          setIsSubmitting(false);
          return;
        }

        // Dispatch event برای refresh کردن AuthContext
        window.dispatchEvent(new Event("auth:login"));
        
        // کمی صبر کن تا AuthContext update بشه و localStorage ذخیره بشه
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        // ریدایرکت به پنل دانشجو
        window.location.href = "/student";
      } else if (userType === "instructor") {
        // ورود استاد
        response = await instructorLogin({
          instructor_code: studentId,
          password: password,
        });

        // بررسی نوع کاربر
        if (response.user.type !== "instructor") {
          setError("شما استاد نیستید");
          setIsSubmitting(false);
          return;
        }

        // Dispatch event برای refresh کردن AuthContext
        window.dispatchEvent(new Event("auth:login"));
        
        // کمی صبر کن تا AuthContext update بشه و localStorage ذخیره بشه
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        // ریدایرکت به پنل استاد
        window.location.href = "/instructor";
      } else {
        // ورود Admin
        response = await login({
          username: studentId,
          password: password,
        });

        // بررسی نوع کاربر
        if (response.user.type !== "admin" || !response.user.is_staff) {
          setError("شما دسترسی مدیریت ندارید");
          setIsSubmitting(false);
          return;
        }

        // Dispatch event برای refresh کردن AuthContext
        window.dispatchEvent(new Event("auth:login"));
        
        // کمی صبر کن تا AuthContext update بشه و localStorage ذخیره بشه
        await new Promise((resolve) => setTimeout(resolve, 200));
        
        // ریدایرکت به پنل ادمین
        window.location.href = "/admin";
      }
    } catch (err) {
      setIsSubmitting(false);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("خطا در ورود به سیستم. لطفاً دوباره تلاش کنید.");
      }
    }
  };

  return (
    <>
      <div className="auth-card__tabs">
        <input
          type="radio"
          id="user-type-student"
          name="userType"
          value="student"
          checked={userType === "student"}
          onChange={() => setUserType("student")}
          className="user-type-selector__input"
        />
        <label htmlFor="user-type-student" className="user-type-selector__label">
          دانشجو
        </label>

        <input
          type="radio"
          id="user-type-instructor"
          name="userType"
          value="instructor"
          checked={userType === "instructor"}
          onChange={() => setUserType("instructor")}
          className="user-type-selector__input"
        />
        <label htmlFor="user-type-instructor" className="user-type-selector__label">
          استاد
        </label>

        <input
          type="radio"
          id="user-type-admin"
          name="userType"
          value="admin"
          checked={userType === "admin"}
          onChange={() => setUserType("admin")}
          className="user-type-selector__input"
        />
        <label htmlFor="user-type-admin" className="user-type-selector__label">
          مدیر
        </label>
      </div>

      <form className="auth-form" onSubmit={handleSubmit} noValidate>
        <header className="auth-form__header">
          <h2 className="auth-form__title">
            {userType === "student" 
              ? "ورود دانشجو" 
              : userType === "instructor"
              ? "ورود استاد"
              : "ورود مدیر"}
          </h2>
          <p className="auth-form__subtitle">
            {userType === "student"
              ? "برای ورود به سامانه، شماره دانشجویی و رمز عبور خود را وارد کنید."
              : userType === "instructor"
              ? "برای ورود به پنل استاد، کد استادی و رمز عبور خود را وارد کنید."
              : "برای ورود به پنل مدیریت، نام کاربری و رمز عبور خود را وارد کنید."}
          </p>
        </header>

        <div className="auth-form__body">
          {error && (
            <div className="auth-form__error">
              {error}
            </div>
          )}

          <TextField
            label={
              userType === "student" 
                ? "شماره دانشجویی" 
                : userType === "instructor"
                ? "کد استادی"
                : "نام کاربری"}
            placeholder={
              userType === "student"
                ? "شماره دانشجویی خود را وارد کنید"
                : userType === "instructor"
                ? "کد استادی خود را وارد کنید"
                : "نام کاربری خود را وارد کنید"
            }
            autoComplete="username"
            value={studentId}
            onChange={setStudentId}
            required
          />

          <PasswordField
            label="رمز عبور"
            autoComplete="current-password"
            value={password}
            onChange={setPassword}
            required
          />
          
          <div className="auth-form__info">
            <small>
              💡 اگر مرورگر هشدار امنیتی نمایش داد، این یک قابلیت امنیتی مرورگر است و می‌توانید آن را نادیده بگیرید.
            </small>
          </div>
        </div>

        <footer className="auth-form__footer">
          <div className="auth-form__actions">
            <PrimaryButton
              type="submit"
              loading={isSubmitting}
              fullWidth
              label="ورود به سامانه"
            />
          </div>
          <button
            type="button"
            className="auth-form__link-button"
            onClick={() => {
              // بعداً به صفحه ریکاوری رمز عبور وصل می‌شود
            }}
          >
            فراموشی رمز عبور
          </button>
        </footer>
      </form>
    </>
  );
}


