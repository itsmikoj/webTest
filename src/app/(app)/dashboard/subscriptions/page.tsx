"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatsGrid } from "@/components/shared/StatsGrid";
import { RankedList } from "@/components/shared/RankedList";
import { DistributionBarList } from "@/components/shared/DistributionBarList";
import { TimeSeriesChart } from "@/components/shared/TimeSeriesChart";
import { useApp } from "@/contexts/AppContext";
import { useDashboardData } from "@/hooks/useDashboardData";
import { useFilters } from "@/contexts/FilterContext";
import {
  useOverviewStats,
  useRankingData,
  useTrendData,
  useDistributionData,
} from "@/hooks/dashboard";
import { applyInstallFilters, applySubscriptionFilters } from "@/lib/calculations";

export default function SubscriptionsPage() {
  const { selectedApp } = useApp();
  const { subscriptions, installs, isLoading, refetch } = useDashboardData(
    selectedApp?.id || null,
  );
  const { filters, setFilters, resetFilters } = useFilters();

  const filteredSubscriptions = applySubscriptionFilters(
    subscriptions,
    filters,
  );
  const filteredInstalls = applyInstallFilters(installs, filters);
  const previousPeriod = {
    previousInstallCount: 0,
    previousSubscriptionCount: 0,
    previousRevenue: 0,
  };
  const metrics = useOverviewStats(filteredInstalls, filteredSubscriptions, previousPeriod);
  const trendData = useTrendData([], filteredSubscriptions, filters.groupBy);
  const { revenueDistribution } = useDistributionData(
    [],
    filteredSubscriptions,
  );
  const topProducts = useRankingData([], filteredSubscriptions, "product");

  const subscriptionMetrics = {
    ...metrics,
    totalSubscriptions: metrics.totalSubscriptions,
    totalRevenue: metrics.totalRevenue,
    conversionRate:
      metrics.totalInstalls > 0
        ? (metrics.totalSubscriptions / metrics.totalInstalls) * 100
        : 0,
    avgRevenuePerUser:
      metrics.totalSubscriptions > 0
        ? metrics.totalRevenue / metrics.totalSubscriptions
        : 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscriptions"
        description="Monitor subscription metrics and revenue"
        showFilters={true}
        filters={filters}
        onFiltersChange={setFilters}
        onResetFilters={resetFilters}
        onRefresh={refetch}
        isRefreshing={isLoading}
      />

      <StatsGrid
        metrics={subscriptionMetrics}
        columns={4}
        showMetrics={[
          "totalSubscriptions",
          "conversionRate",
          "totalRevenue",
          "avgRevenuePerUser",
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Subscriptions Trend</CardTitle>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">
              Subscription activity over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <TimeSeriesChart
                data={trendData}
                showInstalls={false}
                showSubscriptions
                showRevenue={false}
              />
            </div>
          </CardContent>
        </Card>

        <Card padding="lg">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">
              Revenue performance over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <TimeSeriesChart
                data={trendData}
                showInstalls={false}
                showSubscriptions={false}
                showRevenue
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RankedList title="Top Products" items={topProducts} />
        <DistributionBarList
          title="Revenue by Platform"
          items={revenueDistribution.map((item) => ({
            ...item,
            isCurrency: true,
          }))}
        />
      </div>
    </div>
  );
}
