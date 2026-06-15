"use client";

import { useCallback, useMemo, useState } from "react";
import { MoreVertical } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ChartItem = Record<string, string | number>;

type ChartRangeOption<TData extends ChartItem> = {
  label: string;
  value: string;
  data: TData[];
  description?: string;
  totalLabel?: string;
};

type ReusableBarChartCardProps<TData extends ChartItem> = {
  title: string;
  subtitle?: string;

  data?: TData[];
  ranges?: ChartRangeOption<TData>[];

  labelKey: keyof TData & string;
  valueKey: keyof TData & string;

  valueLabel?: string;
  totalLabel?: string;

  height?: number;
  maxBarSize?: number;
  showTotal?: boolean;
  showMenu?: boolean;
  className?: string;

  formatValue?: (value: number) => string;
};

type TooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{
    value?: number | string;
  }>;
  valueLabel: string;
  formatValue: (value: number) => string;
};

function ChartTooltip({
  active,
  label,
  payload,
  valueLabel,
  formatValue,
}: TooltipProps) {
  if (!active || !payload?.length) return null;

  const value = Number(payload[0]?.value ?? 0);

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{label}</p>

      <p className="mt-1 text-xs text-muted-foreground">
        {valueLabel}:{" "}
        <span className="font-semibold text-foreground">
          {formatValue(value)}
        </span>
      </p>
    </div>
  );
}

function defaultFormatValue(value: number) {
  return value.toLocaleString();
}

export function ReusableBarChartCard<TData extends ChartItem>({
  title,
  subtitle,
  data,
  ranges,
  labelKey,
  valueKey,
  valueLabel = "Value",
  totalLabel = "Total",
  height = 230,
  maxBarSize = 42,
  showTotal = true,
  showMenu = true,
  className,
  formatValue = defaultFormatValue,
}: ReusableBarChartCardProps<TData>) {
  const hasRanges = Boolean(ranges?.length);

  const [selectedRange, setSelectedRange] = useState(
    ranges?.[0]?.value ?? "default",
  );

  const selectedOption = useMemo(() => {
    if (!ranges?.length) return undefined;

    return ranges.find((item) => item.value === selectedRange) ?? ranges[0];
  }, [ranges, selectedRange]);

  const chartData = useMemo(() => {
    if (selectedOption) return selectedOption.data;

    return data ?? [];
  }, [data, selectedOption]);

  const totalValue = useMemo(() => {
    return chartData.reduce((total, item) => {
      const value = Number(item[valueKey] ?? 0);

      return total + value;
    }, 0);
  }, [chartData, valueKey]);

  const activeSubtitle = selectedOption?.description ?? subtitle;
  const activeTotalLabel = selectedOption?.totalLabel ?? totalLabel;
  const getLabelValue = useCallback(
  (item: TData) => item[labelKey],
  [labelKey],
);

const getBarValue = useCallback(
  (item: TData) => Number(item[valueKey] ?? 0),
  [valueKey],
);

  return (
    <Card
      className={
        className ??
        "overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
      }
    >
      <CardContent className="p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {title}
            </h2>

            {activeSubtitle ? (
              <p className="mt-1 text-sm text-muted-foreground">
                {activeSubtitle}
              </p>
            ) : null}
          </div>

          <div className="flex items-center gap-3">
            {hasRanges && ranges && ranges.length > 1 ? (
              <Tabs value={selectedRange} onValueChange={setSelectedRange}>
                <TabsList className="h-9 rounded-xl bg-muted p-1">
                  {ranges.map((range) => (
                    <TabsTrigger
                      key={range.value}
                      value={range.value}
                      className="h-7 rounded-lg px-3 text-xs font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      {range.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            ) : null}

            {showMenu ? (
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <MoreVertical className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        {showTotal ? (
          <div className="mb-3">
            <p className="text-xs font-medium text-muted-foreground">
              {activeTotalLabel}
            </p>

            <p className="mt-1 text-2xl font-bold text-foreground">
              {formatValue(totalValue)}
            </p>
          </div>
        ) : null}

        <div className="w-full" style={{ height }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 12,
                right: 8,
                left: -20,
                bottom: 0,
              }}
              barCategoryGap={chartData.length > 8 ? 24 : 36}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeOpacity={0.75}
              />

              <XAxis
                dataKey={getLabelValue}
                axisLine={false}
                tickLine={false}
                tickMargin={12}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />

              <Tooltip
                cursor={{
                  fill: "color-mix(in srgb, var(--muted) 55%, transparent)",
                }}
                content={
                  <ChartTooltip
                    valueLabel={valueLabel}
                    formatValue={formatValue}
                  />
                }
              />

              <Bar
                dataKey={getBarValue}
                name={valueLabel}
                fill="var(--primary)"
                radius={[8, 8, 2, 2]}
                maxBarSize={maxBarSize}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}