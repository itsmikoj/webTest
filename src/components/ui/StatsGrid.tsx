import { HTMLAttributes, forwardRef } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export interface Stat {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  color?: "blue" | "green" | "purple" | "orange" | "red" | "yellow";
}

interface StatsGridProps extends HTMLAttributes<HTMLDivElement> {
  stats: Stat[];
  columns?: 2 | 3 | 4;
}

const colorClasses = {
  blue: "from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500",
  green: "from-green-500 to-green-600 dark:from-green-400 dark:to-green-500",
  purple:
    "from-purple-500 to-purple-600 dark:from-purple-400 dark:to-purple-500",
  orange:
    "from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500",
  red: "from-red-500 to-red-600 dark:from-red-400 dark:to-red-500",
  yellow:
    "from-yellow-500 to-yellow-600 dark:from-yellow-400 dark:to-yellow-500",
};

const gridCols = {
  2: "grid-cols-2",
  3: "grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export const StatsGrid = forwardRef<HTMLDivElement, StatsGridProps>(
  ({ stats, columns = 4, className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("grid gap-4", gridCols[columns], className)}
        {...props}
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6"
            >
              <div className="flex items-center gap-3 mb-2">
                {Icon && stat.color && (
                  <div
                    className={cn(
                      "w-9 h-9 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br flex items-center justify-center flex-shrink-0",
                      colorClasses[stat.color],
                    )}
                  >
                    <Icon className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                  </div>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-1">
                {stat.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>
    );
  },
);

StatsGrid.displayName = "StatsGrid";
