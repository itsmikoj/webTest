import { Install, SuperwallEvent, FilterState } from "@/types";

export function applyInstallFilters(
  installs: Install[],
  filters: FilterState,
): Install[] {
  let filtered = installs;

  if (filters.platform && filters.platform !== "all") {
    filtered = filtered.filter(
      (i) => i.platform.toLowerCase() === filters.platform,
    );
  }

  if (filters.timeRange && filters.timeRange !== "all times") {
    const { startDate, endDate } = getDateRange(filters.timeRange);
    filtered = filtered.filter((i) => {
      const date = new Date(i.created_at);
      return date >= startDate && date <= endDate;
    });
  }

  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    filtered = filtered.filter((i) => {
      const date = new Date(i.created_at);
      return date >= start && date <= end;
    });
  }

  return filtered;
}

export function applySubscriptionFilters(
  subscriptions: SuperwallEvent[],
  filters: FilterState,
): SuperwallEvent[] {
  let filtered = subscriptions;

  if (filters.platform && filters.platform !== "all") {
    const platformFilter =
      filters.platform === "ios" ? "app_store" : "play_store";
    filtered = filtered.filter(
      (s) => s.store?.toLowerCase() === platformFilter,
    );
  }

  if (filters.timeRange && filters.timeRange !== "all times") {
    const { startDate, endDate } = getDateRange(filters.timeRange);
    filtered = filtered.filter((s) => {
      const date = new Date(s.created_at);
      return date >= startDate && date <= endDate;
    });
  }

  if (filters.startDate && filters.endDate) {
    const start = new Date(filters.startDate);
    const end = new Date(filters.endDate);
    filtered = filtered.filter((s) => {
      const date = new Date(s.created_at);
      return date >= start && date <= end;
    });
  }

  return filtered;
}

function getDateRange(timeRange: FilterState["timeRange"]): {
  startDate: Date;
  endDate: Date;
} {
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  let startDate: Date;

  switch (timeRange) {
    case "today":
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case "7d":
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case "30d":
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case "90d":
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  return { startDate, endDate: now };
}
