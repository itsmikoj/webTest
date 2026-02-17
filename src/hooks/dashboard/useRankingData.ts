import { useMemo } from "react";
import { Install, SuperwallEvent } from "@/types";

export type RankingType = "country" | "device" | "product" | "version";

export interface RankingItem {
  label: string;
  value: number;
  percentage?: number;
}

export function useRankingData(
  installs: Install[],
  subscriptions: SuperwallEvent[],
  type: RankingType,
  limit: number = 5,
): RankingItem[] {
  return useMemo(() => {
    switch (type) {
      case "country":
        return getTopCountries(installs, limit);
      case "device":
        return getTopDevices(installs, limit);
      case "product":
        return getTopProducts(subscriptions, limit);
      case "version":
        return getTopVersions(installs, limit);
      default:
        return [];
    }
  }, [installs, subscriptions, type, limit]);
}

function getTopCountries(installs: Install[], limit: number): RankingItem[] {
  const countryCounts = installs.reduce(
    (acc, install) => {
      acc[install.device_timezone || "Unknown"] =
        (acc[install.device_timezone || "Unknown"] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const total = installs.length;
  return Object.entries(countryCounts)
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function getTopDevices(installs: Install[], limit: number): RankingItem[] {
  const deviceCounts = installs.reduce(
    (acc, install) => {
      acc[install.device_model || "Unknown Device"] =
        (acc[install.device_model || "Unknown Device"] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const total = installs.length;
  return Object.entries(deviceCounts)
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function getTopProducts(
  subscriptions: SuperwallEvent[],
  limit: number,
): RankingItem[] {
  const productCounts = subscriptions.reduce(
    (acc, sub) => {
      acc[sub.product_id || "Unknown Product"] =
        (acc[sub.product_id || "Unknown Product"] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const total = subscriptions.length;
  return Object.entries(productCounts)
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}

function getTopVersions(installs: Install[], limit: number): RankingItem[] {
  const versionCounts = installs.reduce(
    (acc, install) => {
      acc[install.app_version || "Unknown"] =
        (acc[install.app_version || "Unknown"] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const total = installs.length;
  return Object.entries(versionCounts)
    .map(([label, value]) => ({
      label,
      value,
      percentage: total > 0 ? Math.round((value / total) * 100) : 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, limit);
}
