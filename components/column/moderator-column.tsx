"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  CheckCircle2,
  BarChart3,  
  ChevronDown,
  MoreHorizontal,
  ShieldCheck,
  Trash2,
  UserCog,
  XCircle,
} from "lucide-react";

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

export type ModeratorStatus = "ACTIVE" | "PENDING" | "SUSPENDED";

export type ModeratorPermission = {
  canManageMembers: boolean;
  canManagePosts: boolean;
  canManageComments: boolean;
  canManageReports: boolean;
};

export type AdminModerator = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: "OWNER" | "MODERATOR";
  status: ModeratorStatus;
  permissions: ModeratorPermission;
  joinedAt: string;
  moderatedCommunities: number;
};

type CreateModeratorColumnsParams = {
  onViewAnalysis: (moderator: AdminModerator) => void;
  onEditPermission: (moderator: AdminModerator) => void;
  onSuspendModerator: (moderator: AdminModerator) => void;
  onRemoveModerator: (moderator: AdminModerator) => void;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusClass(status: ModeratorStatus) {
  if (status === "ACTIVE") {
    return "border-transparent bg-emerald-50 text-emerald-700";
  }

  if (status === "PENDING") {
    return "border-transparent bg-blue-50 text-blue-700";
  }

  return "border-transparent bg-amber-50 text-amber-700";
}

function getStatusDotClass(status: ModeratorStatus) {
  if (status === "ACTIVE") return "bg-emerald-600";
  if (status === "PENDING") return "bg-blue-600";
  return "bg-amber-600";
}

function getPermissionLabels(permissions: ModeratorPermission) {
  const labels: string[] = [];

  if (permissions.canManageMembers) labels.push("Members");
  if (permissions.canManagePosts) labels.push("Posts");
  if (permissions.canManageComments) labels.push("Comments");
  if (permissions.canManageReports) labels.push("Reports");

  return labels;
}

function PermissionDropdown({
  permissions,
}: {
  permissions: ModeratorPermission;
}) {
  const activePermissions = getPermissionLabels(permissions);

  const permissionItems = [
    {
      label: "Manage members",
      active: permissions.canManageMembers,
    },
    {
      label: "Manage posts",
      active: permissions.canManagePosts,
    },
    {
      label: "Manage comments",
      active: permissions.canManageComments,
    },
    {
      label: "Manage reports",
      active: permissions.canManageReports,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="h-9 min-w-[150px] justify-between border-border bg-card px-3 text-sm font-medium text-foreground shadow-none hover:bg-accent hover:text-accent-foreground"
        >
          <span>
            {activePermissions.length > 0
              ? `${activePermissions.length} allowed`
              : "No permission"}
          </span>

          <ChevronDown className="ml-2 size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-72 border-border bg-popover p-0 text-popover-foreground"
      >
        <DropdownMenuLabel className="px-3 py-3">
          <p className="text-sm font-semibold text-foreground">
            Moderator permissions
          </p>
          <p className="mt-0.5 text-xs font-normal text-muted-foreground">
            {activePermissions.length} of {permissionItems.length} permissions
            allowed
          </p>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <div className="space-y-1 p-2">
          {permissionItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-accent"
            >
              <span className="text-sm font-medium text-foreground">
                {item.label}
              </span>

              <Badge
                variant="outline"
                className={
                  item.active
                    ? "border-transparent bg-emerald-50 text-emerald-700"
                    : "border-border bg-muted text-muted-foreground"
                }
              >
                {item.active ? (
                  <CheckCircle2 className="mr-1 size-3.5" />
                ) : (
                  <XCircle className="mr-1 size-3.5" />
                )}

                {item.active ? "Allowed" : "Disabled"}
              </Badge>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function createModeratorColumns({
  onEditPermission,
  onSuspendModerator,
  onRemoveModerator,
  onViewAnalysis,
}: CreateModeratorColumnsParams): ColumnDef<AdminModerator>[] {
  return [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Moderator
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const moderator = row.original;

        return (
          <div className="flex min-w-[260px] items-center gap-3">
            {moderator.avatarUrl ? (
              <img
                src={moderator.avatarUrl}
                alt={moderator.fullName}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {getInitials(moderator.fullName)}
              </div>
            )}

            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">
                {moderator.fullName}
              </p>

              <p className="line-clamp-1 text-xs text-muted-foreground">
                {moderator.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.original.role;

        return (
          <Badge
            variant="outline"
            className={
              role === "OWNER"
                ? "border-transparent bg-purple-50 px-2.5 py-1 font-medium text-purple-700"
                : "border-transparent bg-primary/10 px-2.5 py-1 font-medium text-primary"
            }
          >
            <ShieldCheck className="mr-1.5 size-3.5" />
            {role === "OWNER" ? "Owner" : "Moderator"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "permissions",
      header: "Permissions",
      enableSorting: false,
      cell: ({ row }) => (
        <PermissionDropdown permissions={row.original.permissions} />
      ),
    },
    {
      accessorKey: "moderatedCommunities",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Communities
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">
          {row.original.moderatedCommunities}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Badge
            variant="outline"
            className={`gap-1.5 px-2.5 py-1 font-medium ${getStatusClass(
              status,
            )}`}
          >
            <span
              className={`size-1.5 rounded-full ${getStatusDotClass(status)}`}
            />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "joinedAt",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Joined
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.original.joinedAt)}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-right">Actions</div>,
      enableSorting: false,
      enableHiding: false,
      enableColumnFilter: false,
      cell: ({ row }) => {
        const moderator = row.original;
        const isOwner = moderator.role === "OWNER";
        const isSuspended = moderator.status === "SUSPENDED";

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="sr-only">Open moderator actions</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-52 border-border bg-popover text-popover-foreground"
              >
               <DropdownMenuLabel>Actions</DropdownMenuLabel>

<DropdownMenuItem
  onClick={() => onViewAnalysis(moderator)}
  className="text-blue-700 focus:bg-blue-50 focus:text-blue-700"
>
  <BarChart3 className="mr-2 size-4" />
  View analysis
</DropdownMenuItem>

<DropdownMenuItem
  onClick={() => onEditPermission(moderator)}
  className="text-primary focus:bg-primary/10 focus:text-primary"
>
  <UserCog className="mr-2 size-4" />
  Edit permission
</DropdownMenuItem>

<DropdownMenuSeparator />

<DropdownMenuItem
  disabled={isOwner || isSuspended}
  onClick={() => onSuspendModerator(moderator)}
  className="text-amber-700 focus:bg-amber-50 focus:text-amber-700"
>
  <Ban className="mr-2 size-4" />
  {isSuspended ? "Already suspended" : "Suspend moderator"}
</DropdownMenuItem>

<DropdownMenuItem
  disabled={isOwner}
  onClick={() => onRemoveModerator(moderator)}
  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
>
  <Trash2 className="mr-2 size-4" />
  Remove moderator
</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}