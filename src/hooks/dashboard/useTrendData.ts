import { useMemo } from "react";
import { Install, SuperwallEvent, FilterState, ChartDataPoint } from "@/types";
import { aggregateChartData } from "@/lib/calculations";

export function useTrendData(
  installs: Install[],
  subscriptions: SuperwallEvent[],
  groupBy: FilterState["groupBy"],
): ChartDataPoint[] {
  return useMemo(
    () => aggregateChartData(installs, subscriptions, groupBy),
    [installs, subscriptions, groupBy],
  );
}
