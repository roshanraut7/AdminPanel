"use client";

import { type ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  Edit,
  MessageCircle,
  MoreHorizontal,
  Share2,
  ThumbsUp,
  Trash2,
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

import type { AdminPost, AdminPostStatus } from "@/types/post";

type CreatePostColumnsParams = {
  onEdit: (post: AdminPost) => void;
  onDelete: (post: AdminPost) => void;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function stripHtml(value: string) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getStatusClass(status: AdminPostStatus) {
  if (status === "PUBLISHED") {
    return "border-transparent bg-emerald-50 text-emerald-700";
  }

  if (status === "HIDDEN") {
    return "border-transparent bg-amber-50 text-amber-700";
  }

  if (status === "REMOVED") {
    return "border-transparent bg-red-50 text-red-700";
  }

  return "border-border bg-muted text-muted-foreground";
}

function getStatusDotClass(status: AdminPostStatus) {
  if (status === "PUBLISHED") return "bg-emerald-600";
  if (status === "HIDDEN") return "bg-amber-600";
  if (status === "REMOVED") return "bg-red-600";
  return "bg-muted-foreground";
}

export function createPostColumns({
  onEdit,
  onDelete,
}: CreatePostColumnsParams): ColumnDef<AdminPost>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Post
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const post = row.original;
        const content = stripHtml(post.content);

        return (
          <div className="min-w-[280px] space-y-1">
            <p className="line-clamp-1 font-medium text-foreground">
              {post.title || "Untitled post"}
            </p>

            <p className="line-clamp-1 max-w-[380px] text-xs text-muted-foreground">
              {content || "No content"}
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <Badge variant="outline" className="rounded-full px-2 py-0 text-[11px]">
                {post.type}
              </Badge>

              <Badge variant="outline" className="rounded-full px-2 py-0 text-[11px]">
                {post.tag}
              </Badge>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "authorName",
      header: ({ column }) => (
        <Button
          type="button"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3 h-8 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          Author
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <div className="min-w-[140px]">
          <p className="line-clamp-1 text-sm font-medium text-foreground">
            {row.original.authorName}
          </p>

          <p className="line-clamp-1 text-xs text-muted-foreground">
            {row.original.communityName}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "likeCount",
      header: "Likes",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <ThumbsUp className="size-4 text-muted-foreground" />
          {row.original.likeCount}
        </div>
      ),
    },
    {
      accessorKey: "commentCount",
      header: "Comments",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <MessageCircle className="size-4 text-muted-foreground" />
          {row.original.commentCount}
        </div>
      ),
    },
    {
      accessorKey: "shareCount",
      header: "Shares",
      cell: ({ row }) => (
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <Share2 className="size-4 text-muted-foreground" />
          {row.original.shareCount}
        </div>
      ),
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
            className={`gap-1.5 px-2.5 py-1 font-medium ${getStatusClass(status)}`}
          >
            <span className={`size-1.5 rounded-full ${getStatusDotClass(status)}`} />
            {status}
          </Badge>
        );
      },
    },
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
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-sm text-muted-foreground">
          {formatDate(row.original.createdAt)}
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
        const post = row.original;

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
                  <span className="sr-only">Open post actions</span>
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-40 border-border bg-popover text-popover-foreground"
              >
                <DropdownMenuLabel>Actions</DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() => onEdit(post)}
                  className="focus:bg-accent focus:text-accent-foreground"
                >
                  <Edit className="mr-2 size-4" />
                  Edit
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => onDelete(post)}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <Trash2 className="mr-2 size-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}