"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { BookIcon } from "@components/icons/Book";
import { CalendarIcon } from "@components/icons/Calendar";
import { ListIcon } from "@components/icons/List";
import { LogoutIcon } from "@components/icons/Logout";
import { useAuth } from "@lib/AuthContext";

const menuItems = [
  { href: "/student", label: "لیست دروس", icon: <BookIcon /> },
  { href: "/student/schedule", label: "برنامه هفتگی", icon: <CalendarIcon /> },
  { href: "/student/enrolled", label: "دروس اخذ شده", icon: <ListIcon /> },
];

export default function StudentLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div className="student-shell">
      <aside className="student-sidebar">
        <div className="student-sidebar__header">
          <h2 className="student-sidebar__title">پنل دانشجو</h2>
          <p className="student-sidebar__subtitle">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username || "دانشجو"}
          </p>
          {user?.student_id && (
            <p className="student-sidebar__student-id">
              {user.student_id}
            </p>
          )}
        </div>

        <nav className="student-nav">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/student"
                ? pathname === "/student"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`student-nav__item ${
                  isActive ? "student-nav__item--active" : ""
                }`}
              >
                <span className="student-nav__icon">{item.icon}</span>
                <span className="student-nav__label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="student-sidebar__footer">
          <button
            onClick={logout}
            className="student-sidebar__logout"
            type="button"
          >
            <span className="student-sidebar__logout-icon">
              <LogoutIcon />
            </span>
            <span className="student-sidebar__logout-text">خروج از سیستم</span>
          </button>
        </div>
      </aside>

      <main className="student-content">
        <header className="student-header">
          <div className="student-header__info">
            <h1 className="student-header__title">سامانه انتخاب واحد</h1>
            <p className="student-header__meta">سال تحصیلی ۱۴۰۴–۱۴۰۵</p>
          </div>
        </header>

        <div className="student-main">{children}</div>
      </main>
    </div>
  );
}

