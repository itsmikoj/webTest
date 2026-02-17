import { useMemo } from "react";
import { MetricsData, Install, SuperwallEvent } from "@/types";
import {
  calculateInstallMetrics,
  calculateSubscriptionMetrics,
  calculatePercentageChange,
} from "@/lib/calculations";

interface PreviousPeriodData {
  previousInstallCount: number;
  previousSubscriptionCount: number;
  previousRevenue: number;
}

export function useOverviewStats(
  installs: Install[],
  subscriptions: SuperwallEvent[],
  previousPeriod: PreviousPeriodData,
): MetricsData {
  return useMemo(() => {
    const installStats = calculateInstallMetrics(installs);
    const subscriptionStats = calculateSubscriptionMetrics(subscriptions);

    const conversionRate =
      installStats.totalInstalls > 0
        ? (subscriptionStats.totalSubscriptions / installStats.totalInstalls) *
          100
        : 0;

    const previousConversionRate =
      previousPeriod.previousInstallCount > 0
        ? (previousPeriod.previousSubscriptionCount /
            previousPeriod.previousInstallCount) *
          100
        : 0;

    const avgRevenuePerUser =
      subscriptionStats.totalSubscriptions > 0
        ? subscriptionStats.totalRevenue / subscriptionStats.totalSubscriptions
        : 0;

    return {
      totalInstalls: installStats.totalInstalls,
      totalSubscriptions: subscriptionStats.totalSubscriptions,
      totalRevenue: subscriptionStats.totalRevenue,
      conversionRate,
      avgRevenuePerUser,
      installsChange: calculatePercentageChange(
        installStats.totalInstalls,
        previousPeriod.previousInstallCount,
      ),
      subscriptionsChange: calculatePercentageChange(
        subscriptionStats.totalSubscriptions,
        previousPeriod.previousSubscriptionCount,
      ),
      revenueChange: calculatePercentageChange(
        subscriptionStats.totalRevenue,
        previousPeriod.previousRevenue,
      ),
      conversionRateChange: calculatePercentageChange(
        conversionRate,
        previousConversionRate,
      ),
    };
  }, [installs, subscriptions, previousPeriod]);
}

export function useInstallStats(installs: Install[]) {
  return useMemo(() => calculateInstallMetrics(installs), [installs]);
}

export function useSubscriptionStats(subscriptions: SuperwallEvent[]) {
  return useMemo(
    () => calculateSubscriptionMetrics(subscriptions),
    [subscriptions],
  );
}
