"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Loader2,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import { toast } from "sonner";

import type { AdminCommunity } from "@/types/admin-community";

import { useDeleteAdminCommunityMutation } from "@/lib/redux/services/community-api";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type AdminDeleteCommunityDialogProps = {
  community: AdminCommunity | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
};

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

  return "Could not delete the community";
}

export function AdminDeleteCommunityDialog({
  community,
  open,
  onOpenChange,
  onDeleted,
}: AdminDeleteCommunityDialogProps) {
  const [reason, setReason] =
    useState("");

  const [
    confirmationName,
    setConfirmationName,
  ] = useState("");

  const [
    deleteCommunity,
    { isLoading },
  ] =
    useDeleteAdminCommunityMutation();

  useEffect(() => {
    if (!open) {
      setReason("");
      setConfirmationName("");
    }
  }, [open, community?.id]);

  if (!community) {
    return null;
  }

  const normalizedConfirmation =
    confirmationName
      .trim()
      .toLowerCase();

  const normalizedCommunityName =
    community.name
      .trim()
      .toLowerCase();

  const nameMatches =
    normalizedConfirmation ===
    normalizedCommunityName;

  const canDelete =
    nameMatches &&
    reason.trim().length >= 3 &&
    !isLoading;

  const handleDelete = async () => {
    if (!canDelete) {
      return;
    }

    try {
      const response =
        await deleteCommunity({
          communityId:
            community.id,

          reason:
            reason.trim(),

          confirmationName:
            confirmationName.trim(),
        }).unwrap();

      toast.success(
        response.message,
      );

      onOpenChange(false);
      onDeleted?.();
    } catch (error) {
      toast.error(
        getApiErrorMessage(error),
      );
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!isLoading) {
          onOpenChange(nextOpen);
        }
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="size-5" />
            Permanently delete community
          </DialogTitle>

          <DialogDescription>
            This permanently deletes the
            community and its related posts,
            memberships, join requests and
            management information.
          </DialogDescription>
        </DialogHeader>

        <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-semibold text-foreground">
                This action cannot be undone
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                You are deleting{" "}
                <strong className="text-foreground">
                  {community.name}
                </strong>
                .
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-delete-reason">
            Deletion reason
          </Label>

          <Textarea
            id="community-delete-reason"
            value={reason}
            onChange={(event) =>
              setReason(
                event.target.value,
              )
            }
            placeholder="Explain why this community is being deleted..."
            rows={4}
            disabled={isLoading}
            className="resize-none"
          />

          <p className="text-xs text-muted-foreground">
            Minimum 3 characters.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="community-confirmation-name">
            Type{" "}
            <strong>
              {community.name}
            </strong>{" "}
            to confirm
          </Label>

          <Input
            id="community-confirmation-name"
            value={confirmationName}
            onChange={(event) =>
              setConfirmationName(
                event.target.value,
              )
            }
            placeholder={community.name}
            autoComplete="off"
            disabled={isLoading}
          />
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            disabled={!canDelete}
            onClick={handleDelete}
          >
            {isLoading ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}

            Delete permanently
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}