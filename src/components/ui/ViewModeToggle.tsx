"use client";

import { LayoutGrid, List } from "lucide-react";

interface ViewModeToggleProps {
  value: "grid" | "list";
  onChange: (value: "grid" | "list") => void;
}

export function ViewModeToggle({ value, onChange }: ViewModeToggleProps) {
  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
      <button
        onClick={() => onChange("grid")}
        className={`p-2 rounded-md transition-colors ${
          value === "grid"
            ? "bg-white dark:bg-slate-700 shadow-sm"
            : "hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("list")}
        className={`p-2 rounded-md transition-colors ${
          value === "list"
            ? "bg-white dark:bg-slate-700 shadow-sm"
            : "hover:bg-slate-200 dark:hover:bg-slate-700"
        }`}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
}
