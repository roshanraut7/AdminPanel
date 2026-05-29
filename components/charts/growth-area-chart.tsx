"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const growthData = [
  {
    month: "Jan",
    users: 8,
    communities: 5,
  },
  {
    month: "Feb",
    users: 12,
    communities: 7,
  },
  {
    month: "Mar",
    users: 16,
    communities: 10,
  },
  {
    month: "Apr",
    users: 14,
    communities: 9,
  },
  {
    month: "May",
    users: 21,
    communities: 13,
  },
  {
    month: "Jun",
    users: 25,
    communities: 16,
  },
];

export function GrowthAreaChart() {
  return (
    <Card className="rounded-xl border-border bg-card text-card-foreground shadow-sm">
      <CardHeader className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <CardTitle className="text-base font-bold tracking-[-0.03em]">
            User & Community Growth
          </CardTitle>

          <CardDescription>
            Monthly growth percentage of users and communities.
          </CardDescription>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium">
          <span className="rounded-md bg-chart-1/10 px-2.5 py-1 text-chart-1">
            Users
          </span>

          <span className="rounded-md bg-chart-3/15 px-2.5 py-1 text-chart-3">
            Communities
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-5 pt-0">
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={growthData}
              margin={{
                top: 10,
                right: 10,
                left: -20,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="usersGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0.22}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-1)"
                    stopOpacity={0}
                  />
                </linearGradient>

                <linearGradient
                  id="communitiesGradient"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--chart-3)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />

              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tickMargin={10}
                tickFormatter={(value) => `${value}%`}
                tick={{
                  fill: "var(--muted-foreground)",
                  fontSize: 12,
                }}
              />

              <Tooltip
                cursor={{
                  stroke: "var(--border)",
                  strokeWidth: 1,
                }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  background: "var(--card)",
                  color: "var(--card-foreground)",
                  boxShadow: "0 10px 30px color-mix(in srgb, var(--foreground) 8%, transparent)",
                }}
                labelStyle={{
                  color: "var(--foreground)",
                  fontWeight: 600,
                }}
                itemStyle={{
                  color: "var(--foreground)",
                }}
                formatter={(value, name) => {
                  const safeValue = Array.isArray(value)
                    ? value.join(" - ")
                    : value ?? 0;

                  const label = name === "users" ? "Users" : "Communities";

                  return [`${safeValue}%`, label];
                }}
              />

              <Area
                type="monotone"
                dataKey="users"
                stroke="var(--chart-1)"
                strokeWidth={2.5}
                fill="url(#usersGradient)"
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "var(--card)",
                  fill: "var(--chart-1)",
                }}
              />

              <Area
                type="monotone"
                dataKey="communities"
                stroke="var(--chart-3)"
                strokeWidth={2.5}
                fill="url(#communitiesGradient)"
                activeDot={{
                  r: 5,
                  strokeWidth: 2,
                  stroke: "var(--card)",
                  fill: "var(--chart-3)",
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}