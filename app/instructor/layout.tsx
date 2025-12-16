"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { BookIcon } from "@components/icons/Book";
import { ListIcon } from "@components/icons/List";
import { LogoutIcon } from "@components/icons/Logout";
import { useAuth } from "@lib/AuthContext";

const menuItems = [
  { href: "/instructor", label: "دروس من", icon: <BookIcon /> },
  { href: "/instructor/students", label: "لیست دانشجویان", icon: <ListIcon /> },
];

export default function InstructorLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <div className="instructor-shell">
      <aside className="instructor-sidebar">
        <div className="instructor-sidebar__header">
          <h2 className="instructor-sidebar__title">پنل استاد</h2>
          <p className="instructor-sidebar__subtitle">
            {user?.first_name && user?.last_name
              ? `${user.first_name} ${user.last_name}`
              : user?.username || "استاد"}
          </p>
          {user?.instructor_code && (
            <p className="instructor-sidebar__code">
              کد استادی: {user.instructor_code}
            </p>
          )}
        </div>

        <nav className="instructor-nav">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/instructor"
                ? pathname === "/instructor"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`instructor-nav__item ${
                  isActive ? "instructor-nav__item--active" : ""
                }`}
              >
                <span className="instructor-nav__icon">{item.icon}</span>
                <span className="instructor-nav__label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="instructor-sidebar__footer">
          <button
            onClick={logout}
            className="instructor-sidebar__logout"
            type="button"
          >
            <span className="instructor-sidebar__logout-icon">
              <LogoutIcon />
            </span>
            <span className="instructor-sidebar__logout-text">خروج از سیستم</span>
          </button>
        </div>
      </aside>

      <main className="instructor-content">
        <header className="instructor-header">
          <div className="instructor-header__info">
            <h1 className="instructor-header__title">سامانه انتخاب واحد</h1>
            <p className="instructor-header__meta">سال تحصیلی ۱۴۰۴–۱۴۰۵</p>
          </div>
        </header>

        <div className="instructor-main">{children}</div>
      </main>
    </div>
  );
}

