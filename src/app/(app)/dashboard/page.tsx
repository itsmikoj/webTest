"use client";

import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { LoadingState } from "@/components/states";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TimeSeriesChart } from "@/components/shared/TimeSeriesChart";
import { RankedList } from "@/components/shared/RankedList";
import { DistributionBarList } from "@/components/shared/DistributionBarList";
import { DataTable } from "@/components/shared/DataTable";
import { useApp } from "@/contexts/AppContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFilters } from "@/contexts/FilterContext";
import {
  useOverviewStats,
  useRankingData,
  useTrendData,
  useDistributionData,
} from "@/hooks/dashboard";
import {
  applyInstallFilters,
  applySubscriptionFilters,
} from "@/lib/calculations";

export default function DashboardPage() {
  const { selectedApp } = useApp();
  const { installs, subscriptions, isLoading, refetch } = useDashboardData(
    selectedApp?.id || null,
  );
  const { filters, setFilters, resetFilters } = useFilters();

  const filteredInstalls = applyInstallFilters(installs, filters);
  const filteredSubscriptions = applySubscriptionFilters(
    subscriptions,
    filters,
  );

  const previousPeriod = {
    previousInstallCount: 0,
    previousSubscriptionCount: 0,
    previousRevenue: 0,
  };
  const metrics = useOverviewStats(
    filteredInstalls,
    filteredSubscriptions,
    previousPeriod,
  );
  const trendData = useTrendData(
    filteredInstalls,
    filteredSubscriptions,
    filters.groupBy,
  );
  const { platformDistribution } = useDistributionData(
    filteredInstalls,
    subscriptions,
  );
  const topCountries = useRankingData(filteredInstalls, [], "country");

  const recentActivity = filteredInstalls
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )
    .map((install) => ({
      id: install.id,
      description: `New install on ${install.platform}`,
      timestamp: install.created_at,
    }));

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Overview"
        description="Monitor your app's performance"
        showFilters={true}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      <StatsGrid metrics={metrics} columns={4} />

      <Card padding="lg">
        <CardHeader>
          <CardTitle>Installs & Subscriptions Trend</CardTitle>
          <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">
            Activity over time
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-56 sm:h-80">
            <TimeSeriesChart data={trendData} showInstalls showSubscriptions />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DistributionBarList
          title="Platform Distribution"
          items={platformDistribution}
        />
        <RankedList title="Top Countries" items={topCountries} />
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={[
                { key: "description", header: "Activity" },
                {
                  key: "timestamp",
                  header: "Time",
                  render: (item) =>
                    new Date(item.timestamp).toLocaleDateString(),
                },
              ]}
              data={recentActivity}
              keyExtractor={(item) => item.id}
              emptyMessage="No recent activity"
              maxRows={10}
              maxHeight={300}
              scrollable={true}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
