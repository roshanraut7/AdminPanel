"use client";

import { useMemo, useState } from "react";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import { CalendarDays } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

type RangeType = "monthly" | "quarterly" | "yearly";

type ChartPoint = {
  label: string;
  users: number;
  communities: number;
};

const monthlyData: ChartPoint[] = [
  { label: "Jan", users: 180, communities: 40 },
  { label: "Feb", users: 190, communities: 30 },
  { label: "Mar", users: 172, communities: 50 },
  { label: "Apr", users: 160, communities: 40 },
  { label: "May", users: 176, communities: 55 },
  { label: "Jun", users: 165, communities: 40 },
  { label: "Jul", users: 170, communities: 70 },
  { label: "Aug", users: 205, communities: 100 },
  { label: "Sep", users: 230, communities: 110 },
  { label: "Oct", users: 210, communities: 120 },
  { label: "Nov", users: 240, communities: 150 },
  { label: "Dec", users: 235, communities: 140 },
];

const quarterlyData: ChartPoint[] = [
  { label: "Q1", users: 542, communities: 120 },
  { label: "Q2", users: 501, communities: 135 },
  { label: "Q3", users: 605, communities: 280 },
  { label: "Q4", users: 685, communities: 410 },
];

const yearlyData: ChartPoint[] = [
  { label: "2023", users: 1180, communities: 320 },
  { label: "2024", users: 1540, communities: 510 },
  { label: "2025", users: 1890, communities: 760 },
  { label: "2026", users: 2333, communities: 945 },
];

type ChartTooltipProps = {
  active?: boolean;
  label?: string;
  payload?: Array<{
    name: string;
    value: number;
    color?: string;
  }>;
};

function ChartTooltip({ active, label, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3 shadow-xl">
      <p className="mb-3 text-xs font-semibold text-foreground">
        {label}
      </p>

      <div className="space-y-2">
        {payload.map((item) => {
          const labelText =
            item.name === "users" ? "Users" : "Communities";

          return (
            <div
              key={item.name}
              className="flex min-w-[170px] items-center justify-between gap-4 text-xs"
            >
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2.5 rounded-full"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
                {labelText}
              </span>

              <span className="font-semibold text-foreground">
                {item.value}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function formatDateRange(dateRange: DateRange | undefined) {
  if (!dateRange?.from) {
    return "Select date";
  }

  if (!dateRange.to) {
    return format(dateRange.from, "MMM dd, yyyy");
  }

  return `${format(dateRange.from, "MMM dd")} to ${format(
    dateRange.to,
    "MMM dd"
  )}`;
}

export function GrowthAreaChart() {
  const [range, setRange] = useState<RangeType>("monthly");

 const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
  const today = new Date();

  return {
    from: today,
    to: new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 6
    ),
  };
});

  const chartData = useMemo(() => {
    if (range === "quarterly") {
      return quarterlyData;
    }

    if (range === "yearly") {
      return yearlyData;
    }

    return monthlyData;
  }, [range]);

  return (
    <Card className="overflow-hidden rounded-3xl border border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-col gap-5 border-b border-border p-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <CardTitle className="text-xl font-bold tracking-[-0.04em] text-foreground sm:text-2xl">
            Statistics
          </CardTitle>

          <CardDescription className="mt-1 text-sm text-muted-foreground">
            Platform growth overview across the selected period.
          </CardDescription>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Tabs
            value={range}
            onValueChange={(value) => setRange(value as RangeType)}
            className="w-full sm:w-auto"
          >
            <TabsList className="h-11 rounded-xl bg-muted p-1">
              <TabsTrigger
                value="monthly"
                className="h-9 rounded-lg px-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Monthly
              </TabsTrigger>

              <TabsTrigger
                value="quarterly"
                className="h-9 rounded-lg px-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Quarterly
              </TabsTrigger>

              <TabsTrigger
                value="yearly"
                className="h-9 rounded-lg px-4 text-sm font-semibold text-muted-foreground data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
              >
                Yearly
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "h-11 min-w-[180px] justify-start rounded-xl border-border bg-card px-4 text-left font-semibold text-foreground shadow-none hover:bg-muted",
                  !dateRange?.from && "text-muted-foreground"
                )}
              >
                <CalendarDays className="mr-2 size-4 text-muted-foreground" />
                {formatDateRange(dateRange)}
              </Button>
            </PopoverTrigger>

            <PopoverContent
              align="end"
              className="w-auto rounded-2xl border-border bg-card p-0 shadow-xl"
            >
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={(range) => setDateRange(range)}
                numberOfMonths={1}
                className="rounded-2xl"
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="h-[370px] w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 8,
                right: 8,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient
                  id="usersFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--primary)"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--primary)"
                    stopOpacity={0.04}
                  />
                </linearGradient>

                <linearGradient
                  id="communitiesFill"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--ring)"
                    stopOpacity={0.24}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--ring)"
                    stopOpacity={0.04}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="0"
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
                tickMargin={12}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                  fontWeight: 500,
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1,
                  strokeDasharray: "4 4",
                }}
                content={<ChartTooltip />}
              />

              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--primary)"
                strokeWidth={2.8}
                fill="url(#usersFill)"
                activeDot={{
                  r: 6,
                  fill: "var(--primary)",
                  stroke: "var(--card)",
                  strokeWidth: 2,
                }}
              />

              <Area
                type="monotone"
                dataKey="communities"
                stroke="var(--ring)"
                strokeWidth={2.8}
                fill="url(#communitiesFill)"
                activeDot={{
                  r: 6,
                  fill: "var(--ring)",
                  stroke: "var(--card)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}