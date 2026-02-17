import { Install, SuperwallEvent, FilterState, ChartDataPoint } from "@/types";

export function aggregateChartData(
  installs: Install[],
  subscriptions: SuperwallEvent[],
  groupBy: FilterState["groupBy"],
): ChartDataPoint[] {
  const dataMap = new Map<string, ChartDataPoint>();

  const formatDate = (date: Date): string => {
    if (groupBy === "month") return date.toISOString().slice(0, 7);
    if (groupBy === "week") {
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      return weekStart.toISOString().slice(0, 10);
    }
    return date.toISOString().slice(0, 10);
  };

  installs.forEach((install) => {
    const date = formatDate(new Date(install.created_at));
    const existing = dataMap.get(date) || {
      date,
      installs: 0,
      subscriptions: 0,
      revenue: 0,
    };
    existing.installs += 1;
    dataMap.set(date, existing);
  });

  subscriptions.forEach((sub) => {
    const date = formatDate(new Date(sub.created_at));
    const existing = dataMap.get(date) || {
      date,
      installs: 0,
      subscriptions: 0,
      revenue: 0,
    };
    existing.subscriptions += 1;
    existing.revenue += sub.proceeds;
    dataMap.set(date, existing);
  });

  return Array.from(dataMap.values()).sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}
