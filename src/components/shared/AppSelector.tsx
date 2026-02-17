"use client";

import { useState } from "react";
import { App } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils/cn";
import { ChevronDown } from "lucide-react";
import { AppIcon } from "./AppIcon";

interface AppSelectorProps {
  apps: App[];
  selectedApp: App | null;
  onSelectApp: (app: App) => void;
}

export function AppSelector({
  apps,
  selectedApp,
  onSelectApp,
}: AppSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors w-full min-w-[280px]"
      >
        {selectedApp ? (
          <>
            <div className="flex items-center gap-3 flex-1">
              <AppIcon logo={selectedApp.logo} name={selectedApp.name} />
              <div className="flex-1 text-left">
                <p className="font-medium text-slate-900 dark:text-white text-sm">
                  {selectedApp.name}
                </p>
                <p
                  className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px] cursor-help"
                  title={selectedApp.bundleId}
                >
                  {selectedApp.bundleId}
                </p>
              </div>
              <Badge variant={selectedApp.status} size="sm">
                {selectedApp.status}
              </Badge>
            </div>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform",
                isOpen && "transform rotate-180",
              )}
            />
          </>
        ) : (
          <>
            <span className="text-slate-500 dark:text-slate-400 text-sm flex-1 text-left">
              Select an app
            </span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-slate-400 dark:text-slate-500 transition-transform",
                isOpen && "transform rotate-180",
              )}
            />
          </>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-[100]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-[101] overflow-hidden max-h-[300px] overflow-y-auto">
            {apps
              .filter((app) => app.id !== selectedApp?.id)
              .map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onSelectApp(app);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-700 last:border-b-0",
                    selectedApp?.id === app.id &&
                      "bg-blue-50 dark:bg-blue-900/20",
                  )}
                >
                  <AppIcon logo={app.logo} name={app.name} />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-slate-900 dark:text-white text-sm">
                      {app.name}
                    </p>
                    <p
                      className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px] cursor-help"
                      title={app.bundleId}
                    >
                      {app.bundleId}
                    </p>
                  </div>
                  <Badge variant={app.status} size="xs">
                    {/* {app.status} */}
                  </Badge>
                </button>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
