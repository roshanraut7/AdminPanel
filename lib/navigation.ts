import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ClipboardList,
  EarthIcon,
  FileCheck2,
  KeyRound,
  LayoutDashboard,
  MessageSquareText,
  Newspaper,
  Settings,
  User,
  UserCog,
  UsersRound,
} from "lucide-react";

export const adminRoutes = {
  dashboard: "/admin",

  community: "/admin/community",
  communityRequests: "/admin/community/requests",

  posts: "/admin/posts",
  users: "/admin/users",
  notifications: "/admin/notifications",
  category: "/admin/category",
  moderator: "/admin/moderator",

  documentVerification: "/admin/account/document-verification",

  settingsChangePassword: "/admin/settings/change-password",
} as const;

export type AdminRoute = (typeof adminRoutes)[keyof typeof adminRoutes];

export type AdminNavigationChildItem = {
  title: string;
  href: AdminRoute;
  icon: LucideIcon;
};

export type AdminNavigationLinkItem = {
  type: "link";
  title: string;
  href: AdminRoute;
  icon: LucideIcon;
  badge?: string;
};

export type AdminNavigationGroupItem = {
  type: "group";
  title: string;
  icon: LucideIcon;
  children: AdminNavigationChildItem[];
};

export type AdminNavigationItem =
  | AdminNavigationLinkItem
  | AdminNavigationGroupItem;

export const adminNavigationItems: AdminNavigationItem[] = [
  {
    type: "link",
    title: "Dashboard",
    href: adminRoutes.dashboard,
    icon: LayoutDashboard,
  },
  {
    type: "link",
    title: "Moderator",
    href: adminRoutes.moderator,
    icon: UserCog,
  },
  {
    type: "link",
    title: "Category",
    href: adminRoutes.category,
    icon: MessageSquareText,
  },

  {
    type: "group",
    title: "Community",
    icon: EarthIcon,
    children: [
      {
        title: "Communities",
        href: adminRoutes.community,
        icon: EarthIcon,
      },
      {
        title: "Community Requests",
        href: adminRoutes.communityRequests,
        icon: ClipboardList,
      },
    ],
  },

  {
    type: "link",
    title: "Post",
    href: adminRoutes.posts,
    icon: Newspaper,
  },
  {
    type: "link",
    title: "User",
    href: adminRoutes.users,
    icon: UsersRound,
  },
  {
    type: "link",
    title: "Notification",
    href: adminRoutes.notifications,
    icon: Bell,
    badge: "8",
  },

  {
    type: "group",
    title: "Settings",
    icon: Settings,
    children: [
      {
        title: "Change Password",
        href: adminRoutes.settingsChangePassword,
        icon: KeyRound,
      },
    ],
  },

  {
    type: "group",
    title: "Account",
    icon: User,
    children: [
      {
        title: "Document Verification",
        href: adminRoutes.documentVerification,
        icon: FileCheck2,
      },
    ],
  },
];

export function isAdminNavItemActive(pathname: string, href: string) {
  if (href === adminRoutes.dashboard) {
    return pathname === adminRoutes.dashboard;
  }

  /*
   * Do not highlight "Communities" when the user
   * is currently on the Community Requests page.
   */
  if (
    href === adminRoutes.community &&
    pathname.startsWith(adminRoutes.communityRequests)
  ) {
    return false;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getAdminPageTitle(pathname: string) {
  for (const item of adminNavigationItems) {
    if (item.type === "group") {
      const activeChild = item.children.find((child) =>
        isAdminNavItemActive(pathname, child.href),
      );

      if (activeChild) {
        return activeChild.title;
      }

      continue;
    }

    if (isAdminNavItemActive(pathname, item.href)) {
      return item.title;
    }
  }

  return "Dashboard";
}