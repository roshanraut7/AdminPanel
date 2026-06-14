"use client";

import { useMemo, useState } from "react";
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
import {
  monthlyUserChartData,
  yearlyUserChartData,
  type UserBarChartItem,
} from "@/mocks/user-mock";

type ChartRange = "monthly" | "yearly";

type TooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{
    value: number;
  }>;
};

function ChartTooltip({ active, label, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs font-semibold text-foreground">{label}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        Users:{" "}
        <span className="font-semibold text-foreground">
          {payload[0]?.value}
        </span>
      </p>
    </div>
  );
}

export function UserGrowthChartCard() {
  const [range, setRange] = useState<ChartRange>("monthly");

  const chartData: UserBarChartItem[] = useMemo(() => {
    return range === "monthly" ? monthlyUserChartData : yearlyUserChartData;
  }, [range]);

  const totalUsers = useMemo(() => {
    return chartData.reduce((total, item) => total + item.users, 0);
  }, [chartData]);

  return (
    <Card className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <CardContent className="p-5">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              User registrations
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {range === "monthly"
                ? "Monthly user growth overview"
                : "Yearly user growth overview"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Tabs
              value={range}
              onValueChange={(value) => setRange(value as ChartRange)}
            >
              <TabsList className="h-9 rounded-xl bg-muted p-1">
                <TabsTrigger
                  value="monthly"
                  className="h-7 rounded-lg px-3 text-xs font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Monthly
                </TabsTrigger>

                <TabsTrigger
                  value="yearly"
                  className="h-7 rounded-lg px-3 text-xs font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                >
                  Yearly
                </TabsTrigger>
              </TabsList>
            </Tabs>

            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <MoreVertical className="size-4" />
            </button>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-xs font-medium text-muted-foreground">
            Total {range === "monthly" ? "this year" : "all years"}
          </p>

          <p className="mt-1 text-2xl font-bold text-foreground">
            {totalUsers.toLocaleString()}
          </p>
        </div>

        <div className="h-[230px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 12,
                right: 8,
                left: -20,
                bottom: 0,
              }}
              barCategoryGap={range === "monthly" ? 24 : 36}
            >
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeOpacity={0.75}
              />

              <XAxis
                dataKey="label"
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
                content={<ChartTooltip />}
              />

              <Bar
                dataKey="users"
                name="Users"
                fill="var(--primary)"
                radius={[8, 8, 2, 2]}
                maxBarSize={42}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}