/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState } from "react";
import { toAbsoluteFileUrl } from "@/lib/file-url";
import { format } from "date-fns";
import {
  Building2,
  CalendarDays,
  CheckCircle2,
  ExternalLink,
  FileBadge,
  FileText,
  GraduationCap,
  Hash,
  LoaderCircle,
  Mail,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  useApproveVerificationRequestMutation,
  useRejectVerificationRequestMutation,
} from "@/lib/redux/services/document-verification.api";

import type {
  VerificationDocumentType,
  VerificationRequest,
  VerificationTrack,
} from "@/types/document-verification";

type VerificationReviewSheetProps = {
  request: VerificationRequest | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};


const trackConfiguration: Record<
  VerificationTrack,
  {
    label: string;
    icon: typeof Building2;
    className: string;
  }
> = {
  BUSINESS: {
    label: "Business verification",
    icon: Building2,
    className:
      "border-primary/15 bg-primary/10 text-primary",
  },

  TRAINING: {
    label: "Training verification",
    icon: GraduationCap,
    className:
      "border-chart-2/15 bg-chart-2/10 text-chart-2",
  },

  INDIVIDUAL: {
    label: "Individual verification",
    icon: UserRound,
    className:
      "border-chart-3/15 bg-chart-3/10 text-chart-1",
  },
};

const documentLabels: Record<
  VerificationDocumentType,
  string
> = {
  PAN: "PAN document",
  CITIZENSHIP: "Citizenship document",
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

function getApiErrorMessage(
  error: unknown,
  fallback: string,
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

    if (Array.isArray(data?.message)) {
      return data.message.join(", ");
    }

    if (
      typeof data?.message === "string"
    ) {
      return data.message;
    }
  }

  return fallback;
}

function isPdfDocument(url: string) {
  return /\.pdf($|\?)/i.test(url);
}

type DocumentPreviewProps = {
  title: string;
  url: string | null;
  required?: boolean;
};

