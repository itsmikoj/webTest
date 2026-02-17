"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartDataPoint } from "@/types";
import { CHART_COLORS } from "@/config/constants";

function formatNumber(value: number): string {
  if (value >= 1000000) return (value / 1000000).toFixed(1) + "M";
  if (value >= 1000) return (value / 1000).toFixed(1) + "K";
  return value.toLocaleString();
}

function formatDate(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(value);
}

interface TimeSeriesChartProps {
  data: ChartDataPoint[];
  showInstalls?: boolean;
  showSubscriptions?: boolean;
  showRevenue?: boolean;
}

export function TimeSeriesChart({
  data,
  showInstalls = true,
  showSubscriptions = true,
  showRevenue = false,
}: TimeSeriesChartProps) {
  const chartData =
    data.length > 0
      ? data
      : [
          {
            date: new Date().toISOString(),
            installs: 0,
            subscriptions: 0,
            revenue: 0,
          },
        ];

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ name: string; value: number; color: string }>;
    label?: string;
  }) => {
    if (active && label) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 border border-slate-200 dark:border-slate-600 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
            {formatDate(label)}
          </p>
          {payload && payload.length > 0 ? (
            payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 dark:text-slate-300">
                  {entry.name}:
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {entry.name === "Revenue"
                    ? formatCurrency(entry.value || 0)
                    : formatNumber(entry.value || 0)}
                </span>
              </div>
            ))
          ) : (
            <div className="text-sm text-slate-500">No data</div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={chartData}
        margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => formatDate(value)}
          stroke="#94a3b8"
          style={{ fontSize: "12px" }}
        />
        <YAxis
          tickFormatter={(value) => formatNumber(value)}
          stroke="#94a3b8"
          style={{ fontSize: "12px" }}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: "14px", paddingTop: "20px" }}
          iconType="circle"
        />
        {showInstalls && (
          <Line
            type="monotone"
            dataKey="installs"
            name="Installs"
            stroke={CHART_COLORS.installs}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        )}
        {showSubscriptions && (
          <Line
            type="monotone"
            dataKey="subscriptions"
            name="Subscriptions"
            stroke={CHART_COLORS.subscriptions}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        )}
        {showRevenue && (
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke={CHART_COLORS.revenue}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}
