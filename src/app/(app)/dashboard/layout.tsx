"use client";

import { FilterProvider } from "@/contexts/FilterContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <FilterProvider>
      {children}
    </FilterProvider>
  );
}
