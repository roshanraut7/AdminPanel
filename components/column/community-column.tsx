"use client";

import { type Column, type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Copy,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import type {
  AdminCommunity,
  AdminCommunityStatus,
  AdminCommunityVisibility,
} from "@/types/admin-community";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

export type { AdminCommunity } from "@/types/admin-community";

type CommunityColumnsOptions = {
  onDelete: (
    community: AdminCommunity,
  ) => void;
};

function getInitials(value: string | null | undefined) {
  if (!value) {
    return "NA";
  }

  return value
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface SortableHeaderProps {
  column: Column<AdminCommunity, unknown>;
  title: string;
}

function SortableHeader({
  column,
  title,
}: SortableHeaderProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() =>
        column.toggleSorting(column.getIsSorted() === "asc")
      }
      className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
    >
      {title}
      <ArrowUpDown className="ml-2 size-4" />
    </Button>
  );
}

export function getCommunityColumns({
  onDelete,
}: CommunityColumnsOptions): ColumnDef<AdminCommunity>[] {
  return [
  /**
   * COMMUNITY
   */
  {
    accessorKey: "name",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Community"
      />
    ),
    cell: ({ row }) => {
      const community = row.original;

      return (
        <div className="flex min-w-[270px] items-start gap-3">
          <Avatar className="size-10 border border-border">
            <AvatarImage
              src={community.avatarImage ?? undefined}
              alt={community.name}
            />

            <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
              {getInitials(community.name)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {community.name}
            </p>

            {community.slug && (
              <p className="truncate text-xs text-muted-foreground">
                {community.slug}
              </p>
            )}

            {community.description && (
              <p className="mt-1 line-clamp-1 max-w-[260px] text-xs text-muted-foreground">
                {community.description}
              </p>
            )}
          </div>
        </div>
      );
    },
  },

  /**
   * CATEGORY
   */
  {
    accessorKey: "categoryName",
    header: "Category",
    enableSorting: false,
    cell: ({ row }) => {
      const community = row.original;

      return (
        <div className="min-w-[135px]">
          <p className="text-sm font-medium text-foreground">
            {community.categoryName || "No category"}
          </p>

          {community.categorySlug && (
            <p className="text-xs text-muted-foreground">
              {community.categorySlug}
            </p>
          )}
        </div>
      );
    },
  },

  /**
   * OWNER
   */
  {
    accessorKey: "adminName",
    header: "Owner",
    enableSorting: false,
    cell: ({ row }) => {
      const community = row.original;

      return (
        <div className="flex min-w-[200px] items-center gap-3">
          <Avatar className="size-8 border border-border">
            <AvatarImage
              src={community.adminImage ?? undefined}
              alt={community.adminName ?? "Community owner"}
            />

            <AvatarFallback className="bg-muted text-xs text-muted-foreground">
              {getInitials(community.adminName)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {community.adminName || "Unknown owner"}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {community.adminEmail}
            </p>
          </div>
        </div>
      );
    },
  },

  /**
   * MEMBERS
   * Shows only member count.
   */
  {
    accessorKey: "memberCount",
    header: "Members",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground">
        {row.original.memberCount}
      </span>
    ),
  },

  /**
   * POSTS
   */
  {
    accessorKey: "postCount",
    header: "Posts",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground">
        {row.original.postCount}
      </span>
    ),
  },

  /**
   * BANNED MEMBERS
   * Replaces Requests column.
   */
  {
    accessorKey: "bannedCount",
    header: "Banned",
    enableSorting: false,
    cell: ({ row }) => {
      const bannedCount = row.original.bannedCount;
      const hasBannedMembers = bannedCount > 0;

      return (
        <Badge
          variant="outline"
          className={
            hasBannedMembers
              ? "border-destructive/20 bg-destructive/10 px-2.5 py-1 font-medium text-destructive"
              : "border-border bg-muted px-2.5 py-1 font-medium text-muted-foreground"
          }
        >
          {bannedCount}
        </Badge>
      );
    },
  },

  /**
   * VISIBILITY
   */
  {
    accessorKey: "visibility",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Visibility"
      />
    ),
    cell: ({ row }) => {
      const visibility = row.getValue(
        "visibility",
      ) as AdminCommunityVisibility;

      return (
        <Badge
          variant="outline"
          className={
            visibility === "PUBLIC"
              ? "border-primary/20 bg-accent px-2.5 py-1 font-medium text-accent-foreground"
              : "border-border bg-muted px-2.5 py-1 font-medium text-muted-foreground"
          }
        >
          {visibility === "PUBLIC" ? "Public" : "Private"}
        </Badge>
      );
    },
  },

  /**
   * STATUS
   */
  {
    accessorKey: "status",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Status"
      />
    ),
    cell: ({ row }) => {
      const status = row.getValue(
        "status",
      ) as AdminCommunityStatus;

      const isActive = status === "ACTIVE";

      return (
        <Badge
          variant="outline"
          className={
            isActive
              ? "gap-1.5 border-transparent bg-accent px-2.5 py-1 font-medium text-accent-foreground"
              : "gap-1.5 border-border bg-muted px-2.5 py-1 font-medium text-muted-foreground"
          }
        >
          <span
            className={
              isActive
                ? "size-1.5 rounded-full bg-primary"
                : "size-1.5 rounded-full bg-muted-foreground"
            }
          />

          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
  },

  /**
   * CREATED
   */
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader
        column={column}
        title="Created"
      />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.original.createdAt);

      return (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {createdAt.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      );
    },
  },

  /**
   * ACTIONS
   */
  {
    id: "actions",
    header: () => (
      <div className="text-right">
        Actions
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      const community = row.original;

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
                <span className="sr-only">
                  Open community actions
                </span>

                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-52 border-border bg-popover text-popover-foreground"
            >
              <DropdownMenuLabel>
                Actions
              </DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(community.id)
                }
                className="focus:bg-accent focus:text-accent-foreground"
              >
                <Copy className="mr-2 size-4" />
                Copy community ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(community.slug)
                }
                className="focus:bg-accent focus:text-accent-foreground"
              >
                <Copy className="mr-2 size-4" />
                Copy slug
              </DropdownMenuItem>

              <DropdownMenuSeparator />

             <DropdownMenuItem
  onClick={() =>
    onDelete(community)
  }
  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
>
  <Trash2 className="mr-2 size-4" />
  Delete community
</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
}