"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { loginAction, serverLogout } from "@/lib/actions/auth";
import { User } from "@/types";
import { STORAGE_KEYS } from "@/config/constants";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem(STORAGE_KEYS.user);
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem(STORAGE_KEYS.user);
      }
    } else {
      const handleLogout = async () => {
        await logout();
      };
      handleLogout();
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const result = await loginAction(email, password);

      if (result.success && result.data) {
        const userData: User = {
          email: result.data.email,
          name: result.data.full_name,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        };

        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
        setUser(userData);

        const urlParams = new URLSearchParams(window.location.search);
        const callbackUrl = urlParams.get("callbackUrl") || "/dashboard";

        router.push(callbackUrl);
        router.refresh();
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err: any) {
      console.error("❌ Error:", err);
      setError(err.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
    await serverLogout();
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, setUser, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
