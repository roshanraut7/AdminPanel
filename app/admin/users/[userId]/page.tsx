"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import {
  ArrowLeft,
  Ban,
  RefreshCw,
  ShieldCheck,
  Trash2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  BetterAuthAdminUser,
  getApiErrorMessage,
  mapBetterAuthUser,
} from "@/lib/admin-user";

import AdminUserProfileView from "@/components/user-profile";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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

import type { AdminUser } from "@/types/user";

type BanDuration =
  | "PERMANENT"
  | "ONE_DAY"
  | "SEVEN_DAYS"
  | "THIRTY_DAYS";

function getBanDurationSeconds(
  duration: BanDuration,
): number | undefined {
  if (duration === "ONE_DAY") {
    return 60 * 60 * 24;
  }

  if (duration === "SEVEN_DAYS") {
    return 60 * 60 * 24 * 7;
  }

  if (
    duration === "THIRTY_DAYS"
  ) {
    return 60 * 60 * 24 * 30;
  }

  return undefined;
}

function formatDateTime(
  value: string | null,
): string {
  if (!value) {
    return "Never";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );
}

export default function AdminUserProfilePage() {
  const router = useRouter();

  const params =
    useParams<{
      userId: string;
    }>();

  const userId = params.userId;

  const { data: currentSession } =
    authClient.useSession();

  const currentUserId =
    currentSession?.user?.id ?? null;

  const [user, setUser] =
    useState<AdminUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isActionLoading,
    setIsActionLoading,
  ] = useState(false);

  const [isNotFound, setIsNotFound] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [banDialogOpen, setBanDialogOpen] =
    useState(false);

  const [
    unbanDialogOpen,
    setUnbanDialogOpen,
  ] = useState(false);

  const [
    deleteDialogOpen,
    setDeleteDialogOpen,
  ] = useState(false);

  const [banReason, setBanReason] =
    useState("");

  const [
    banDuration,
    setBanDuration,
  ] =
    useState<BanDuration>(
      "PERMANENT",
    );

  const [
    dialogError,
    setDialogError,
  ] = useState<string | null>(null);

  const loadUser =
    useCallback(async () => {
      if (!userId) {
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);
      setIsNotFound(false);

      try {
        const { data, error } =
          await authClient.admin.getUser(
            {
              query: {
                id: userId,
              },
            },
          );

        if (error) {
          if (error.status === 404) {
            setIsNotFound(true);
            setUser(null);

            return;
          }

          throw new Error(
            getApiErrorMessage(
              error,
              "Unable to load user.",
            ),
          );
        }

        if (!data) {
          setIsNotFound(true);
          setUser(null);

          return;
        }

        setUser(
          mapBetterAuthUser(
            data as BetterAuthAdminUser,
          ),
        );
      } catch (error) {
        console.error(
          "Unable to load user:",
          error,
        );

        setUser(null);

        setErrorMessage(
          getApiErrorMessage(
            error,
            "Unable to load user.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, [userId]);

  useEffect(() => {
    void loadUser();
  }, [loadUser]);

  const isCurrentUser =
    Boolean(
      user &&
        currentUserId &&
        user.id === currentUserId,
    );

  const handleOpenBanDialog =
    () => {
      if (!user) {
        return;
      }

      if (isCurrentUser) {
        setErrorMessage(
          "You cannot ban your own administrator account.",
        );

        return;
      }

      setBanReason("");
      setBanDuration("PERMANENT");
      setDialogError(null);
      setBanDialogOpen(true);
    };

  const handleConfirmBan =
    async () => {
      if (
        !user ||
        isActionLoading
      ) {
        return;
      }

      if (isCurrentUser) {
        setDialogError(
          "You cannot ban yourself.",
        );

        return;
      }

      const cleanReason =
        banReason.trim();

      if (
        cleanReason.length < 3
      ) {
        setDialogError(
          "Please enter a clear ban reason.",
        );

        return;
      }

      setIsActionLoading(true);
      setDialogError(null);

      try {
        const expiresIn =
          getBanDurationSeconds(
            banDuration,
          );

        const payload: {
          userId: string;
          banReason: string;
          banExpiresIn?: number;
        } = {
          userId: user.id,
          banReason: cleanReason,
        };

        if (expiresIn) {
          payload.banExpiresIn =
            expiresIn;
        }

        const { error } =
          await authClient.admin.banUser(
            payload,
          );

        if (error) {
          throw new Error(
            getApiErrorMessage(
              error,
              "Unable to ban user.",
            ),
          );
        }

        setBanDialogOpen(false);
        setBanReason("");
        setErrorMessage(null);

        await loadUser();
      } catch (error) {
        console.error(
          "Unable to ban user:",
          error,
        );

        setDialogError(
          getApiErrorMessage(
            error,
            "Unable to ban user.",
          ),
        );
      } finally {
        setIsActionLoading(false);
      }
    };

  const handleConfirmUnban =
    async () => {
      if (
        !user ||
        isActionLoading
      ) {
        return;
      }

      setIsActionLoading(true);
      setDialogError(null);

      try {
        const { error } =
          await authClient.admin.unbanUser(
            {
              userId: user.id,
            },
          );

        if (error) {
          throw new Error(
            getApiErrorMessage(
              error,
              "Unable to unban user.",
            ),
          );
        }

        setUnbanDialogOpen(false);
        setErrorMessage(null);

        await loadUser();
      } catch (error) {
        console.error(
          "Unable to unban user:",
          error,
        );

        setDialogError(
          getApiErrorMessage(
            error,
            "Unable to unban user.",
          ),
        );
      } finally {
        setIsActionLoading(false);
      }
    };

  const handleConfirmDelete =
    async () => {
      if (
        !user ||
        isActionLoading
      ) {
        return;
      }

      if (isCurrentUser) {
        setDialogError(
          "You cannot delete your own administrator account.",
        );

        return;
      }

      setIsActionLoading(true);
      setDialogError(null);

      try {
        const { error } =
          await authClient.admin.removeUser(
            {
              userId: user.id,
            },
          );

        if (error) {
          throw new Error(
            getApiErrorMessage(
              error,
              "Unable to delete user.",
            ),
          );
        }

        setDeleteDialogOpen(false);

        router.replace(
          "/admin/users",
        );

        router.refresh();
      } catch (error) {
        console.error(
          "Unable to delete user:",
          error,
        );

        setDialogError(
          getApiErrorMessage(
            error,
            "Unable to delete user.",
          ),
        );
      } finally {
        setIsActionLoading(false);
      }
    };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <RefreshCw className="size-4 animate-spin" />

          Loading user...
        </div>
      </div>
    );
  }

  if (isNotFound) {
    return (
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <h1 className="text-xl font-semibold text-foreground">
          User not found
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          The user may have been
          deleted or the ID is invalid.
        </p>

        <Button
          type="button"
          className="mt-5"
          onClick={() =>
            router.push(
              "/admin/users",
            )
          }
        >
          Back to users
        </Button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6">
        <p className="text-sm text-destructive">
          {errorMessage ||
            "Unable to load user."}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-4"
          onClick={() =>
            void loadUser()
          }
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="-mt-6 space-y-6">
        <div className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                router.push(
                  "/admin/users",
                )
              }
            >
              <ArrowLeft className="size-4" />

              <span className="sr-only">
                Back to users
              </span>
            </Button>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">
                  {user.fullName}
                </h1>

                <Badge
                  variant={
                    user.status ===
                    "BANNED"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {user.status}
                </Badge>

                <Badge variant="outline">
                  {user.role}
                </Badge>

                {isCurrentUser ? (
                  <Badge variant="secondary">
                    Your account
                  </Badge>
                ) : null}
              </div>

              <p className="mt-1 text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() =>
                void loadUser()
              }
            >
              <RefreshCw className="mr-2 size-4" />

              Refresh
            </Button>

            {user.status ===
            "BANNED" ? (
              <Button
                type="button"
                disabled={
                  isActionLoading ||
                  isCurrentUser
                }
                onClick={() => {
                  setDialogError(
                    null,
                  );

                  setUnbanDialogOpen(
                    true,
                  );
                }}
                className="bg-emerald-600 text-white hover:bg-emerald-700"
              >
                <ShieldCheck className="mr-2 size-4" />

                Unban user
              </Button>
            ) : (
              <Button
                type="button"
                variant="outline"
                disabled={
                  isActionLoading ||
                  isCurrentUser
                }
                onClick={
                  handleOpenBanDialog
                }
                className="border-amber-300 text-amber-700 hover:bg-amber-50 hover:text-amber-800"
              >
                <Ban className="mr-2 size-4" />

                Ban user
              </Button>
            )}

            <Button
              type="button"
              variant="destructive"
              disabled={
                isActionLoading ||
                isCurrentUser
              }
              onClick={() => {
                setDialogError(null);

                setDeleteDialogOpen(
                  true,
                );
              }}
            >
              <Trash2 className="mr-2 size-4" />

              Delete user
            </Button>
          </div>
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        {user.banned ||
        user.banReason ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5">
            <div className="flex items-center gap-2">
              <Ban className="size-5 text-red-700" />

              <h2 className="font-semibold text-red-900">
                Ban information
              </h2>
            </div>

            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-red-700">
                  Reason
                </dt>

                <dd className="mt-1 text-sm text-red-950">
                  {user.banReason ||
                    "No reason provided"}
                </dd>
              </div>

              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-red-700">
                  Expires
                </dt>

                <dd className="mt-1 text-sm text-red-950">
                  {user.banExpires
                    ? formatDateTime(
                        user.banExpires,
                      )
                    : "Permanent"}
                </dd>
              </div>
            </dl>
          </div>
        ) : null}

        <AdminUserProfileView
          user={user}
          users={[user]}
        />
      </div>

      {/* Ban dialog */}
      <AlertDialog
        open={banDialogOpen}
        onOpenChange={(open) => {
          if (!isActionLoading) {
            setBanDialogOpen(open);

            if (!open) {
              setBanReason("");
              setDialogError(null);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ban {user.fullName}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              The user will be unable
              to sign in and their
              existing sessions will be
              revoked.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="profile-ban-reason"
                className="text-sm font-medium"
              >
                Ban reason
              </label>

              <textarea
                id="profile-ban-reason"
                value={banReason}
                onChange={(event) =>
                  setBanReason(
                    event.target.value,
                  )
                }
                rows={4}
                maxLength={500}
                disabled={
                  isActionLoading
                }
                placeholder="Enter the reason for banning this user"
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-ban-duration"
                className="text-sm font-medium"
              >
                Ban duration
              </label>

              <select
                id="profile-ban-duration"
                value={banDuration}
                disabled={
                  isActionLoading
                }
                onChange={(event) =>
                  setBanDuration(
                    event.target
                      .value as BanDuration,
                  )
                }
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="PERMANENT">
                  Permanent
                </option>

                <option value="ONE_DAY">
                  1 day
                </option>

                <option value="SEVEN_DAYS">
                  7 days
                </option>

                <option value="THIRTY_DAYS">
                  30 days
                </option>
              </select>
            </div>

            {dialogError ? (
              <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {dialogError}
              </p>
            ) : null}
          </div>

          <AlertDialogFooter> 
            <AlertDialogCancel
              disabled={
                isActionLoading
              }
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                isActionLoading
              }
              onClick={(event) => {
                event.preventDefault();

                void handleConfirmBan();
              }}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              {isActionLoading
                ? "Banning..."
                : "Ban user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Unban dialog */}
      <AlertDialog
        open={unbanDialogOpen}
        onOpenChange={(open) => {
          if (!isActionLoading) {
            setUnbanDialogOpen(open);
            setDialogError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Unban {user.fullName}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This user will be allowed
              to sign in again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {user.banReason ? (
            <div className="rounded-md border bg-muted/40 p-3">
              <p className="text-xs font-semibold uppercase text-muted-foreground">
                Previous reason
              </p>

              <p className="mt-1 text-sm">
                {user.banReason}
              </p>
            </div>
          ) : null}

          {dialogError ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {dialogError}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                isActionLoading
              }
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                isActionLoading
              }
              onClick={(event) => {
                event.preventDefault();

                void handleConfirmUnban();
              }}
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {isActionLoading
                ? "Unbanning..."
                : "Unban user"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isActionLoading) {
            setDeleteDialogOpen(open);
            setDialogError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {user.fullName}?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This permanently deletes
              the user, sessions,
              account records and related
              data that use cascade
              deletion. This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {dialogError ? (
            <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {dialogError}
            </p>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={
                isActionLoading
              }
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={
                isActionLoading
              }
              onClick={(event) => {
                event.preventDefault();

                void handleConfirmDelete();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isActionLoading
                ? "Deleting..."
                : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}