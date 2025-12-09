"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { User, getUser, getToken, logout as apiLogout, getCurrentUser } from "./api";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // بررسی وضعیت لاگین در بارگذاری اولیه
    const loadUser = () => {
      const token = getToken();
      const savedUser = getUser();

      if (token && savedUser) {
        setUser(savedUser);
      }

      setIsLoading(false);
    };

    loadUser();

    // Listen برای event های login
    const handleStorageChange = () => {
      const token = getToken();
      const savedUser = getUser();
      if (token && savedUser) {
        setUser(savedUser);
      }
    };

    // Listen برای تغییرات localStorage
    window.addEventListener("storage", handleStorageChange);
    
    // Listen برای custom event (وقتی login می‌کنه)
    window.addEventListener("auth:login", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth:login", handleStorageChange);
    };
  }, []);

  useEffect(() => {
    // محافظت از صفحات admin - فقط بعد از اینکه loading تمام شد
    if (isLoading) return;
    
    if (pathname?.startsWith("/admin")) {
      const token = getToken();
      const savedUser = getUser();
      
      // از localStorage مستقیماً چک کن (نه فقط state)
      if (!token || !savedUser) {
        router.push("/auth/login");
        return;
      }

      // چک کن که admin باشه
      if (savedUser.type !== "admin" || !savedUser.is_staff) {
        router.push("/auth/login");
        return;
      }

      // اگر user state null هست ولی در localStorage هست، set کن
      if (!user && savedUser) {
        setUser(savedUser);
      }
    }
  }, [user, isLoading, pathname, router]);

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

