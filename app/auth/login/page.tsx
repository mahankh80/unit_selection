"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { TextField } from "@components/form/TextField";
import { PasswordField } from "@components/form/PasswordField";
import { PrimaryButton } from "@components/ui/PrimaryButton";

type UserType = "student" | "admin";

export default function LoginPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>("student");
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!studentId.trim() || !password.trim()) {
      return;
    }

    setIsSubmitting(true);

    // TODO: اتصال به API واقعی
    window.setTimeout(() => {
      setIsSubmitting(false);
      
      // ریدایرکت بر اساس نوع کاربر
      if (userType === "admin") {
        router.push("/admin");
      } else {
        router.push("/student");
      }
    }, 800);
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
            {userType === "student" ? "ورود دانشجو" : "ورود مدیر"}
          </h2>
          <p className="auth-form__subtitle">
            {userType === "student"
              ? "برای ورود به سامانه، شماره دانشجویی و رمز عبور خود را وارد کنید."
              : "برای ورود به پنل مدیریت، نام کاربری و رمز عبور خود را وارد کنید."}
          </p>
        </header>

        <div className="auth-form__body">
        <TextField
          label={userType === "student" ? "شماره دانشجویی" : "نام کاربری"}
          placeholder={
            userType === "student"
              ? "شماره دانشجویی خود را وارد کنید"
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


