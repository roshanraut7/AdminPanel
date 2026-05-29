"use client";

import { endOfDay, startOfDay } from "date-fns";
import { type DateRange } from "react-day-picker";
import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, Copy, MoreHorizontal } from "lucide-react";

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

import type {
  Category,
  CategoryStatus,
} from "@/types/category";

export const categoryColumns: ColumnDef<Category>[] = [
  /**
   * CATEGORY
   * Shows category name and description together.
   */
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        Category
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const category = row.original;

      return (
        <div className="min-w-[240px] space-y-1">
          <p className="font-medium text-foreground">{category.name}</p>

          <p className="line-clamp-1 max-w-[320px] text-xs text-muted-foreground">
            {category.description || "No description added"}
          </p>
        </div>
      );
    },
  },

  /**
   * SLUG
   */
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
        {row.getValue("slug")}
      </span>
    ),
  },

  /**
   * COMMUNITIES
   */
  {
    accessorKey: "communityCount",
    header: "Communities",
    cell: ({ row }) => {
      const communityCount = row.getValue("communityCount") as number;

      return (
        <span className="rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground">
          {communityCount}
        </span>
      );
    },
  },

  /**
   * STATUS
   */
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
      const status = row.getValue("status") as CategoryStatus;
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
   * ORDER
   */
  {
    accessorKey: "sortOrder",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        Order
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="text-sm font-medium text-foreground">
        #{row.getValue("sortOrder")}
      </span>
    ),
  },

  /**
   * CREATED DATE
   * Includes reusable client-side date range filtering.
   */
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <Button
        type="button"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      >
        Created
        <ArrowUpDown className="ml-2 size-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const createdAt = new Date(row.getValue("createdAt") as string);

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
    filterFn: (row, columnId, filterValue) => {
      const range = filterValue as DateRange | undefined;

      if (!range?.from) {
        return true;
      }

      const rowDate = new Date(row.getValue(columnId) as string);

      if (Number.isNaN(rowDate.getTime())) {
        return false;
      }

      const createdDate = startOfDay(rowDate);
      const fromDate = startOfDay(range.from);
      const toDate = endOfDay(range.to ?? range.from);

      return createdDate >= fromDate && createdDate <= toDate;
    },
  },

  /**
   * ACTIONS
   */
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableSorting: false,
    enableHiding: false,
    enableColumnFilter: false,
    cell: ({ row }) => {
      const category = row.original;

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
                <span className="sr-only">Open category actions</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 border-border bg-popover text-popover-foreground"
            >
              <DropdownMenuLabel>Actions</DropdownMenuLabel>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(category.id)}
                className="focus:bg-accent focus:text-accent-foreground"
              >
                <Copy className="mr-2 size-4" />
                Copy category ID
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(category.slug)}
                className="focus:bg-accent focus:text-accent-foreground"
              >
                <Copy className="mr-2 size-4" />
                Copy slug
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                disabled
                className="text-muted-foreground"
              >
                Edit category
              </DropdownMenuItem>

              <DropdownMenuItem
                disabled
                className="text-muted-foreground"
              >
                Change status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];