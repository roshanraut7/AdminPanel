"use client";

import { format, formatDistanceToNow } from "date-fns";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Building2,
  Copy,
  Eye,
  FileBadge,
  GraduationCap,
  MoreHorizontal,
  UserRound,
} from "lucide-react";

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

import type {
  VerificationDocumentType,
  VerificationRequest,
  VerificationTrack,
} from "@/types/document-verification";

type VerificationColumnsOptions = {
  onReview: (
    request: VerificationRequest,
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
    label: "Training",
    className:
      "border-chart-2/15 bg-chart-2/10 text-chart-2",
    icon: GraduationCap,
  },

  INDIVIDUAL: {
    label: "Individual",
    className:
      "border-chart-3/15 bg-chart-3/10 text-chart-1",
    icon: UserRound,
  },
};

const documentLabels: Record<
  VerificationDocumentType,
  string
> = {
  PAN: "PAN document",
  CITIZENSHIP: "Citizenship",
  INSTITUTE_CERTIFICATE:
    "Institute certificate",
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

export function getVerificationColumns({
  onReview,
}: VerificationColumnsOptions): ColumnDef<VerificationRequest>[] {
  return [
    {
      id: "applicant",
      header: "Applicant",

      cell: ({ row }) => {
        const { user } = row.original;

        return (
          <div className="flex min-w-[250px] items-center gap-3">
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

              {user.businessName && (
                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {user.businessName}
                </p>
              )}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "track",
      header: "Track",

      cell: ({ row }) => {
        const track = row.original.track;
        const configuration =
          trackStyles[track];
        const Icon = configuration.icon;

        return (
          <Badge
            variant="outline"
            className={`gap-1.5 rounded-full px-2.5 py-1 font-medium ${configuration.className}`}
          >
            <Icon className="size-3.5" />

            {configuration.label}
          </Badge>
        );
      },
    },

    {
      accessorKey: "documentType",
      header: "Document",

      cell: ({ row }) => (
        <div className="flex min-w-[180px] items-center gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
            <FileBadge className="size-4" />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground">
              {
                documentLabels[
                  row.original.documentType
                ]
              }
            </p>

            <p className="text-xs text-muted-foreground">
              {row.original.documentBackUrl
                ? "Front and back"
                : "Single document"}
            </p>
          </div>
        </div>
      ),
    },

    {
      accessorKey: "documentNumber",
      header: "Document number",

      cell: ({ row }) => (
        <span className="rounded-md bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground">
          {row.original.documentNumber ||
            "Not required"}
        </span>
      ),
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
              <DropdownMenuTrigger asChild>
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
                className="w-52 border-border bg-popover text-popover-foreground"
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
                  Review documents
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
}