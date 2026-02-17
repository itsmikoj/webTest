"use client";

import { Select } from "@/components/ui/Select";
import { FILTER_OPTIONS } from "@/config/constants";
import { FilterState } from "@/types";

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
}

export function DashboardFilters({
  filters,
  onFiltersChange,
}: DashboardFiltersProps) {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <div className="w-48">
        <Select
          options={FILTER_OPTIONS.timeRanges}
          value={filters.timeRange}
          onChange={(e) =>
            onFiltersChange({
              timeRange: e.target.value as FilterState["timeRange"],
            })
          }
          size="sm"
        />
      </div>

      <div className="w-40">
        <Select
          options={FILTER_OPTIONS.platforms}
          value={filters.platform}
          onChange={(e) =>
            onFiltersChange({
              platform: e.target.value as FilterState["platform"],
            })
          }
          size="sm"
        />
      </div>

      <div className="w-32">
        <Select
          options={FILTER_OPTIONS.groupBy}
          value={filters.groupBy}
          onChange={(e) =>
            onFiltersChange({
              groupBy: e.target.value as FilterState["groupBy"],
            })
          }
          size="sm"
        />
      </div>
    </div>
  );
}
