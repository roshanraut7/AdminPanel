import type { LucideIcon } from "lucide-react";
import {
  Bell,
  FileBarChart2,
  MessageSquareText,
  Newspaper,
  ShieldAlert,
  TrendingUp,
  UserCheck,
  UsersRound,
} from "lucide-react";

export type StatCardMock = {
  title: string;
  value: string;
  change: string;
  helper: string;
  icon: LucideIcon;
  tone: "success" | "warning" | "danger" | "neutral";
};

export const dashboardStats: StatCardMock[] = [
  {
    title: "Total Communities",
    value: "128",
    change: "+12.5%",
    helper: "Compared to last month",
    icon: MessageSquareText,
    tone: "success",
  },
  {
    title: "Total Posts",
    value: "2,430",
    change: "+18.2%",
    helper: "New post activity",
    icon: Newspaper,
    tone: "success",
  },
  {
    title: "Total Users",
    value: "8,294",
    change: "+9.4%",
    helper: "Active user growth",
    icon: UsersRound,
    tone: "success",
  },
  {
    title: "Notifications",
    value: "54",
    change: "+4.1%",
    helper: "Unread admin alerts",
    icon: Bell,
    tone: "neutral",
  },
];

export type ActivityMock = {
  title: string;
  description: string;
  time: string;
  tag: string;
  icon: LucideIcon;
};

export const latestActivities: ActivityMock[] = [
  {
    title: "New community created",
    description: "A new public community was created by a user.",
    time: "1 hour ago",
    tag: "Community",
    icon: MessageSquareText,
  },
  {
    title: "Post reported",
    description: "A post was reported and needs admin review.",
    time: "2 hours ago",
    tag: "Review",
    icon: ShieldAlert,
  },
  {
    title: "New user joined",
    description: "A new user completed account registration.",
    time: "3 hours ago",
    tag: "User",
    icon: UserCheck,
  },
];

export type QuickActionMock = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export const quickActions: QuickActionMock[] = [
  {
    label: "Manage community",
    description: "View, edit, and moderate communities.",
    href: "/admin/community",
    icon: MessageSquareText,
  },
  {
    label: "Review posts",
    description: "Check reported and recent posts.",
    href: "/admin/posts",
    icon: Newspaper,
  },
  {
    label: "Check users",
    description: "Manage users and account status.",
    href: "/admin/users",
    icon: UsersRound,
  },
  {
    label: "Create report",
    description: "Generate an admin overview report.",
    href: "/admin",
    icon: FileBarChart2,
  },
];

export const reportProgress = [
  {
    label: "Community health",
    value: "82%",
  },
  {
    label: "Post quality",
    value: "76%",
  },
  {
    label: "User activity",
    value: "91%",
  },
];

export const growthSummary = [
  {
    label: "Active communities",
    value: "96",
  },
  {
    label: "Pending reports",
    value: "12",
  },
  {
    label: "Resolved issues",
    value: "240",
  },
  {
    label: "Engagement rate",
    value: "68%",
  },
];

export const dashboardTrend = {
  title: "Platform growth",
  value: "+16.8%",
  description: "Overall admin performance this month",
  icon: TrendingUp,
};