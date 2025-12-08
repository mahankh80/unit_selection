"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { PropsWithChildren } from "react";
import { DashboardIcon } from "@components/icons/Dashboard";
import { BookIcon } from "@components/icons/Book";
import { LinkIcon } from "@components/icons/Link";
import { SettingsIcon } from "@components/icons/Settings";

const menuItems = [
  { href: "/admin", label: "داشبورد", icon: <DashboardIcon /> },
  { href: "/admin/courses", label: "مدیریت دروس", icon: <BookIcon /> },
  { href: "/admin/classes", label: "مدیریت کلاس‌ها", icon: <LinkIcon /> },
  { href: "/admin/settings", label: "تنظیمات واحد", icon: <SettingsIcon /> },
];

export default function AdminLayout({ children }: PropsWithChildren) {
  const pathname = usePathname();

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h2 className="admin-sidebar__title">پنل مدیریت</h2>
          <p className="admin-sidebar__subtitle">مدیر گروه</p>
        </div>

        <nav className="admin-nav">
          {menuItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`admin-nav__item ${
                  isActive ? "admin-nav__item--active" : ""
                }`}
              >
                <span className="admin-nav__icon">{item.icon}</span>
                <span className="admin-nav__label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <Link href="/auth/login" className="admin-sidebar__logout">
            خروج از سیستم
          </Link>
        </div>
      </aside>

      <main className="admin-content">
        <header className="admin-header">
          <div className="admin-header__info">
            <h1 className="admin-header__title">سامانه انتخاب واحد</h1>
            <p className="admin-header__meta">سال تحصیلی ۱۴۰۴–۱۴۰۵</p>
          </div>
        </header>

        <div className="admin-main">{children}</div>
      </main>
    </div>
  );
}

