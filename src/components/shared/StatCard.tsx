import { Card, CardContent } from "@/components/ui/Card";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: ReactNode;
  trend?: "up" | "down";
}

export function StatCard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
              {title}
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {value}
            </p>
            {/* {change !== undefined && (
              <div className="flex items-center gap-1">
                <span className={`text-sm font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}{change.toFixed(1)}%
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400">{changeLabel || "vs last period"}</span>
              </div>
            )} */}
          </div>
          {icon && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-blue-600">{icon}</div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
