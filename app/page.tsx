import { redirect } from "next/navigation";

export default function HomePage() {
  // ریدایرکت صفحه اصلی به صفحه ورود
  redirect("/auth/login");
}





