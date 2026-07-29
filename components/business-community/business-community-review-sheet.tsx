"use client";

import * as React from "react";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  CircleAlert,
  Earth,
  GraduationCap,
  Loader2,
  LockKeyhole,
  Mail,
  Tag,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";

import {
  useApproveBusinessCommunityRequestMutation,
  useRejectBusinessCommunityRequestMutation,
} from "@/lib/redux/services/business-community.api";

import type {
  BusinessCommunityRequest,
  BusinessCommunityRequestStatus,
  VerificationTrack,
} from "@/types/business-community";

type BusinessCommunityReviewSheetProps = {
  request: BusinessCommunityRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const statusConfiguration: Record<
  BusinessCommunityRequestStatus,
  {
    label: string;
    className: string;
    icon: typeof CheckCircle2;
  }
> = {
  PENDING: {
    label: "Pending review",
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-700 dark:text-amber-400",
    icon: CircleAlert,
  },

  APPROVED: {
    label: "Approved",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
    icon: CheckCircle2,
  },

  REJECTED: {
    label: "Rejected",
    className:
      "border-destructive/20 bg-destructive/10 text-destructive",
    icon: XCircle,
  },
};

const trackConfiguration: Record<
  VerificationTrack,
  {
    label: string;
    icon: typeof Building2;
  }
> = {
  BUSINESS: {
    label: "Business",
    icon: Building2,
  },

  TRAINING: {
    label: "Training institute",
    icon: GraduationCap,
  },

  INDIVIDUAL: {
    label: "Individual",
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

function getApiErrorMessage(
  error: unknown,
) {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const data = (
      error as {
        data?: {
          message?: string | string[];
        };
      }
    ).data;

    if (
      Array.isArray(data?.message)
    ) {
      return data.message.join(", ");
    }

    if (
      typeof data?.message === "string"
    ) {
      return data.message;
    }
  }

  return "Something went wrong. Please try again.";
}

export function BusinessCommunityReviewSheet({
  request,
  open,
  onOpenChange,
}: BusinessCommunityReviewSheetProps) {
  const [rejectionReason, setRejectionReason] =
    React.useState("");

  const [
    approveRequest,
    { isLoading: isApproving },
  ] =
    useApproveBusinessCommunityRequestMutation();

  const [
    rejectRequest,
    { isLoading: isRejecting },
  ] =
    useRejectBusinessCommunityRequestMutation();

  React.useEffect(() => {
    setRejectionReason("");
  }, [request?.id, open]);

  if (!request) {
    return null;
  }

  const status =
    statusConfiguration[request.status];

  const StatusIcon = status.icon;

  const verificationTrack =
    request.user.verificationTrack ??
    "INDIVIDUAL";

  const track =
    trackConfiguration[verificationTrack];

  const TrackIcon = track.icon;

  const isPending =
    request.status === "PENDING";

  const isSubmitting =
    isApproving || isRejecting;

  const handleApprove = async () => {
    try {
      const result =
        await approveRequest(
          request.id,
        ).unwrap();

      toast.success(
        result.message ||
          "Community request approved",
      );

      onOpenChange(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    }
  };

  const handleReject = async () => {
    const cleanReason =
      rejectionReason.trim();

    if (cleanReason.length < 5) {
      toast.error(
        "Please provide a clear rejection reason.",
      );

      return;
    }

    try {
      const result =
        await rejectRequest({
          requestId: request.id,
          reason: cleanReason,
        }).unwrap();

      toast.success(
        result.message ||
          "Community request rejected",
      );

      onOpenChange(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    }
  };

  return (
    <Sheet
      open={open}
      onOpenChange={onOpenChange}
    >
      <SheetContent className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-xl">
        <SheetHeader className="border-b border-border px-6 py-5 text-left">
          <div className="flex items-start justify-between gap-4 pr-6">
            <div>
              <SheetTitle className="text-xl">
                Review community request
              </SheetTitle>

              <SheetDescription className="mt-1">
                Review the applicant and
                requested community details.
              </SheetDescription>
            </div>

            <Badge
              variant="outline"
              className={`shrink-0 gap-1.5 rounded-full px-2.5 py-1 ${status.className}`}
            >
              <StatusIcon className="size-3.5" />
              {status.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="space-y-6 px-6 py-6">
          {/* Applicant */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Applicant
            </h3>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-12 border border-border">
                  <AvatarImage
                    src={
                      request.user.image ??
                      undefined
                    }
                    alt={
                      request.user.name
                    }
                  />

                  <AvatarFallback className="bg-primary/10 font-semibold text-primary">
                    {createInitials(
                      request.user.name,
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-foreground">
                    {request.user.name}
                  </p>

                  <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Mail className="size-3.5" />

                    <span className="truncate">
                      {request.user.email}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <Badge
                      variant="outline"
                      className="gap-1.5"
                    >
                      <TrackIcon className="size-3.5" />
                      {track.label}
                    </Badge>

                    {request.user
                      .businessName && (
                      <Badge variant="secondary">
                        {
                          request.user
                            .businessName
                        }
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          <Separator />

          {/* Community */}
          <section>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Requested community
            </h3>

            <div className="rounded-xl border border-border bg-card p-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-12 rounded-xl border border-border">
                  <AvatarImage
                    src={
                      request.avatarImage ??
                      undefined
                    }
                    alt={request.name}
                  />

                  <AvatarFallback className="rounded-xl bg-primary/10 font-semibold text-primary">
                    {createInitials(
                      request.name,
                    )}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="font-semibold text-foreground">
                    {request.name}
                  </p>

                  <p className="mt-1 text-sm leading-6 text-muted-foreground">
                    {request.description ||
                      "No description was provided."}
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <Tag className="size-3.5" />
                    Category
                  </div>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {
                      request.category
                        .name
                    }
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    {request.visibility ===
                    "PUBLIC" ? (
                      <Earth className="size-3.5" />
                    ) : (
                      <LockKeyhole className="size-3.5" />
                    )}

                    Visibility
                  </div>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {request.visibility ===
                    "PUBLIC"
                      ? "Public community"
                      : "Private community"}
                  </p>
                </div>

                <div className="rounded-lg bg-muted p-3 sm:col-span-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <CalendarDays className="size-3.5" />
                    Submitted
                  </div>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {format(
                      new Date(
                        request.createdAt,
                      ),
                      "dd MMMM yyyy, hh:mm a",
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {request.status ===
            "APPROVED" && (
            <>
              <Separator />

              <section>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Approval result
                </h3>

                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-emerald-600" />

                    <div>
                      <p className="font-medium text-foreground">
                        Community created
                        successfully
                      </p>

                      {request.createdCommunityId && (
                        <p className="mt-1 break-all text-xs text-muted-foreground">
                          Community ID:{" "}
                          {
                            request.createdCommunityId
                          }
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            </>
          )}

          {request.status ===
            "REJECTED" && (
            <>
              <Separator />

              <section>
                <h3 className="mb-3 text-sm font-semibold text-foreground">
                  Rejection reason
                </h3>

                <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
                  <div className="flex items-start gap-3">
                    <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />

                    <p className="text-sm leading-6 text-foreground">
                      {request.rejectionReason ||
                        "No rejection reason was recorded."}
                    </p>
                  </div>
                </div>
              </section>
            </>
          )}

          {isPending && (
            <>
              <Separator />

              <section>
                <Label
                  htmlFor="rejection-reason"
                  className="text-sm font-semibold"
                >
                  Rejection reason
                </Label>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  Complete this field only
                  when rejecting the
                  request.
                </p>

                <Textarea
                  id="rejection-reason"
                  value={rejectionReason}
                  onChange={(event) =>
                    setRejectionReason(
                      event.target.value,
                    )
                  }
                  placeholder="Explain why this request cannot be approved and what the applicant should correct..."
                  rows={5}
                  disabled={isSubmitting}
                  className="mt-3 resize-none"
                />
              </section>

              <div className="grid gap-3 border-t border-border pt-5 sm:grid-cols-2">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleReject}
                  disabled={
                    isSubmitting ||
                    rejectionReason.trim()
                      .length < 5
                  }
                >
                  {isRejecting ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <XCircle className="mr-2 size-4" />
                  )}

                  Reject request
                </Button>

                <Button
                  type="button"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                >
                  {isApproving ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="mr-2 size-4" />
                  )}

                  Approve and create
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}