"use client";

import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Download,
  CreditCard,
  Settings,
  Users,
  LinkIcon,
  ChevronRight,
  ChevronLeft,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { App } from "@/types";
import { AppSelector } from "@/components/shared/AppSelector";
import { useState, useEffect } from "react";
import { ROUTES } from "@/config/constants";
import { AppIcon } from "../shared/AppIcon";

interface SidebarProps {
  selectedApp: App | null;
  apps: App[];
  onSelectApp: (app: App) => void;
}

const appTabs = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    href: ROUTES.dashboard,
  },
  { id: "installs", label: "Installs", icon: Download, href: ROUTES.installs },
  {
    id: "subscriptions",
    label: "Subscriptions",
    icon: CreditCard,
    href: ROUTES.subscriptions,
  },
  {
    id: "links",
    label: "Links",
    icon: LinkIcon,
    href: ROUTES.links,
  },
];

const globalTabs = [
  { id: "settings", label: "Settings", icon: Settings, href: ROUTES.settings },
  // { id: 'users', label: 'Users', icon: Users, href: ROUTES.users },
];

export function Sidebar({ selectedApp, apps, onSelectApp }: SidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1030;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      <aside
        className={cn(
          "bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 flex flex-col h-screen sticky top-0 transition-all duration-300 z-50",
          isCollapsed ? "w-20" : "w-72",
          isMobile && !isCollapsed && "fixed left-0 top-0",
        )}
      >
        <div
          className={cn(
            "p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between",
            isCollapsed && "justify-center",
          )}
        >
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div> */}
              <span className="font-bold text-md text-slate-900 dark:text-white">
                Tracker Dashboard
              </span>
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            )}
          </button>
        </div>

        {/* App Selector */}
        <div
          className={cn(
            "p-4 border-b border-slate-200 dark:border-slate-700",
            isCollapsed
              ? "opacity-0 overflow-hidden"
              : "opacity-100 transition-all duration-300 ease-in-out",
          )}
        >
          <AppSelector
            apps={apps}
            selectedApp={selectedApp}
            onSelectApp={onSelectApp}
          />
        </div>

        {isCollapsed && selectedApp && (
          <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-center">
            <AppIcon logo={selectedApp.logo} name={selectedApp.name} onClick={() => {setIsCollapsed(false)}}/>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto">
          {selectedApp && (
            <div className="p-3">
              {!isCollapsed && (
                <p className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  App Analytics
                </p>
              )}
              <div className="space-y-1 mt-2">
                {appTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = pathname === tab.href;

                  return (
                    <Link
                      key={tab.id}
                      href={tab.href}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                        isActive
                          ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                        isCollapsed && "justify-center",
                      )}
                      title={isCollapsed ? tab.label : undefined}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!isCollapsed && (
                        <>
                          <span className="flex-1">{tab.label}</span>
                          {isActive && <ChevronRight className="w-4 h-4" />}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </nav>

        {/* Separator */}
        <div className="border-t border-slate-200 dark:border-slate-700" />

        <div className="p-3">
          {!isCollapsed && (
            <p className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              General
            </p>
          )}
          <div className="space-y-1 mt-2">
            {globalTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = pathname === tab.href;

              return (
                <Link
                  key={tab.id}
                  href={tab.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                      : "text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800",
                    isCollapsed && "justify-center",
                  )}
                  title={isCollapsed ? tab.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{tab.label}</span>
                      {isActive && <ChevronRight className="w-4 h-4" />}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {!isCollapsed && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 text-center">
              Analytics Dashboard v1.0.0
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
