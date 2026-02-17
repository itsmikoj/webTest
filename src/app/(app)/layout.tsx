"use client";

import { Header } from "@/components/layout/Header";
import { App } from "@/types";
import { useApp } from "@/contexts/AppContext";
import { Sidebar } from "@/components/layout/Sidebar";
import { BottomNav } from "@/components/layout/BottomNav";
import { useAuth } from "@/contexts/AuthContext";

function AppContent({ children }: { children: React.ReactNode }) {
  const { selectedApp, setSelectedApp, apps } = useApp();
  const { user, logout} = useAuth();

  const handleLogout = () => {
    logout()
  };

  const handleSelectApp = (app: App) => {
    setSelectedApp(app);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar
        selectedApp={selectedApp}
        apps={apps}
        onSelectApp={handleSelectApp}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header appName={selectedApp?.name!} user={user} onLogout={handleLogout} apps={apps} selectedApp={selectedApp} onSelectApp={handleSelectApp} />
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 pb-20 md:pb-6">{children}</div>
        </main>
      </div>
      <BottomNav />
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AppContent>{children}</AppContent>;
}
