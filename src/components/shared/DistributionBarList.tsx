import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatCurrency, formatNumber } from "@/lib/utils/format";

export interface DistributionItem {
  label: string;
  value: number;
  percentage: number;
  color?: string;
  isCurrency?: boolean;
}

interface DistributionBarListProps {
  title: string;
  items: DistributionItem[];
  emptyMessage?: string;
}

const defaultColors = [
  "bg-blue-500",
  "bg-green-500",
  "bg-purple-500",
  "bg-orange-500",
  "bg-red-500",
];

export function DistributionBarList({
  title,
  items,
  emptyMessage = "No data available",
}: DistributionBarListProps) {
  if (items.length === 0) {
    return (
      <Card padding="lg">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            {emptyMessage}
          </div>
        </CardContent>
      </Card>
    );
  }

  const isCurrency = items[0]?.isCurrency;

  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={item.label}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-full ${item.color || defaultColors[idx % defaultColors.length]}`}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {item.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {isCurrency
                      ? formatCurrency(item.value)
                      : formatNumber(item.value)}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                    ({item.percentage}%)
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2">
                <div
                  className={`${item.color || defaultColors[idx % defaultColors.length]} h-2 rounded-full transition-all`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
