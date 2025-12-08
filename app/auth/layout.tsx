import type { PropsWithChildren } from "react";
import Image from "next/image";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="app-shell">
      <div className="app-shell__gradient" />
      <main className="auth-layout">
        <section className="auth-layout__panel">
          <div className="auth-layout__logo">
            <Image
              src="/desktop.png"
              alt="لوگوی دانشگاه"
              width={320}
              height={120}
              priority
              className="auth-layout__logo-desktop"
            />
            <Image
              src="/mobile.png"
              alt="لوگوی دانشگاه"
              width={110}
              height={110}
              priority
              className="auth-layout__logo-mobile"
            />
          </div>
          <div className="auth-card">
            {children}
          </div>
          <p className="auth-layout__meta">
            سال تحصیلی ۱۴۰۴–۱۴۰۵
          </p>
        </section>
      </main>
    </div>
  );
}


