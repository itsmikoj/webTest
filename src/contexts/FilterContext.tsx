"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { FilterState } from "@/types";
import { useApp } from "./AppContext";

interface FilterContextType {
  filters: FilterState;
  setFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function FilterProvider({ children }: { children: ReactNode }) {
  const { selectedApp } = useApp();

  const [filters, setFiltersState] = useState<FilterState>(() => ({
    appId: null,
    timeRange: "30d",
    platform: "all",
    groupBy: "day",
    startDate: null,
    endDate: null,
  }));

  useEffect(() => {
    if (selectedApp && !filters.appId) {
      setFiltersState(prev => ({ ...prev, appId: selectedApp.id }));
    }
  }, [selectedApp, filters.appId]);

  const setFilters = (newFilters: Partial<FilterState>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(() => ({
      appId: selectedApp?.id || null,
      timeRange: "30d",
      platform: "all",
      groupBy: "day",
      startDate: null,
      endDate: null,
    }));
  };

  return (
    <FilterContext.Provider
      value={{ filters, setFilters, resetFilters }}
    >
      {children}
    </FilterContext.Provider>
  );
}

export function useFilters() {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within FilterProvider");
  }
  return context;
}