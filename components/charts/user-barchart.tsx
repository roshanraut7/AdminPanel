"use client";

import { ReusableBarChartCard } from "@/components/charts/reusable-bar-chart-card";
import {
  monthlyUserChartData,
  yearlyUserChartData,
  type UserBarChartItem,
} from "@/mocks/user-mock";

export function UserGrowthChartCard() {
  return (
    <ReusableBarChartCard<UserBarChartItem>
      title="User registrations"
      labelKey="label"
      valueKey="users"
      valueLabel="Users"
      ranges={[
        {
          label: "Monthly",
          value: "monthly",
          data: monthlyUserChartData,
          description: "Monthly user growth overview",
          totalLabel: "Total this year",
        },
        {
          label: "Yearly",
          value: "yearly",
          data: yearlyUserChartData,
          description: "Yearly user growth overview",
          totalLabel: "Total all years",
        },
      ]}
    />
  );
}