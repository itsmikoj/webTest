import { useMemo } from "react";
import { Install, SuperwallEvent } from "@/types";
import {
  calculateInstallMetrics,
  calculateSubscriptionMetrics,
  formatPlatformName,
} from "@/lib/calculations";

export interface DistributionItem {
  label: string;
  value: number;
  percentage: number;
  color?: string;
}

export function useDistributionData(
  installs: Install[],
  subscriptions: SuperwallEvent[],
) {
  const platformDistribution = useMemo(() => {
    if (!installs.length) return [];
    const stats = calculateInstallMetrics(installs);
    const total = installs.length;
    const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500"];
    return Object.entries(stats.platforms)
      .map(([platform, value], idx) => ({
        label: formatPlatformName(platform),
        value,
        percentage: Math.round((value / total) * 100),
        color: colors[idx % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [installs]);

  const revenueDistribution = useMemo(() => {
    if (!subscriptions.length) return [];
    const stats = calculateSubscriptionMetrics(subscriptions);
    const total = stats.totalRevenue;
    const colors = ["bg-blue-500", "bg-green-500"];
    return Object.entries(stats.platformRevenue)
      .map(([platform, value], idx) => ({
        label: formatPlatformName(platform),
        value,
        percentage: Math.round((value / total) * 100),
        color: colors[idx % colors.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [subscriptions]);

  const osVersionDistribution = useMemo(() => {
    if (!installs.length) return [];
    const stats = calculateInstallMetrics(installs);
    const total = installs.length;
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
    ];
    return Object.entries(stats.appVersions)
      .map(([version, value], idx) => ({
        label: version,
        value,
        percentage: Math.round((value / total) * 100),
        color: colors[idx % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 4);
  }, [installs]);

  return { platformDistribution, revenueDistribution, osVersionDistribution };
}
