"use client";

import { useState } from "react";
import { User, App } from "@/types";
import { LogOut, Settings, User as UserIcon, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppIcon } from "@/components/shared/AppIcon";
import { cn } from "@/lib/utils/cn";

interface HeaderProps {
  appName: string;
  user: User | null;
  onLogout: () => void;
  onToggleSidebar?: () => void;
  apps?: App[];
  selectedApp?: App | null;
  onSelectApp?: (app: App) => void;
}

export function Header({
  appName,
  user,
  onLogout,
  apps,
  selectedApp,
  onSelectApp,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAppSwitcherOpen, setIsAppSwitcherOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {apps && apps.length > 0 && onSelectApp && (
            <div className="relative md:hidden">
              <button
                onClick={() => setIsAppSwitcherOpen(!isAppSwitcherOpen)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors max-w-[200px]"
              >
                {selectedApp && (
                  <AppIcon
                    logo={selectedApp.logo}
                    name={selectedApp.name}
                    size={7}
                  />
                )}
                <span className="text-sm font-semibold text-slate-900 dark:text-white truncate">
                  {appName || "Select App"}
                </span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 text-slate-400 flex-shrink-0 transition-transform",
                    isAppSwitcherOpen && "rotate-180",
                  )}
                />
              </button>

              {isAppSwitcherOpen && (
                <>
                  <div
                    className="fixed inset-0 z-[100]"
                    onClick={() => setIsAppSwitcherOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-[101] overflow-hidden">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        Switch App
                      </p>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {apps.map((app) => (
                        <button
                          key={app.id}
                          onClick={() => {
                            onSelectApp(app);
                            setIsAppSwitcherOpen(false);
                          }}
                          className={cn(
                            "flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left",
                            selectedApp?.id === app.id &&
                              "bg-blue-50 dark:bg-blue-900/20",
                          )}
                        >
                          <AppIcon logo={app.logo} name={app.name} size={7} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                              {app.name}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {app.bundleId}
                            </p>
                          </div>
                          {selectedApp?.id === app.id && (
                            <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          <h1 className="hidden md:block text-xl font-bold text-slate-900 dark:text-white truncate">
            {appName ? `${appName}` : "Analytics Dashboard"}
          </h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <UserIcon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
              </button>

              {isMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsMenuOpen(false)}
                  />
                  <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        {user.name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {user.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          router.push("/settings");
                        }}
                        className="flex items-center gap-3 px-4 py-2 w-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-sm text-slate-700 dark:text-slate-300">
                          Settings
                        </span>
                      </button>
                    </div>
                    <div className="border-t border-slate-100 dark:border-slate-700 py-1">
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout();
                        }}
                        className="flex items-center gap-3 px-4 py-2 w-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-left"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                          Logout
                        </span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
