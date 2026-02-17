"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { DistributionBarList } from "@/components/shared/DistributionBarList";
import { RankedList } from "@/components/shared/RankedList";
import { TimeSeriesChart } from "@/components/shared/TimeSeriesChart";
import { useApp } from "@/contexts/AppContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFilters } from "@/contexts/FilterContext";
import {
  useOverviewStats,
  useRankingData,
  useTrendData,
  useDistributionData,
  useInstallStats,
} from "@/hooks/dashboard";
import { applyInstallFilters } from "@/lib/calculations";
import { Install } from "@/types";
import { useMemo } from "react";

function formatNumber(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toLocaleString();
}

export default function InstallsPage() {
  const { selectedApp } = useApp();
  const { installs, isLoading, refetch } = useDashboardData(
    selectedApp?.id || null,
  );
  const { filters, setFilters, resetFilters } = useFilters();

  const filteredInstalls = applyInstallFilters(installs, filters);
  const previousPeriod = {
    previousInstallCount: 0,
    previousSubscriptionCount: 0,
    previousRevenue: 0,
  };
  const metrics = useOverviewStats(filteredInstalls, [], previousPeriod);
  const installStats = useInstallStats(filteredInstalls);
  const trendData = useTrendData(filteredInstalls, [], filters.groupBy);
  const { platformDistribution } = useDistributionData(filteredInstalls, []);
  const topDevices = useRankingData(filteredInstalls, [], "device");

  const osVersionDistribution = useMemo(() => {
    const osCounts = filteredInstalls.reduce(
      (acc, install: Install) => {
        const os = install.device_os_version || "Unknown";
        acc[os] = (acc[os] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );
    const total = filteredInstalls.length;
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
    ];
    return Object.entries(osCounts)
      .map(([label, value], idx) => ({
        label,
        value,
        percentage: Math.round((value / total) * 100),
        color: colors[idx % colors.length],
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [filteredInstalls]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Installs"
        description="Track and analyze your app installations"
        showFilters={true}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      <StatsGrid
        metrics={metrics}
        columns={3}
        showMetrics={["totalInstalls", "attRate", "latestVersion"]}
        attRate={installStats.attRate}
        latestVersion={installStats.latestVersion}
      />

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Installs Trend</CardTitle>
          <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">
            Install activity over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-56 sm:h-80">
            <TimeSeriesChart
              data={trendData}
              showInstalls
              showSubscriptions={false}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionBarList
          title="Platform Breakdown"
          items={platformDistribution}
        />
        <RankedList title="Top Device Models" items={topDevices} />
      </div>

      <Card padding="lg">
        <CardHeader>
          <CardTitle>OS Version Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {osVersionDistribution.length > 0 ? (
              osVersionDistribution.map((os) => (
                <div
                  key={os.label}
                  className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg"
                >
                  <div
                    className={`w-4 h-4 rounded-full mx-auto mb-2 ${os.color}`}
                  />
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {os.label}
                  </p>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">
                    {formatNumber(os.value)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {os.percentage}% of total
                  </p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center p-8">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No OS version data available
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
