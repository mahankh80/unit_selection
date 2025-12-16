"use client";

import type { PropsWithChildren } from "react";
import { useAuth } from "@lib/AuthContext";

export default function StudentLayout({ children }: PropsWithChildren) {
  const { logout, user } = useAuth();

  return (
    <div className="student-shell">
      <header className="student-header">
        <div className="student-header__content">
          <div className="student-header__info">
            <h1 className="student-header__title">سامانه انتخاب واحد</h1>
            <p className="student-header__subtitle">سال تحصیلی ۱۴۰۴–۱۴۰۵</p>
          </div>
          <div className="student-header__user">
            <div className="student-header__user-info">
              <span className="student-header__user-name">
                {user?.first_name && user?.last_name
                  ? `${user.first_name} ${user.last_name}`
                  : user?.username || "دانشجو"}
              </span>
              {user?.student_id && (
                <span className="student-header__user-id">
                  شماره دانشجویی: {user.student_id}
                </span>
              )}
            </div>
            <button
              onClick={logout}
              className="student-header__logout"
              type="button"
            >
              خروج
            </button>
          </div>
        </div>
      </header>

      <main className="student-main">{children}</main>
    </div>
  );
}

