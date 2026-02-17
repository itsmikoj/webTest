"use client";

import { cn } from "@/lib/utils/cn";
import {
  LayoutDashboard,
  Download,
  CreditCard,
  LinkIcon,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/constants";

const navItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    href: ROUTES.dashboard,
  },
  { id: "installs", label: "Installs", icon: Download, href: ROUTES.installs },
  {
    id: "subscriptions",
    label: "Subs",
    icon: CreditCard,
    href: ROUTES.subscriptions,
  },
  { id: "links", label: "Links", icon: LinkIcon, href: ROUTES.links },
  { id: "settings", label: "Settings", icon: Settings, href: ROUTES.settings },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 md:hidden safe-area-bottom">
      <div className="flex items-center justify-around px-1 py-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 flex-1 py-2 px-1 rounded-xl transition-all",
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300",
              )}
            >
              <div
                className={cn(
                  "p-1.5 rounded-lg transition-all",
                  isActive && "bg-blue-50 dark:bg-blue-900/30",
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-medium leading-none">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
