"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Ban,
  Eye,
  MoreHorizontal,
  Trash2,
  Users,
  FileText,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type {
  AdminUser,
  AdminUserDocumentStatus,
  AdminUserStatus,
} from "@/types/user";

type CreateUserColumnsParams = {
  onViewProfile: (user: AdminUser) => void;
  onBanUser: (user: AdminUser) => void;
  onDeleteUser: (user: AdminUser) => void;
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

function getUserStatusClass(status: AdminUserStatus) {
  if (status === "ACTIVE") {
    return "border-transparent bg-emerald-50 text-emerald-700";
  }

  if (status === "PENDING") {
    return "border-transparent bg-blue-50 text-blue-700";
  }

  if (status === "SUSPENDED") {
    return "border-transparent bg-amber-50 text-amber-700";
  }

  return "border-transparent bg-red-50 text-red-700";
}

function getUserStatusDotClass(status: AdminUserStatus) {
  if (status === "ACTIVE") return "bg-emerald-600";
  if (status === "PENDING") return "bg-blue-600";
  if (status === "SUSPENDED") return "bg-amber-600";
  return "bg-red-600";
}

function getDocumentStatusClass(status: AdminUserDocumentStatus) {
  if (status === "VERIFIED") {
    return "border-transparent bg-emerald-50 text-emerald-700";
  }

  if (status === "PENDING") {
    return "border-transparent bg-amber-50 text-amber-700";
  }

  if (status === "REJECTED") {
    return "border-transparent bg-red-50 text-red-700";
  }

  return "border-border bg-muted text-muted-foreground";
}

function getDocumentLabel(status: AdminUserDocumentStatus) {
  if (status === "NOT_SUBMITTED") return "Not submitted";
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export function createUserColumns({
  onViewProfile,
  onBanUser,
  onDeleteUser,
}: CreateUserColumnsParams): ColumnDef<AdminUser>[] {
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
          User
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex min-w-[260px] items-center gap-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName}
                className="size-11 rounded-full object-cover"
              />
            ) : (
              <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                {getInitials(user.fullName)}
              </div>
            )}

            <div className="min-w-0">
              <p className="line-clamp-1 text-sm font-semibold text-foreground">
                {user.fullName}
              </p>

              <p className="line-clamp-1 text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Status
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const status = row.original.status;

        return (
          <Badge
            variant="outline"
            className={`gap-1.5 px-2.5 py-1 font-medium ${getUserStatusClass(status)}`}
          >
            <span
              className={`size-1.5 rounded-full ${getUserStatusDotClass(status)}`}
            />
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "documentVerification",
      header: "Document Verification",
      cell: ({ row }) => {
        const status = row.original.documentVerification;

        return (
          <Badge
            variant="outline"
            className={`px-2.5 py-1 font-medium ${getDocumentStatusClass(status)}`}
          >
            {getDocumentLabel(status)}
          </Badge>
        );
      },
    },
    {
      accessorKey: "district",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          District
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm font-medium text-foreground">
          {row.original.district}
        </span>
      ),
    },
    {
      accessorKey: "communityCount",
      header: "Communities",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Users className="size-4 text-muted-foreground" />
          {row.original.communityCount}
        </div>
      ),
    },
    {
      accessorKey: "postCount",
      header: "Posts",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <FileText className="size-4 text-muted-foreground" />
          {row.original.postCount}
        </div>
      ),
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
        const user = row.original;

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
                  <span className="sr-only">Open user actions</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-44 border-border bg-popover text-popover-foreground"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem onClick={() => onViewProfile(user)}>
                  <Eye className="mr-2 size-4" />
                  View profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onBanUser(user)}
                  className="text-amber-700 focus:bg-amber-50 focus:text-amber-700"
                >
                  <Ban className="mr-2 size-4" />
                  Ban user
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onDeleteUser(user)}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete user
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}