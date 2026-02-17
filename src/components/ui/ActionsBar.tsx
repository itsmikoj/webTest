"use client";

import { HTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { ArrowLeft } from "lucide-react";

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
          "flex items-center justify-between gap-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-3",
          className,
        )}
        {...props}
      >
        {backButton && (
          <button
            onClick={backButton.onClick}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg px-3 py-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">{backButton.label}</span>
            <span className="sm:hidden">Back</span>
          </button>
        )}

        {actions && actions.length > 0 && (
          <div className="flex items-center gap-2 ml-auto">
            {actions.map((action, index) => {
              const Icon = action.icon;
              const isDanger = action.variant === "danger";
              return (
                <button
                  key={index}
                  onClick={action.onClick}
                  className={cn(
                    "flex items-center gap-2 px-3 sm:px-4 py-2 border rounded-lg transition-colors text-sm font-medium",
                    isDanger
                      ? "border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                      : "border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700",
                  )}
                >
                  {Icon && <Icon className="w-4 h-4" />}
                  <span>{action.label}</span>
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
