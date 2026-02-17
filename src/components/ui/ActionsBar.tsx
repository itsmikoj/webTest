"use client";

import { HTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface ActionButton {
  label: string;
  onClick: () => void;
  icon?: LucideIcon;
  variant?: "default" | "danger";
}

interface ActionsBarProps extends HTMLAttributes<HTMLDivElement> {
  backButton?: {
    label: string;
    onClick: () => void;
  };
  actions?: ActionButton[];
}

export const ActionsBar = forwardRef<HTMLDivElement, ActionsBarProps>(
  ({ backButton, actions, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between gap-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4",
          className,
        )}
        {...props}
      >
        {backButton && (
          <button
            onClick={backButton.onClick}
            className="flex items-center gap-2 px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            {backButton.label}
          </button>
        )}

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-3">
            {actions.map((action, index) => {
              const Icon = action.icon;
              const isDanger = action.variant === "danger";
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors",
                    isDanger
                      ? "border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  },
);

ActionsBar.displayName = "ActionsBar";
