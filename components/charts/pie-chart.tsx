"use client";

import { useMemo } from "react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";

type PieChartItem = Record<string, string | number>;

type ReusablePieChartCardProps<TData extends PieChartItem> = {
  title: string;
  subtitle?: string;
  data: TData[];

  nameKey: keyof TData & string;
  valueKey: keyof TData & string;

  valueLabel?: string;
  totalLabel?: string;

  height?: number;
  className?: string;

  formatValue?: (value: number) => string;
};

type NormalizedPieItem = {
  name: string;
  value: number;
  percentage: number;
};

type TooltipProps = {
  active?: boolean;
  payload?: Array<{
    payload?: NormalizedPieItem;
  }>;
  valueLabel: string;
  formatValue: (value: number) => string;
};

const PIE_COLORS = [
  "var(--primary)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

function defaultFormatValue(value: number) {
  return value.toLocaleString();
}

function PieTooltip({
  active,
  payload,
  valueLabel,
  formatValue,
}: TooltipProps) {
  if (!active || !payload?.length) return null;

  const item = payload[0]?.payload;

  if (!item) return null;

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{item.name}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {valueLabel}:{" "}
        <span className="font-semibold text-foreground">
          {formatValue(item.value)}
        </span>
      </p>

      <p className="mt-1 text-xs text-muted-foreground">
        Share:{" "}
        <span className="font-semibold text-foreground">
          {item.percentage}%
        </span>
      </p>
    </div>
  );
}

export function ReusablePieChartCard<TData extends PieChartItem>({
  title,
  subtitle,
  data,
  nameKey,
  valueKey,
  valueLabel = "Value",
  totalLabel = "Total",
  height = 260,
  className,
  formatValue = defaultFormatValue,
}: ReusablePieChartCardProps<TData>) {
  const normalizedData = useMemo(() => {
    const total = data.reduce((sum, item) => {
      return sum + Number(item[valueKey] ?? 0);
    }, 0);

    return data.map((item) => {
      const value = Number(item[valueKey] ?? 0);

      return {
        name: String(item[nameKey] ?? ""),
        value,
        percentage: total > 0 ? Math.round((value / total) * 100) : 0,
      };
    });
  }, [data, nameKey, valueKey]);

  const totalValue = useMemo(() => {
    return normalizedData.reduce((sum, item) => sum + item.value, 0);
  }, [normalizedData]);

  return (
    <Card
      className={
        className ??
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      }
    >
      <CardContent className="p-5 sm:p-6">
        <div className="flex flex-col gap-1">
          <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {title}
          </h3>

          {subtitle ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {subtitle}
            </p>
          ) : null}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_190px] lg:items-center">
          <div className="w-full" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  content={
                    <PieTooltip
                      valueLabel={valueLabel}
                      formatValue={formatValue}
                    />
                  }
                />

                <Pie
                  data={normalizedData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={94}
                  paddingAngle={4}
                  stroke="var(--card)"
                  strokeWidth={3}
                >
                  {normalizedData.map((item, index) => (
                    <Cell
                      key={item.name}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground">
              {totalLabel}
            </p>

            <p className="mt-1 text-2xl font-bold tracking-tight text-foreground">
              {formatValue(totalValue)}
            </p>

            <div className="mt-5 space-y-3">
              {normalizedData.map((item, index) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex min-w-0 items-center gap-2">
                    <span
                      className="size-2.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          PIE_COLORS[index % PIE_COLORS.length],
                      }}
                    />

                    <p className="truncate text-sm font-medium text-foreground">
                      {item.name}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold text-muted-foreground">
                    {item.percentage}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}