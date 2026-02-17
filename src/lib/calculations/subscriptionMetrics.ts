import { SuperwallEvent } from "@/types";

export interface SubscriptionStats {
  totalSubscriptions: number;
  totalRevenue: number;
  topProducts: Record<string, number>;
  platformRevenue: Record<string, number>;
}

export function calculateSubscriptionMetrics(
  subscriptions: SuperwallEvent[],
): SubscriptionStats {
  const totalSubscriptions = subscriptions.length;
  const totalRevenue = subscriptions.reduce(
    (sum, sub) => sum + sub.proceeds,
    0,
  );

  const topProducts = subscriptions.reduce(
    (acc, sub) => {
      const product = sub.product_id || "Unknown Product";
      acc[product] = (acc[product] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const platformRevenue = subscriptions.reduce(
    (acc, sub) => {
      const platform = sub.store?.toLowerCase() || "unknown";
      acc[platform] = (acc[platform] || 0) + sub.proceeds;
      return acc;
    },
    {} as Record<string, number>,
  );

  return { totalSubscriptions, totalRevenue, topProducts, platformRevenue };
}

export function formatPlatformName(platform: string): string {
  if (platform === "app_store") return "App Store";
  if (platform === "play_store") return "Google Play";
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}
