import {
  getInstallsByAppTracker,
  getSubscriptionsByAppTracker,
} from "./data.service";
import { Install, SuperwallEvent } from "@/types";

type AggregatedData = {
  date: string;
  installs: number;
  subscriptions: number;
  revenue: number;
};

export async function getInstallMetrics(appTrackerId: string): Promise<{
  totalInstalls: number;
  platforms: Record<string, number>;
  allInstalls: Install[];
  topCountries: Record<string, number>;
}> {
  try {
    const installs = await getInstallsByAppTracker(appTrackerId);

    const platforms = installs.reduce(
      (acc, install) => {
        acc[install.platform] = (acc[install.platform] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const topCountries = installs.reduce(
      (acc, install) => {
        acc[install.device_timezone] = (acc[install.device_timezone] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      totalInstalls: installs.length,
      platforms,
      allInstalls: installs,
      topCountries,
    };
  } catch (error) {
    console.error("Error fetching install metrics:", error);
    return {
      totalInstalls: 0,
      platforms: {},
      allInstalls: [],
      topCountries: {},
    };
  }
}

export function aggregateInstallsByDate(
  installs: Install[],
  groupBy: "day" | "week" | "month" = "day",
): AggregatedData[] {
  const aggregated = installs.reduce<Record<string, AggregatedData>>(
    (acc, install) => {
      const date = new Date(install.created_at);
      let key: string;

      switch (groupBy) {
        case "week": {
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split("T")[0];
          break;
        }
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;
          break;
        default:
          key = date.toISOString().split("T")[0];
      }

      if (!acc[key]) {
        acc[key] = { date: key, installs: 0, subscriptions: 0, revenue: 0 };
      }

      acc[key].installs += 1;

      return acc;
    },
    {},
  );

  return Object.values(aggregated).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getSubscriptionMetrics(appTrackerId: string): Promise<{
  totalSubscriptions: number;
  totalRevenue: number;
  platforms: Record<string, number>;
  recentSubscriptions: SuperwallEvent[];
  allSubscriptions: SuperwallEvent[];
  topProducts: Record<string, number>;
}> {
  try {
    const subscriptions = await getSubscriptionsByAppTracker(appTrackerId);

    const platforms = subscriptions.reduce(
      (acc, subscription) => {
        acc[subscription.store] = (acc[subscription.store] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const recentSubscriptions = subscriptions
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 10);

    const topProducts = subscriptions.reduce(
      (acc, subscription) => {
        acc[subscription.product_id] = (acc[subscription.product_id] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const totalRevenue = subscriptions.reduce(
      (sum, subscription) => sum + subscription.proceeds,
      0,
    );

    return {
      totalSubscriptions: subscriptions.length,
      totalRevenue,
      platforms,
      recentSubscriptions,
      allSubscriptions: subscriptions,
      topProducts,
    };
  } catch (error) {
    console.error("Error fetching subscription metrics:", error);
    return {
      totalSubscriptions: 0,
      totalRevenue: 0,
      platforms: {},
      recentSubscriptions: [],
      allSubscriptions: [],
      topProducts: {},
    };
  }
}

export function aggregateSubscriptionsByDate(
  subscriptions: SuperwallEvent[],
  groupBy: "day" | "week" | "month" = "day",
) {
  const aggregated = subscriptions.reduce(
    (acc, subscription) => {
      const date = new Date(subscription.created_at);
      let key: string;

      switch (groupBy) {
        case "week":
          const weekStart = new Date(date);
          weekStart.setDate(date.getDate() - date.getDay());
          key = weekStart.toISOString().split("T")[0];
          break;
        case "month":
          key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
          break;
        default:
          key = date.toISOString().split("T")[0];
      }

      if (!acc[key]) {
        acc[key] = { date: key, installs: 0, subscriptions: 0, revenue: 0 };
      }

      acc[key].subscriptions += 1;
      acc[key].revenue += subscription.proceeds;

      return acc;
    },
    {} as Record<
      string,
      { date: string; installs: number; subscriptions: number; revenue: number }
    >,
  );

  return Object.values(aggregated).sort((a, b) => a.date.localeCompare(b.date));
}
