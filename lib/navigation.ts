
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  EarthIcon,
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  UserCog,
  UsersRound,
} from "lucide-react";

export const adminRoutes = {
  dashboard: "/admin",
  community: "/admin/community",
  posts: "/admin/posts",
  users: "/admin/users",
  notifications: "/admin/notifications",
  category:"/admin/category",
  moderator:"/admin/moderator"
} as const;

export type AdminRoute = (typeof adminRoutes)[keyof typeof adminRoutes];

export type AdminNavigationItem = {
  title: string;
  href: AdminRoute;
  icon: LucideIcon;
  badge?: string;
};

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    title: "Dashboard",
    href: adminRoutes.dashboard,
    icon: LayoutDashboard,
  },
  {
     title: "Moderator",
    href: adminRoutes.moderator,
    icon: UserCog,
  },
  {
      title: "Category",
    href: adminRoutes.category,
    icon: MessageSquareText,
  },
  {
    title: "Community",
    href: adminRoutes.community,
    icon: EarthIcon,
  },
  {
    title: "Post",
    href: adminRoutes.posts,
    icon: Newspaper,
  },
  {
    title: "User",
    href: adminRoutes.users,
    icon: UsersRound,
  },
  {
    title: "Notification",
    href: adminRoutes.notifications,
    icon: Bell,
    badge: "8",
  },
];

export function isAdminNavItemActive(pathname: string, href: string) {
  if (href === adminRoutes.dashboard) {
    return pathname === adminRoutes.dashboard;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminPageTitle(pathname: string) {
  const activeItem = adminNavigationItems.find((item) =>
    isAdminNavItemActive(pathname, item.href)
  );

  return activeItem?.title ?? "Dashboard";
}