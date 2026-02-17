import { DashboardFilters } from "@/components/shared/DashboardFilters";
import { FilterState } from "@/types";
import { RefreshCw } from "lucide-react";

interface PageHeaderProps {
  title: string;
  description: string;
  showFilters?: boolean;
  filters?: FilterState;
  onFiltersChange?: (filters: Partial<FilterState>) => void;
  onResetFilters?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function PageHeader({
  title,
  description,
  showFilters = true,
  filters,
  onFiltersChange,
  onResetFilters,
  onRefresh,
  isRefreshing = false,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {title}
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
          {description}
        </p>
      </div>

      {showFilters && (
        <div className="flex items-center gap-4">
          {filters && onFiltersChange && (
            <DashboardFilters
              filters={filters}
              onFiltersChange={onFiltersChange}
            />
          )}

          <div className="flex items-center gap-2">
            {onResetFilters && (
              <button
                onClick={onResetFilters}
                className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
              >
                Reset
              </button>
            )}

            {onRefresh && (
              <button
                onClick={onRefresh}
                disabled={isRefreshing}
                className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-50"
                title="Refresh data"
              >
                <RefreshCw
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`}
                />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
