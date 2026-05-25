import Link from "next/link";
import { ArrowRight, FileBarChart2 } from "lucide-react";

import { StatCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  dashboardStats,
  dashboardTrend,
  growthSummary,
  latestActivities,
  quickActions,
  reportProgress,
} from "@/lib/mocks/dashboard.mock";

export default function AdminDashboardPage() {
  const TrendIcon = dashboardTrend.icon;

  return (
    <div className="space-y-5">
      <Card className="rounded-xl border-border bg-card text-card-foreground shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <Badge className="rounded-md bg-primary/10 text-primary hover:bg-primary/10">
                Admin overview
              </Badge>

              <h1 className="mt-4 text-2xl font-bold tracking-[-0.04em] text-foreground sm:text-3xl">
                Welcome back, Nikhil
              </h1>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Manage communities, posts, users, and notifications from one
                clean admin dashboard.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="h-10 rounded-lg border-border bg-background font-semibold hover:bg-muted"
              >
                View analytics
              </Button>

              <Button className="h-10 rounded-lg bg-primary font-semibold text-primary-foreground hover:bg-primary/90">
                <FileBarChart2 className="mr-2 h-4 w-4" />
                Create report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="rounded-xl border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0 p-5">
            <div>
              <CardTitle className="text-base font-bold tracking-[-0.03em]">
                Latest activity
              </CardTitle>
              <CardDescription>
                Recent community, post, and user actions.
              </CardDescription>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="rounded-lg border-border bg-background hover:bg-muted"
            >
              View all
            </Button>
          </CardHeader>

          <CardContent className="space-y-3 p-5 pt-0">
            {latestActivities.map((activity) => {
              const ActivityIcon = activity.icon;

              return (
                <div
                  key={activity.title}
                  className="flex items-start gap-3 rounded-lg border border-border bg-background p-4"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                    <ActivityIcon className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {activity.title}
                        </p>

                        <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                          {activity.description}
                        </p>
                      </div>

                      <Badge className="rounded-md bg-primary/10 text-primary hover:bg-primary/10">
                        {activity.tag}
                      </Badge>
                    </div>

                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-bold tracking-[-0.03em]">
              Quick actions
            </CardTitle>
            <CardDescription>Common admin actions.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 p-5 pt-0">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;

              return (
                <Button
                  key={action.label}
                  asChild
                  variant="outline"
                  className="h-auto w-full justify-start rounded-lg border-border bg-background p-4 text-left hover:bg-muted"
                >
                  <Link href={action.href}>
                    <ActionIcon className="mr-3 h-4 w-4 shrink-0 text-muted-foreground" />

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold text-foreground">
                        {action.label}
                      </span>
                      <span className="mt-0.5 block truncate text-xs font-normal text-muted-foreground">
                        {action.description}
                      </span>
                    </span>

                    <ArrowRight className="ml-3 h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                </Button>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.9fr_1.4fr]">
        <Card className="rounded-xl border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="text-base font-bold tracking-[-0.03em]">
                  {dashboardTrend.title}
                </CardTitle>
                <CardDescription>{dashboardTrend.description}</CardDescription>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-primary">
                <TrendIcon className="h-5 w-5" />
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-5 pt-0">
            <p className="text-3xl font-bold tracking-[-0.04em]">
              {dashboardTrend.value}
            </p>

            <div className="mt-5 h-2 rounded-full bg-muted">
              <div className="h-2 w-[78%] rounded-full bg-primary" />
            </div>

            <p className="mt-3 text-xs font-medium text-muted-foreground">
              Growth score based on communities, posts, users, and moderation
              activity.
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-xl border-border bg-card text-card-foreground shadow-sm">
          <CardHeader className="p-5">
            <CardTitle className="text-base font-bold tracking-[-0.03em]">
              Admin report status
            </CardTitle>
            <CardDescription>
              Current moderation and platform summary.
            </CardDescription>
          </CardHeader>

          <CardContent className="grid gap-5 p-5 pt-0 lg:grid-cols-2">
            <div className="space-y-4">
              {reportProgress.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      {item.label}
                    </span>
                    <span className="font-semibold text-muted-foreground">
                      {item.value}
                    </span>
                  </div>

                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: item.value }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-3">
              {growthSummary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-bold tracking-[-0.03em]">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}