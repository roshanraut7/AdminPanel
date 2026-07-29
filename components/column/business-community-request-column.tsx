"use client";

import type { ColumnDef } from "@tanstack/react-table";
import {
  format,
  formatDistanceToNow,
} from "date-fns";
import {
  Building2,
  Copy,
  Earth,
  Eye,
  GraduationCap,
  LockKeyhole,
  MoreHorizontal,
  Tag,
  UserRound,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  BusinessCommunityRequest,
  VerificationTrack,
} from "@/types/business-community";

type BusinessCommunityColumnsOptions = {
  onReview: (
    request: BusinessCommunityRequest,
  ) => void;
};

const trackStyles: Record<
  VerificationTrack,
  {
    label: string;
    className: string;
    icon: typeof Building2;
  }
> = {
  BUSINESS: {
    label: "Business",
    className:
      "border-primary/15 bg-primary/10 text-primary",
    icon: Building2,
  },

  TRAINING: {
    label: "Training institute",
    className:
      "border-chart-2/15 bg-chart-2/10 text-chart-2",
    icon: GraduationCap,
  },

  INDIVIDUAL: {
    label: "Individual",
    className:
      "border-chart-3/15 bg-chart-3/10 text-chart-3",
    icon: UserRound,
  },
};

function createInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export function getBusinessCommunityRequestColumns({
  onReview,
}: BusinessCommunityColumnsOptions): ColumnDef<BusinessCommunityRequest>[] {
  return [
    {
      id: "applicant",
      header: "Applicant",

      cell: ({ row }) => {
        const { user } = row.original;

        const track =
          user.verificationTrack ??
          "INDIVIDUAL";

        const configuration =
          trackStyles[track];

        const TrackIcon =
          configuration.icon;

        return (
          <div className="flex min-w-[260px] items-center gap-3">
            <Avatar className="size-10 border border-border">
              <AvatarImage
                src={user.image ?? undefined}
                alt={user.name}
              />

              <AvatarFallback className="bg-accent text-xs font-semibold text-accent-foreground">
                {createInitials(user.name)}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {user.name}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>

              <div className="mt-1 flex items-center gap-1.5">
                <TrackIcon className="size-3 text-muted-foreground" />

                <span className="truncate text-xs text-muted-foreground">
                  {user.businessName ||
                    configuration.label}
                </span>
              </div>
            </div>
          </div>
        );
      },
    },

    {
      id: "community",
      header: "Community",

      cell: ({ row }) => {
        const request = row.original;

        return (
          <div className="flex min-w-[240px] items-center gap-3">
            <Avatar className="size-10 rounded-xl border border-border">
              <AvatarImage
                src={
                  request.avatarImage ??
                  undefined
                }
                alt={request.name}
              />

              <AvatarFallback className="rounded-xl bg-primary/10 text-xs font-semibold text-primary">
                {createInitials(
                  request.name,
                )}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">
                {request.name}
              </p>

              <p className="max-w-[260px] truncate text-xs text-muted-foreground">
                {request.description ||
                  "No description provided"}
              </p>
            </div>
          </div>
        );
      },
    },

    {
      id: "category",
      header: "Category",

      cell: ({ row }) => (
        <div className="flex min-w-[160px] items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <Tag className="size-4" />
          </div>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">
              {row.original.category.name}
            </p>

            <p className="truncate text-xs text-muted-foreground">
              {row.original.category.slug}
            </p>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "visibility",
      header: "Visibility",

      cell: ({ row }) => {
        const isPublic =
          row.original.visibility ===
          "PUBLIC";

        const Icon = isPublic
          ? Earth
          : LockKeyhole;

        return (
          <Badge
            variant="outline"
            className={
              isPublic
                ? "gap-1.5 rounded-full border-primary/15 bg-primary/10 px-2.5 py-1 text-primary"
                : "gap-1.5 rounded-full border-border bg-muted px-2.5 py-1 text-muted-foreground"
            }
          >
            <Icon className="size-3.5" />

            {isPublic
              ? "Public"
              : "Private"}
          </Badge>
        );
      },
    },

    {
      accessorKey: "createdAt",
      header: "Submitted",

      cell: ({ row }) => {
        const submittedAt = new Date(
          row.original.createdAt,
        );

        return (
          <div className="min-w-[150px]">
            <p className="whitespace-nowrap text-sm font-medium text-foreground">
              {format(
                submittedAt,
                "dd MMM yyyy",
              )}
            </p>

            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(
                submittedAt,
                {
                  addSuffix: true,
                },
              )}
            </p>
          </div>
        );
      },
    },

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
        const request = row.original;

        return (
          <div className="flex justify-end gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                onReview(request)
              }
              className="h-8 border-border bg-card hover:bg-accent hover:text-accent-foreground"
            >
              <Eye className="mr-2 size-4" />
              Review
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                >
                  <span className="sr-only">
                    Open request actions
                  </span>

                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-56 border-border bg-popover text-popover-foreground"
              >
                <DropdownMenuLabel>
                  Request actions
                </DropdownMenuLabel>

                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(
                      request.id,
                    )
                  }
                >
                  <Copy className="mr-2 size-4" />
                  Copy request ID
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(
                      request.user.email,
                    )
                  }
                >
                  <Copy className="mr-2 size-4" />
                  Copy applicant email
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() =>
                    onReview(request)
                  }
                >
                  <Eye className="mr-2 size-4" />
                  Review request
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}