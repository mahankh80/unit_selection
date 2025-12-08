import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "سامانه انتخاب واحد",
  description: "ثبت‌نام و انتخاب واحد دانشجویی با رابط کاربری مدرن",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}



