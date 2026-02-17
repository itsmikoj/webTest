"use client";

import { useState } from "react";
import { User } from "@/types";
import { LogOut, Settings, User as UserIcon, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  appName: string;
  user: User | null;
  onLogout: () => void;
  onToggleSidebar?: () => void;
}

export function Header({
  appName,
  user,
  onLogout,
  onToggleSidebar,
}: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-30">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {onToggleSidebar && (
              <button
                onClick={onToggleSidebar}
                className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            )}
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              {appName ? `${appName}'s Analytics` : "Analytics Dashboard"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* User Profile */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user.email}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300">
                  <UserIcon />
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