function DocumentPreview({
  title,
  url,
  required = false,
}: DocumentPreviewProps) {
  const absoluteUrl = toAbsoluteFileUrl(url);

  if (!absoluteUrl) {
    return (
      <Card className="overflow-hidden border-dashed border-border bg-muted/30 shadow-none">
        <CardContent className="flex min-h-48 flex-col items-center justify-center p-6 text-center">
          <FileText className="mb-3 size-8 text-muted-foreground" />

          <p className="text-sm font-medium text-foreground">
            {title}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {required
              ? "Required document was not provided"
              : "No back document was provided"}
          </p>
        </CardContent>
      </Card>
    );
  }

  const isPdf = isPdfDocument(absoluteUrl);

  return (
    <Card className="overflow-hidden border-border bg-card shadow-sm">
      <div className="relative flex min-h-52 items-center justify-center overflow-hidden bg-secondary">
        {isPdf ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <FileText className="size-8" />
            </div>

            <div>
              <p className="font-semibold text-foreground">
                PDF document
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Open the file to review all pages
              </p>
            </div>
          </div>
        ) : (
          <img
            src={absoluteUrl}
            alt={title}
            className="h-64 w-full object-contain"
            onError={() => {
              console.error(
                "Document failed to load:",
                absoluteUrl,
              );
            }}
          />
        )}
      </div>

      <CardContent className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">
            {title}
          </p>

          <p className="text-xs text-muted-foreground">
            {isPdf
              ? "PDF attachment"
              : "Image attachment"}
          </p>
        </div>

        <Button
          asChild
          type="button"
          variant="outline"
          size="sm"
          className="shrink-0"
        >
          <a
            href={absoluteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="mr-2 size-4" />
            Open
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

export function VerificationReviewSheet({
  request,
  open,
  onOpenChange,
}: VerificationReviewSheetProps) {
  const [
    approveDialogOpen,
    setApproveDialogOpen,
  ] = useState(false);

  const [
    rejectDialogOpen,
    setRejectDialogOpen,
  ] = useState(false);

  const [
    rejectionReason,
    setRejectionReason,
  ] = useState("");

  const [
    approveRequest,
    {
      isLoading: isApproving,
    },
  ] =
    useApproveVerificationRequestMutation();

  const [
    rejectRequest,
    {
      isLoading: isRejecting,
    },
  ] =
    useRejectVerificationRequestMutation();

  useEffect(() => {
    if (!open) {
      setApproveDialogOpen(false);
      setRejectDialogOpen(false);
      setRejectionReason("");
    }
  }, [open]);

  if (!request) {
    return null;
  }

  const track =
    trackConfiguration[request.track];

  const TrackIcon = track.icon;

  const handleApprove = async () => {
    try {
      const result =
        await approveRequest(
          request.id,
        ).unwrap();

      toast.success(result.message);

      setApproveDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to approve the verification request",
        ),
      );
    }
  };

  const handleReject = async () => {
    const reason =
      rejectionReason.trim();

    if (reason.length < 5) {
      toast.error(
        "Please provide a clear rejection reason",
      );

      return;
    }

    try {
      const result =
        await rejectRequest({
          requestId: request.id,
          reason,
        }).unwrap();

      toast.success(result.message);

      setRejectDialogOpen(false);
      onOpenChange(false);
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          "Unable to reject the verification request",
        ),
      );
    }
  };

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={onOpenChange}
      >
        <SheetContent
          side="right"
          className="w-full overflow-y-auto border-border bg-background p-0 sm:max-w-2xl"
        >
          <SheetHeader className="border-b border-border bg-card p-6 text-left">
            <div className="flex items-start gap-4 pr-8">
              <Avatar className="size-12 border border-border">
                <AvatarImage
                  src={
                    request.user.image ??
                    undefined
                  }
                  alt={request.user.name}
                />

                <AvatarFallback className="bg-accent font-semibold text-accent-foreground">
                  {createInitials(
                    request.user.name,
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <SheetTitle className="truncate text-xl text-foreground">
                  {request.user.name}
                </SheetTitle>

                <SheetDescription className="mt-1">
                  Review the applicant information
                  and uploaded documents.
                </SheetDescription>

                <Badge
                  variant="outline"
                  className={`mt-3 gap-1.5 rounded-full ${track.className}`}
                >
                  <TrackIcon className="size-3.5" />
                  {track.label}
                </Badge>
              </div>
            </div>
          </SheetHeader>

          <div className="space-y-6 p-6">
            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserRound className="size-4 text-primary" />
                  Applicant information
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-2">
                <InformationItem
                  icon={Mail}
                  label="Email"
                  value={request.user.email}
                />

                <InformationItem
                  icon={Building2}
                  label="Business"
                  value={
                    request.user
                      .businessName ||
                    "Not provided"
                  }
                />

                <InformationItem
                  icon={FileBadge}
                  label="Business type"
                  value={
                    request.user
                      .businessType ||
                    "Individual"
                  }
                />

                <InformationItem
                  icon={CalendarDays}
                  label="Submitted"
                  value={format(
                    new Date(
                      request.createdAt,
                    ),
                    "dd MMM yyyy, hh:mm a",
                  )}
                />
              </CardContent>
            </Card>

            <Card className="border-border bg-card shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ShieldCheck className="size-4 text-primary" />
                  Verification information
                </CardTitle>
              </CardHeader>

              <CardContent className="grid gap-4 sm:grid-cols-2">
                <InformationItem
                  icon={TrackIcon}
                  label="Verification track"
                  value={track.label}
                />

                <InformationItem
                  icon={FileText}
                  label="Document type"
                  value={
                    documentLabels[
                      request.documentType
                    ]
                  }
                />

                <InformationItem
                  icon={Hash}
                  label="Document number"
                  value={
                    request.documentNumber ||
                    "Not required"
                  }
                />

                <InformationItem
                  icon={ShieldCheck}
                  label="Current status"
                  value="Pending review"
                />
              </CardContent>
            </Card>

            <div>
              <div className="mb-4">
                <h3 className="text-base font-semibold text-foreground">
                  Uploaded documents
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Inspect the full-size files before
                  making a decision.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <DocumentPreview
                  title="Front document"
                  url={
                    request.documentFrontUrl
                  }
                  required
                />

                <DocumentPreview
                  title="Back document"
                  url={
                    request.documentBackUrl
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="rounded-xl border border-border bg-secondary/60 p-4">
              <p className="text-sm font-semibold text-foreground">
                Before making a decision
              </p>

              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Confirm that the applicant details,
                document number and uploaded files
                belong to the same person or
                organisation.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  setRejectDialogOpen(true)
                }
                disabled={
                  isApproving ||
                  isRejecting
                }
                className="border-destructive/25 text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <XCircle className="mr-2 size-4" />
                Reject request
              </Button>

              <Button
                type="button"
                onClick={() =>
                  setApproveDialogOpen(true)
                }
                disabled={
                  isApproving ||
                  isRejecting
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <CheckCircle2 className="mr-2 size-4" />
                Approve request
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={approveDialogOpen}
        onOpenChange={
          setApproveDialogOpen
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Approve this verification?
            </AlertDialogTitle>

            <AlertDialogDescription>
              {request.user.name} will be
              marked as verified under the{" "}
              {track.label.toLowerCase()}.
              This action should only be
              completed after reviewing all
              documents.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={isApproving}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                void handleApprove();
              }}
              disabled={isApproving}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isApproving ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 size-4" />
                  Confirm approval
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={rejectDialogOpen}
        onOpenChange={
          setRejectDialogOpen
        }
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Reject verification request
            </DialogTitle>

            <DialogDescription>
              Explain clearly why the documents
              could not be approved. The user
              can correct the problem and submit
              another request.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <label
              htmlFor="rejection-reason"
              className="text-sm font-medium text-foreground"
            >
              Rejection reason
            </label>

            <Textarea
              id="rejection-reason"
              value={rejectionReason}
              onChange={(event) =>
                setRejectionReason(
                  event.target.value,
                )
              }
              placeholder="Example: The PAN number does not match the uploaded document."
              rows={5}
              maxLength={500}
              disabled={isRejecting}
              className="resize-none"
            />

            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Minimum 5 characters
              </span>

              <span>
                {rejectionReason.length}/500
              </span>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                setRejectDialogOpen(false)
              }
              disabled={isRejecting}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={() =>
                void handleReject()
              }
              disabled={
                isRejecting ||
                rejectionReason.trim()
                  .length < 5
              }
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isRejecting ? (
                <>
                  <LoaderCircle className="mr-2 size-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                <>
                  <XCircle className="mr-2 size-4" />
                  Confirm rejection
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

type InformationItemProps = {
  icon: typeof Mail;
  label: string;
  value: string;
};

function InformationItem({
  icon: Icon,
  label,
  value,
}: InformationItemProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/40 p-3">
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-card text-primary shadow-sm">
        <Icon className="size-4" />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-semibold text-foreground">
          {value}
        </p>
      </div>
    </div>
  );
}