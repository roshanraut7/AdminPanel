"use client";

import { useMemo } from "react";
import {
  Bell,
  CalendarClock,
  Flag,
  Plus,
  Send,
  UsersRound,
} from "lucide-react";

import { StatCard } from "@/components/common/stats-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

type NotificationType = "COMMUNITY" | "REPORT";
type NotificationStatus = "SENT" | "SCHEDULED" | "DRAFT";

type AdminNotification = {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  target: string;
  createdAt: string;
  scheduledAt?: string;
};

const mockNotifications: AdminNotification[] = [
  {
    id: "noti-1",
    title: "Community guideline updated",
    message:
      "New community posting rules have been updated for all community members.",
    type: "COMMUNITY",
    status: "SENT",
    target: "All community members",
    createdAt: "2026-06-15T08:30:00.000Z",
  },
  {
    id: "noti-2",
    title: "New report assigned",
    message:
      "A new reported post needs to be reviewed by the moderation team.",
    type: "REPORT",
    status: "SENT",
    target: "Moderators",
    createdAt: "2026-06-15T09:45:00.000Z",
  },
  {
    id: "noti-3",
    title: "Weekend community announcement",
    message:
      "Scheduled announcement for community activity and member engagement.",
    type: "COMMUNITY",
    status: "SCHEDULED",
    target: "Kathmandu Community",
    createdAt: "2026-06-14T12:20:00.000Z",
    scheduledAt: "2026-06-16T10:00:00.000Z",
  },
  {
    id: "noti-4",
    title: "Pending report reminder",
    message:
      "Reminder to check pending report cases before the end of the day.",
    type: "REPORT",
    status: "SCHEDULED",
    target: "Report moderators",
    createdAt: "2026-06-13T15:10:00.000Z",
    scheduledAt: "2026-06-15T18:00:00.000Z",
  },
];

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status: NotificationStatus) {
  if (status === "SENT") {
    return "border-transparent bg-emerald-50 text-emerald-700";
  }

  if (status === "SCHEDULED") {
    return "border-transparent bg-blue-50 text-blue-700";
  }

  return "border-border bg-muted text-muted-foreground";
}

function getTypeClass(type: NotificationType) {
  if (type === "COMMUNITY") {
    return "border-transparent bg-primary/10 text-primary";
  }

  return "border-transparent bg-amber-50 text-amber-700";
}

export default function NotificationsPage() {
  const stats = useMemo(() => {
    const sent = mockNotifications.filter(
      (item) => item.status === "SENT",
    ).length;

    const scheduled = mockNotifications.filter(
      (item) => item.status === "SCHEDULED",
    ).length;

    return {
      total: mockNotifications.length,
      sent,
      scheduled,
    };
  }, []);

  const communityNotifications = mockNotifications.filter(
    (notification) => notification.type === "COMMUNITY",
  );

  const reportNotifications = mockNotifications.filter(
    (notification) => notification.type === "REPORT",
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Badge
            variant="outline"
            className="border-primary/20 bg-primary/10 text-primary"
          >
            Notification Center
          </Badge>

          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Notifications
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage community alerts, report updates, and scheduled messages for
            users and moderators.
          </p>
        </div>

        <Button type="button" className="w-full sm:w-auto">
          <Plus className="mr-2 size-4" />
          Create notification
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total notifications"
          value={String(stats.total)}
          change="+4"
          helper="All notification records"
          icon={Bell}
          tone="info"
        />

        <StatCard
          title="Sent notifications"
          value={String(stats.sent)}
          change="+2"
          helper="Delivered to selected users"
          icon={Send}
          tone="success"
        />

        <StatCard
          title="Scheduled"
          value={String(stats.scheduled)}
          change="+2"
          helper="Waiting to be sent"
          icon={CalendarClock}
          tone="warning"
        />
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList variant="line">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-0">
          <NotificationGrid notifications={mockNotifications} />
        </TabsContent>

        <TabsContent value="community" className="mt-0">
          <NotificationGrid notifications={communityNotifications} />
        </TabsContent>

        <TabsContent value="reports" className="mt-0">
          <NotificationGrid notifications={reportNotifications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function NotificationGrid({
  notifications,
}: {
  notifications: AdminNotification[];
}) {
  if (notifications.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center">
        <p className="text-sm font-medium text-foreground">
          No notifications found.
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a notification to show it here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
        />
      ))}
    </div>
  );
}

function NotificationCard({
  notification,
}: {
  notification: AdminNotification;
}) {
  const Icon = notification.type === "COMMUNITY" ? UsersRound : Flag;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm transition-colors hover:bg-accent/30">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                {notification.title}
              </h3>

              <Badge
                variant="outline"
                className={getTypeClass(notification.type)}
              >
                {notification.type}
              </Badge>
            </div>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
              {notification.message}
            </p>
          </div>
        </div>

        <Badge
          variant="outline"
          className={getStatusClass(notification.status)}
        >
          {notification.status}
        </Badge>
      </div>

      <div className="mt-5 grid gap-3 rounded-xl border border-border bg-muted/30 p-4 text-sm sm:grid-cols-3">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Target</p>
          <p className="mt-1 line-clamp-1 font-semibold text-foreground">
            {notification.target}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">Created</p>
          <p className="mt-1 font-semibold text-foreground">
            {formatDate(notification.createdAt)}
          </p>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Schedule
          </p>
          <p className="mt-1 font-semibold text-foreground">
            {notification.scheduledAt
              ? formatDate(notification.scheduledAt)
              : "Not scheduled"}
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <Button type="button" variant="outline" size="sm">
          View details
        </Button>

        <Button type="button" variant="ghost" size="sm">
          Duplicate
        </Button>
      </div>
    </div>
  );
}