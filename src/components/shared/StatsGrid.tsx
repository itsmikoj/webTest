import {
  formatCurrency,
  formatNumber,
  formatPercentage,
} from "@/lib/utils/format";
import { StatCard } from "./StatCard";
import { MetricsData } from "@/types";
import {
  Download,
  CreditCard,
  DollarSign,
  TrendingUp,
  Shield,
  Package,
} from "lucide-react";

type MetricType =
  | "totalInstalls"
  | "totalSubscriptions"
  | "totalRevenue"
  | "conversionRate"
  | "avgRevenuePerUser"
  | "attRate"
  | "latestVersion";

interface StatsGridProps {
  metrics: MetricsData;
  columns?: number;
  showMetrics?: MetricType[];
  attRate?: number;
  latestVersion?: string;
}

export function StatsGrid({
  metrics,
  columns = 4,
  showMetrics,
  attRate = 0,
  latestVersion = "N/A",
}: StatsGridProps) {
  const defaultMetrics: MetricType[] = [
    "totalInstalls",
    "totalSubscriptions",
    "totalRevenue",
    "conversionRate",
  ];
  const metricsToShow = showMetrics || defaultMetrics;

  const allMetrics: Record<MetricType, React.ReactNode> = {
    totalInstalls: (
      <StatCard
        key="totalInstalls"
        title="Total Installs"
        value={formatNumber(metrics.totalInstalls)}
        change={metrics.installsChange}
        icon={<Download className="w-6 h-6" />}
      />
    ),
    totalSubscriptions: (
      <StatCard
        key="totalSubscriptions"
        title="Total Subscriptions"
        value={formatNumber(metrics.totalSubscriptions)}
        change={metrics.subscriptionsChange}
        icon={<CreditCard className="w-6 h-6" />}
      />
    ),
    totalRevenue: (
      <StatCard
        key="totalRevenue"
        title="Total Revenue"
        value={formatCurrency(metrics.totalRevenue)}
        change={metrics.revenueChange}
        icon={<DollarSign className="w-6 h-6" />}
      />
    ),
    conversionRate: (
      <StatCard
        key="conversionRate"
        title="Conversion Rate"
        value={formatPercentage(metrics.conversionRate)}
        change={metrics.conversionRateChange}
        icon={<TrendingUp className="w-6 h-6" />}
      />
    ),
    avgRevenuePerUser: (
      <StatCard
        key="avgRevenuePerUser"
        title="ARPU"
        value={formatCurrency(metrics.avgRevenuePerUser)}
        change={0}
        icon={<DollarSign className="w-6 h-6" />}
      />
    ),
    attRate: (
      <StatCard
        key="attRate"
        title="ATT Authorized"
        value={formatPercentage(attRate)}
        icon={<Shield className="w-6 h-6" />}
      />
    ),
    latestVersion: (
      <StatCard
        key="latestVersion"
        title="Latest Version"
        value={latestVersion}
        icon={<Package className="w-6 h-6" />}
      />
    ),
  };

  const cols: Record<number, string> = {
    2: "md:grid-cols-2",
    3: "md:grid-cols-3",
    4: "md:grid-cols-2 lg:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${cols[columns] || cols[4]} gap-6`}>
      {metricsToShow.map((metric) => allMetrics[metric])}
    </div>
  );
}
