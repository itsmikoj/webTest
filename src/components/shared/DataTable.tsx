import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { EmptyState } from "../states";

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  title?: string;
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: string;
  maxRows?: number;
  maxHeight?: number;
  scrollable?: boolean;
  onRowClick?: (item: T) => void;
}

export function DataTable<T>({
  title,
  columns,
  data,
  keyExtractor,
  emptyMessage = "No data available",
  maxRows,
  maxHeight,
  scrollable = false,
  onRowClick,
}: DataTableProps<T>) {
  const displayData = maxRows ? data.slice(0, maxRows) : data;

  if (displayData.length === 0) {
    return (
      <Card padding="lg">
        {title && (
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <EmptyState description={emptyMessage} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      {title && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <div
          className={`overflow-x-auto ${maxHeight && scrollable ? "overflow-y-auto" : ""}`}
          style={maxHeight ? { maxHeight } : undefined}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                {columns.map((column) => (
                  <th
                    key={String(column.key)}
                    className={`text-left text-sm font-medium text-slate-500 dark:text-slate-400 pb-3 ${column.className || ""}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {displayData.map((item) => (
                <tr
                  key={keyExtractor(item)}
                  onClick={() => onRowClick?.(item)}
                  className={`border-b border-slate-100 dark:border-slate-800 last:border-0 ${
                    onRowClick ? "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50" : ""
                  }`}
                >
                  {columns.map((column) => (
                    <td
                      key={String(column.key)}
                      className={`py-3 text-sm text-slate-700 dark:text-slate-300 ${column.className || ""}`}
                    >
                      {column.render
                        ? column.render(item)
                        : String(item[column.key as keyof T] || "")}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
