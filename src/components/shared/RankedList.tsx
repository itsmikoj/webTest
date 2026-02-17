import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils/format";

export interface RankedItem {
  label: string;
  value: number;
  percentage?: number;
}

interface RankedListProps {
  title: string;
  items: RankedItem[];
  emptyMessage?: string;
}

export function RankedList({
  title,
  items,
  emptyMessage = "No data available",
}: RankedListProps) {
  return (
    <Card padding="lg">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.length === 0 ? (
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {emptyMessage}
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between"
              >
                <span className="text-sm text-slate-700 dark:text-slate-300 truncate">
                  {item.label}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    {formatNumber(item.value)}
                  </span>
                  {item.percentage !== undefined && (
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      ({item.percentage}%)
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
