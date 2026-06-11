"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpRight } from "lucide-react";

import type { AdminCommunityLimitUser } from "@/types/community-request";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

type ColumnsOptions = {
  onIncreaseLimit: (user: AdminCommunityLimitUser) => void;
};

export function createCommunityRequestColumns({
  onIncreaseLimit,
}: ColumnsOptions): ColumnDef<AdminCommunityLimitUser>[] {
  return [
    {
      accessorKey: "name",
      header: "User",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <div className="flex min-w-[250px] items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name}
              />

              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "communityCreated",
      header: "Community Created",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="rounded-md bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
          {row.original.communityCreated}
        </span>
      ),
    },

    {
      accessorKey: "communityCreateLimit",
      header: "Current Limit",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-sm font-medium text-foreground">
          {row.original.communityCreateLimit}
        </span>
      ),
    },

    {
      accessorKey: "available",
      header: "Available",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <Badge
            variant="outline"
            className={
              user.hasReachedLimit
                ? "border-destructive/20 bg-destructive/10 px-2.5 py-1 font-medium text-destructive"
                : "border-primary/20 bg-accent px-2.5 py-1 font-medium text-accent-foreground"
            }
          >
            {user.available}
          </Badge>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Joined",
      enableSorting: false,
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

    {
      id: "actions",
      header: () => <div className="text-right">Action</div>,
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onIncreaseLimit(row.original)}
            className="border-primary/20 text-primary hover:bg-accent hover:text-accent-foreground"
          >
            Increase Limit
            <ArrowUpRight className="ml-2 size-4" />
          </Button>
        </div>
      ),
    },
  ];
}