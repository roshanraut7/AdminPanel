"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  Bell,
  ChevronRight,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { ModeToggle } from "@/components/theme/mode-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
  adminNavigationItems,
  getAdminPageTitle,
  isAdminNavItemActive,
} from "@/lib/navigation";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  children: ReactNode;
};

export default function AdminDashboard({ children }: DashboardShellProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>([]);
   const [isSigningOut, setIsSigningOut] = useState(false);
  

  const pageTitle = useMemo(() => getAdminPageTitle(pathname), [pathname]);

  const sidebarWidthClass = collapsed ? "lg:w-[88px]" : "lg:w-[270px]";
  const contentOffsetClass = collapsed ? "lg:pl-[88px]" : "lg:pl-[270px]";

  useEffect(() => {
    const activeGroup = adminNavigationItems.find(
      (item) =>
        item.type === "group" &&
        item.children.some((child) =>
          isAdminNavItemActive(pathname, child.href)
        )
    );

    if (!activeGroup) {
      return;
    }

    setExpandedMenus((current) =>
      current.includes(activeGroup.title)
        ? current
        : [...current, activeGroup.title]
    );
  }, [pathname]);

  const handleMenuToggle = (menuTitle: string) => {
    if (collapsed) {
      setCollapsed(false);

      setExpandedMenus((current) =>
        current.includes(menuTitle)
          ? current
          : [...current, menuTitle]
      );

      return;
    }

    setExpandedMenus((current) =>
      current.includes(menuTitle)
        ? current.filter((title) => title !== menuTitle)
        : [...current, menuTitle]
    );
  };

 const handleSignOut = async () => {
    try {
      setIsSigningOut(true);

      const { error } = await authClient.signOut();

      if (error) {
        toast.error(error.message || "Unable to log out.");
        return;
      }

      toast.success("Logged out successfully.");

      router.replace("/");
      router.refresh();
    } catch {
      toast.error("Unable to log out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile sidebar overlay */}
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-black/30 backdrop-blur-sm lg:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-67.5 border-r border-border bg-card text-card-foreground shadow-sm transition-all duration-300",
          sidebarWidthClass,
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Brand */}
          <div className="flex h-16 items-center justify-between px-4">
            <Link href="/admin" className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 text-sm font-bold text-primary">
                P
              </div>

              <div className={cn("min-w-0", collapsed && "lg:hidden")}>
                <h1 className="truncate text-sm font-bold tracking-[-0.03em] text-foreground">
                  PasalGuff
                </h1>

                <p className="truncate text-xs font-medium text-muted-foreground">
                  Admin Dashboard
                </p>
              </div>
            </Link>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(false)}
              className="h-9 w-9 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
            {adminNavigationItems.map((item) => {
              const Icon = item.icon;

              /*
               * Normal navigation item:
               * Dashboard, Moderator, Category, Community, Post, User,
               * Notification.
               */
              if (item.type === "link") {
                const isActive = isAdminNavItemActive(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "group flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "lg:justify-center lg:px-0"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />

                    <span className={cn("truncate", collapsed && "lg:hidden")}>
                      {item.title}
                    </span>

                    {item.badge ? (
                      <Badge
                        className={cn(
                          "ml-auto h-5 rounded-md bg-primary/10 px-2 text-[11px] font-semibold text-primary hover:bg-primary/10",
                          collapsed && "lg:hidden"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    ) : null}
                  </Link>
                );
              }

              /*
               * Dropdown navigation group:
               * Account -> Document Verification
               */
              const isExpanded = expandedMenus.includes(item.title);

              const hasActiveChild = item.children.some((child) =>
                isAdminNavItemActive(pathname, child.href)
              );

              return (
                <div key={item.title} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => handleMenuToggle(item.title)}
                    aria-expanded={isExpanded}
                    className={cn(
                      "group flex h-11 w-full items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                      hasActiveChild
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      collapsed && "lg:justify-center lg:px-0"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />

                    <span className={cn("truncate", collapsed && "lg:hidden")}>
                      {item.title}
                    </span>

                    <ChevronRight
                      className={cn(
                        "ml-auto h-4 w-4 shrink-0 transition-transform duration-200",
                        isExpanded && "rotate-90",
                        collapsed && "lg:hidden"
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "grid overflow-hidden transition-[grid-template-rows] duration-200",
                      isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                      collapsed && "lg:grid-rows-[0fr]"
                    )}
                  >
                    <div className="min-h-0">
                      <div
                        className={cn(
                          "ml-5 space-y-1 border-l border-border/80 pb-1 pl-3",
                          collapsed && "lg:hidden"
                        )}
                      >
                        {item.children.map((child) => {
                          const ChildIcon = child.icon;
                          const isChildActive = isAdminNavItemActive(
                            pathname,
                            child.href
                          );

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                                isChildActive
                                  ? "bg-primary/10 text-primary"
                                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                              )}
                            >
                              <ChildIcon className="h-4 w-4 shrink-0" />

                              <span className="truncate">{child.title}</span>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="px-3 pb-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleSignOut}
              className={cn(
                "h-11 w-full rounded-lg px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                collapsed && "lg:justify-center lg:px-0"
              )}
            >
              <LogOut className="h-4 w-4 shrink-0" />

              <span className={cn("ml-3", collapsed && "lg:hidden")}>
                Logout
              </span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main content area */}
      <div
        className={cn(
          "min-h-screen transition-all duration-300",
          contentOffsetClass
        )}
      >
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-border/80 bg-background/75 backdrop-blur-xl supports-backdrop-filter:bg-background/65">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setMobileOpen(true)}
              className="h-10 w-10 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setCollapsed((previous) => !previous)}
              className="hidden h-10 w-10 rounded-lg border-border bg-card shadow-none hover:bg-muted lg:inline-flex"
            >
              {collapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </Button>

            {/* Breadcrumb */}
            <div className="hidden min-w-0 flex-col sm:flex">
              <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Link href="/admin" className="hover:text-foreground">
                  Dashboard
                </Link>

                <ChevronRight className="h-3.5 w-3.5" />

                <span className="truncate text-foreground">{pageTitle}</span>
              </div>
            </div>

            {/* Search UI */}
            <div className="ml-0 hidden h-10 w-full max-w-105 items-center rounded-lg border border-border bg-card px-3 text-sm text-muted-foreground shadow-none md:flex lg:ml-4">
              <Search className="mr-2 h-4 w-4 shrink-0" />
              <span className="flex-1">Search...</span>
            </div>

            {/* Header actions */}
            <div className="ml-auto flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="relative h-10 w-10 rounded-lg border-border bg-card shadow-none hover:bg-muted"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
              </Button>

              <ModeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    className="h-10 rounded-lg px-1.5 hover:bg-muted"
                  >
                    <Avatar className="h-8 w-8 border border-border">
                      <AvatarFallback className="bg-primary/10 text-sm font-bold text-primary">
                        N
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-xl border-border bg-card p-2 text-card-foreground"
                >
                  <DropdownMenuLabel>
                    <p className="text-sm font-bold">Roshan</p>
                    <p className="text-xs font-medium text-muted-foreground">
                      Admin
                    </p>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer rounded-lg text-muted-foreground focus:bg-muted focus:text-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="px-4 py-5 sm:px-6">{children}</main>
      </div>
    </div>
  );
}