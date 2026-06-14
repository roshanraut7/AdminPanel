"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  LoaderCircle,
  MoreVertical,
  ShieldAlert,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { GrowthAreaChart } from "@/components/charts/growth-area-chart";
import { NepalDistrictMap } from "@/components/maps/nepal-district-map";
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
import { dashboardStats } from "@/lib/mocks/dashboard.mock";

type AppRole = "USER" | "ADMIN" | "SUPER_ADMIN";

const LOGIN_ROUTE = "/";


const recentActivities = [
  {
    title: "New community created",
    subtitle: "Baitadi Community launched successfully",
    type: "Community",
    time: "2 min ago",
    status: "Live",
    tone: "success",
  },
  {
    title: "Member joined district community",
    subtitle: "A new user joined Kailali District",
    type: "Membership",
    time: "8 min ago",
    status: "Active",
    tone: "success",
  },
  {
    title: "Post reported by members",
    subtitle: "One post needs moderation review",
    type: "Report",
    time: "18 min ago",
    status: "Pending",
    tone: "warning",
  },
  {
    title: "Official post published",
    subtitle: "Admin posted an announcement in Bagmati",
    type: "Post",
    time: "42 min ago",
    status: "Published",
    tone: "info",
  },
  {
    title: "User account flagged",
    subtitle: "Suspicious activity detected in a profile",
    type: "Security",
    time: "1 hr ago",
    status: "Review",
    tone: "danger",
  },
];

function statusClasses(tone: string) {
  if (tone === "success") {
    return "bg-primary/10 text-primary";
  }

  if (tone === "warning") {
    return "bg-chart-3/15 text-chart-3";
  }

  if (tone === "danger") {
    return "bg-destructive/10 text-destructive";
  }

  return "bg-chart-2/10 text-chart-2";
}

function CustomerDemographicCard() {
  return (
    <Card className="rounded-3xl border border-border bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
        <div>
          <CardTitle className="text-2xl font-bold tracking-[-0.04em] text-foreground">
            User Demographic 
          </CardTitle>

          <CardDescription className="mt-1 text-sm text-muted-foreground">
            District-wise followers across Nepal.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        <NepalDistrictMap />
      </CardContent>
    </Card>
  );
}

function RecentActivityCard() {
  return (
    <Card className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4 p-6">
        <div>
          <CardTitle className="text-2xl font-bold tracking-[-0.04em] text-foreground">
            Recent Activity
          </CardTitle>

          <CardDescription className="mt-1 text-sm text-muted-foreground">
            Latest platform updates and moderation actions.
          </CardDescription>
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl border-border bg-background px-4 text-sm font-semibold"
        >
          View all activity
        </Button>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-0">
        <div className="space-y-3">
          {recentActivities.map((item) => (
            <div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-muted/20 hover:shadow-md"
            >
              <div className="flex items-start gap-4">
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ${
                    item.tone === "success"
                      ? "bg-primary/10 text-primary"
                      : item.tone === "warning"
                        ? "bg-chart-3/15 text-chart-3"
                        : item.tone === "danger"
                          ? "bg-destructive/10 text-destructive"
                          : "bg-chart-2/10 text-chart-2"
                  }`}
                >
                  {item.type.charAt(0)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                      {item.type}
                    </span>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(
                        item.tone
                      )}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-foreground">
                    {item.title}
                  </h3>

                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">
                    {item.subtitle}
                  </p>
                </div>

                <div className="shrink-0">
                  <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                    {item.time}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const hasHandledUnauthorizedUser = useRef(false);

  const { data: session, isPending } = authClient.useSession();

  const userRole = session?.user.role as AppRole | undefined;

  const hasAdminAccess =
    userRole === "ADMIN" || userRole === "SUPER_ADMIN";

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (!session?.user) {
      router.replace(LOGIN_ROUTE);
      return;
    }

    if (!hasAdminAccess && !hasHandledUnauthorizedUser.current) {
      hasHandledUnauthorizedUser.current = true;

      const removeUnauthorizedSession = async () => {
        await authClient.signOut();

        toast.error(
          "You do not have permission to access the admin dashboard."
        );

        router.replace(LOGIN_ROUTE);
        router.refresh();
      };

      void removeUnauthorizedSession();
    }
  }, [hasAdminAccess, isPending, router, session?.user]);

  if (isPending) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <LoaderCircle className="size-7 animate-spin text-primary" />

          <p className="text-sm font-medium">
            Checking admin session...
          </p>
        </div>
      </div>
    );
  }

  if (!session?.user || !hasAdminAccess) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
            <ShieldAlert className="size-6" />
          </div>

          <p className="text-sm font-medium text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  const adminDisplayName =
    session.user.name ||
    `${session.user.firstName ?? ""} ${session.user.lastName ?? ""}`.trim() ||
    "Admin";

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary hover:bg-primary/10">
            Admin Dashboard
          </Badge>

          <Badge
            variant="outline"
            className="rounded-full border-border bg-card px-3 py-1 text-muted-foreground"
          >
            {userRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
          </Badge>
        </div>

        <h1 className="mt-3 text-2xl font-bold tracking-[-0.05em] text-foreground sm:text-3xl">
          Platform Overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Signed in as{" "}
          <span className="font-semibold text-foreground">
            {adminDisplayName}
          </span>{" "}
          · {session.user.email}
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section>
        <GrowthAreaChart />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.25fr)]">
        <CustomerDemographicCard />

        <RecentActivityCard />
      </section>
    </div>
  );
}