"use client";

import { useState, useRef, useEffect } from "react";
import { SlidersHorizontal, Check, X } from "lucide-react";
import { FILTER_OPTIONS } from "@/config/constants";
import { FilterState } from "@/types";
import { cn } from "@/lib/utils/cn";

interface DashboardFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: Partial<FilterState>) => void;
  onResetFilters?: () => void;
}

function isDefaultFilter(filters: FilterState): boolean {
  return (
    filters.timeRange === "all times" &&
    filters.platform === "all" &&
    filters.groupBy === "day"
  );
}

export function DashboardFilters({
  filters,
  onFiltersChange,
  onResetFilters,
}: DashboardFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hasActiveFilters = !isDefaultFilter(filters);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const timeLabel =
    FILTER_OPTIONS.timeRanges.find((o) => o.value === filters.timeRange)
      ?.label ?? "All Times";
  const platformLabel =
    FILTER_OPTIONS.platforms.find((o) => o.value === filters.platform)?.label ??
    "All Platforms";
  const groupLabel =
    FILTER_OPTIONS.groupBy.find((o) => o.value === filters.groupBy)?.label ??
    "Day";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-colors",
          isOpen
            ? "bg-blue-50 border-blue-300 text-blue-700 dark:bg-blue-900/30 dark:border-blue-600 dark:text-blue-300"
            : hasActiveFilters
              ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300"
              : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300 dark:hover:bg-slate-700",
        )}
      >
        <SlidersHorizontal className="w-4 h-4" />
        <span className="hidden sm:inline">Filters</span>
        <span className="hidden sm:flex items-center gap-1">
          {filters.timeRange !== "all times" && (
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs px-1.5 py-0.5 rounded-full">
              {timeLabel}
            </span>
          )}
          {filters.platform !== "all" && (
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs px-1.5 py-0.5 rounded-full">
              {platformLabel}
            </span>
          )}
          {filters.groupBy !== "day" && (
            <span className="bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-200 text-xs px-1.5 py-0.5 rounded-full">
              {groupLabel}
            </span>
          )}
        </span>
        {hasActiveFilters && (
          <span className="sm:hidden w-2 h-2 rounded-full bg-blue-500 inline-block" />
        )}
      </button>

      {isOpen && (
        <div
          ref={panelRef}
          className="absolute top-full right-[-48px] mt-2 w-screen max-w-[min(288px,calc(100vw-2rem))] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-700">
            <span className="text-sm font-semibold text-slate-900 dark:text-white">
              Filters
            </span>
            <div className="flex items-center gap-2">
              {hasActiveFilters && onResetFilters && (
                <button
                  onClick={() => {
                    onResetFilters();
                    setIsOpen(false);
                  }}
                  className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
                >
                  Reset all
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                <X className="w-4 h-4 text-slate-500" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-5">
            <FilterSection
              label="Time Range"
              options={FILTER_OPTIONS.timeRanges}
              value={filters.timeRange}
              onChange={(v) =>
                onFiltersChange({ timeRange: v as FilterState["timeRange"] })
              }
            />
            <FilterSection
              label="Platform"
              options={FILTER_OPTIONS.platforms}
              value={filters.platform}
              onChange={(v) =>
                onFiltersChange({ platform: v as FilterState["platform"] })
              }
            />
            <FilterSection
              label="Group By"
              options={FILTER_OPTIONS.groupBy}
              value={filters.groupBy}
              onChange={(v) =>
                onFiltersChange({ groupBy: v as FilterState["groupBy"] })
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface FilterSectionProps {
  label: string;
  options: readonly { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

function FilterSection({
  label,
  options,
  value,
  onChange,
}: FilterSectionProps) {
  return (
    <div>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isActive = opt.value === value;
          return (
            <button
              key={opt.value}
              onClick={() => onChange(opt.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors border",
                isActive
                  ? "bg-blue-600 border-blue-600 text-white"
                  : "bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-slate-600",
              )}
            >
              {isActive && <Check className="w-3 h-3" />}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
