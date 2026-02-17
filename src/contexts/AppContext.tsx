"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { App } from "@/types";
import { getAppTrackers } from "@/lib/api/tracker/data.service";
import { mapAppTrackersToApps } from "@/lib/utils/mappers";
import { useAuth } from "./AuthContext";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { STORAGE_KEYS } from "@/config/constants";

interface AppContextType {
  selectedApp: App | null;
  setSelectedApp: (app: App) => void;
  apps: App[];
  isLoading: boolean;
  error: string | null;
  resetApps: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const PUBLIC_ROUTES = ["/login", "/"];

export function AppProvider({ children }: { children: ReactNode }) {
  const [apps, setApps] = useState<App[]>([]);
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [savedApp, setSavedApp] = useLocalStorage<App | null>(STORAGE_KEYS.app, null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route);

    if (!user || isPublicRoute) {
      setApps([]);
      setSelectedApp(null);
      setIsLoading(false);
      return;
    }

    if (apps.length > 0) {
      return;
    }

    async function loadApps() {
      try {
        setIsLoading(true);
        const appTrackers = await getAppTrackers();
        const mappedApps = mapAppTrackersToApps(appTrackers);
        setApps(mappedApps);

        if (!savedApp) {
          if (mappedApps.length > 0 && !selectedApp) {
            setSelectedApp(mappedApps[0]);
            setSavedApp(mappedApps[0]);
          }
        } else {
          setSelectedApp(savedApp);
        }
      } catch (err: any) {
        if (err.status === 401) {
          localStorage.removeItem(STORAGE_KEYS.user);
          setApps([]);
          setSelectedApp(null);
          setSavedApp(null);
        } else {
          setError(err instanceof Error ? err.message : "Failed to load apps");
          console.error("Error loading apps:", err);
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadApps();
  }, [user, pathname, apps.length]);

  const resetApps = () => {
    setApps([]);
    setSelectedApp(null);
    setError(null);
  };

  const handleSelctedApp = (app: App) => {
    setSelectedApp(app);
    setSavedApp(app);
  }

  return (
    <AppContext.Provider
      value={{ selectedApp, setSelectedApp: handleSelctedApp, apps, isLoading, error, resetApps }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
