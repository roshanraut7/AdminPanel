"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  Ban,
  RefreshCw,
  UsersRound,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

import {
  BetterAuthAdminUser,
  getApiErrorMessage,
  mapBetterAuthUser,
} from "@/lib/admin-user";

import { DataTable } from "@/components/common/data-table";
import { StatCard } from "@/components/common/stats-card";
import { UserGrowthChartCard } from "@/components/charts/user-barchart";
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

import { createUserColumns } from "@/components/column/user-column";

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

export default function AdminUsersPage() {
  const router = useRouter();

  const { data: currentSession } =
    authClient.useSession();

  const currentUserId =
    currentSession?.user?.id ?? null;

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [totalUsers, setTotalUsers] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [
    isActionLoading,
    setIsActionLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [banUser, setBanUser] =
    useState<AdminUser | null>(null);

  const [
    unbanUser,
    setUnbanUser,
  ] = useState<AdminUser | null>(
    null,
  );

  const [
    deleteUser,
    setDeleteUser,
  ] = useState<AdminUser | null>(
    null,
  );

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

  const loadUsers =
    useCallback(async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const { data, error } =
          await authClient.admin.listUsers(
            {
              query: {
                limit: 100,
                offset: 0,
                sortBy: "createdAt",
                sortDirection:
                  "desc",
              },
            },
          );

        if (error) {
          throw new Error(
            getApiErrorMessage(
              error,
              "Unable to load users.",
            ),
          );
        }

        const rawUsers =
          (data?.users ??
            []) as BetterAuthAdminUser[];

        const mappedUsers =
          rawUsers.map(
            mapBetterAuthUser,
          );

        setUsers(mappedUsers);

        setTotalUsers(
          data?.total ??
            mappedUsers.length,
        );
      } catch (error) {
        console.error(
          "Unable to load users:",
          error,
        );

        setUsers([]);
        setTotalUsers(0);

        setErrorMessage(
          getApiErrorMessage(
            error,
            "Unable to load users.",
          ),
        );
      } finally {
        setIsLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const bannedUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.status ===
          "BANNED",
      ).length,
    [users],
  );

  const bannedPercentage =
    totalUsers > 0
      ? Math.round(
          (bannedUsers /
            totalUsers) *
            100,
        )
      : 0;

  const handleViewProfile =
    useCallback(
      (user: AdminUser) => {
        router.push(
          `/admin/users/${user.id}`,
        );
      },
      [router],
    );

  const handleOpenBanDialog =
    useCallback(
      (user: AdminUser) => {
        if (
          user.id === currentUserId
        ) {
          setErrorMessage(
            "You cannot ban your own administrator account.",
          );

          return;
        }

        setBanReason("");
        setBanDuration(
          "PERMANENT",
        );
        setDialogError(null);
        setBanUser(user);
      },
      [currentUserId],
    );

  const handleOpenUnbanDialog =
    useCallback(
      (user: AdminUser) => {
        setDialogError(null);
        setUnbanUser(user);
      },
      [],
    );

  const handleOpenDeleteDialog =
    useCallback(
      (user: AdminUser) => {
        if (
          user.id === currentUserId
        ) {
          setErrorMessage(
            "You cannot delete your own administrator account.",
          );

          return;
        }

        setDialogError(null);
        setDeleteUser(user);
      },
      [currentUserId],
    );

  const handleConfirmBan =
    async () => {
      if (
        !banUser ||
        isActionLoading
      ) {
        return;
      }

      if (
        banUser.id ===
        currentUserId
      ) {
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
          userId: banUser.id,
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

        setBanUser(null);
        setBanReason("");
        setErrorMessage(null);

        await loadUsers();
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
        !unbanUser ||
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
              userId:
                unbanUser.id,
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

        setUnbanUser(null);
        setErrorMessage(null);

        await loadUsers();
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
        !deleteUser ||
        isActionLoading
      ) {
        return;
      }

      if (
        deleteUser.id ===
        currentUserId
      ) {
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
              userId:
                deleteUser.id,
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

        setDeleteUser(null);
        setErrorMessage(null);

        await loadUsers();
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

  const columns = useMemo(
    () =>
      createUserColumns({
        currentUserId,

        onViewProfile:
          handleViewProfile,

        onBanUser:
          handleOpenBanDialog,

        onUnbanUser:
          handleOpenUnbanDialog,

        onDeleteUser:
          handleOpenDeleteDialog,
      }),
    [
      currentUserId,
      handleViewProfile,
      handleOpenBanDialog,
      handleOpenUnbanDialog,
      handleOpenDeleteDialog,
    ],
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Users
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage registered users,
              bans and account actions.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            disabled={isLoading}
            onClick={() =>
              void loadUsers()
            }
          >
            <RefreshCw
              className={`mr-2 size-4 ${
                isLoading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh
          </Button>
        </div>

        {errorMessage ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {errorMessage}
          </div>
        ) : null}

        <div className="grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
          <UserGrowthChartCard />

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
            <StatCard
              title="Total users"
              value={`${totalUsers}`}
              change="+0%"
              helper="All registered users"
              icon={UsersRound}
              tone="info"
            />

            <StatCard
              title="Banned users"
              value={`${bannedUsers}`}
              change={`${bannedPercentage}%`}
              helper="Currently banned users"
              icon={Ban}
              tone="danger"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={users}
          filterKey="fullName"
          filterPlaceholder="Search users..."
          resourceLabel="users"
          emptyMessage={
            isLoading
              ? "Loading users..."
              : "No users found."
          }
          pageSize={10}
        />
      </div>

      {/* Ban dialog */}
      <AlertDialog
        open={Boolean(banUser)}
        onOpenChange={(open) => {
          if (
            !open &&
            !isActionLoading
          ) {
            setBanUser(null);
            setBanReason("");
            setDialogError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Ban this user?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will prevent{" "}
              <span className="font-medium text-foreground">
                {banUser?.fullName ||
                  "this user"}
              </span>{" "}
              from signing in and revoke
              their existing sessions.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label
                htmlFor="ban-reason"
                className="text-sm font-medium text-foreground"
              >
                Ban reason
              </label>

              <textarea
                id="ban-reason"
                value={banReason}
                onChange={(event) =>
                  setBanReason(
                    event.target.value,
                  )
                }
                placeholder="Example: Repeated spam or violation of community rules"
                rows={4}
                maxLength={500}
                disabled={
                  isActionLoading
                }
                className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
              />

              <p className="text-right text-xs text-muted-foreground">
                {banReason.length}/500
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="ban-duration"
                className="text-sm font-medium text-foreground"
              >
                Ban duration
              </label>

              <select
                id="ban-duration"
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
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
        open={Boolean(unbanUser)}
        onOpenChange={(open) => {
          if (
            !open &&
            !isActionLoading
          ) {
            setUnbanUser(null);
            setDialogError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Unban this user?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This will allow{" "}
              <span className="font-medium text-foreground">
                {unbanUser?.fullName ||
                  "this user"}
              </span>{" "}
              to sign in again.
            </AlertDialogDescription>
          </AlertDialogHeader>

          {unbanUser?.banReason ? (
            <div className="rounded-md border border-border bg-muted/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Current ban reason
              </p>

              <p className="mt-1 text-sm text-foreground">
                {
                  unbanUser.banReason
                }
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
        open={Boolean(deleteUser)}
        onOpenChange={(open) => {
          if (
            !open &&
            !isActionLoading
          ) {
            setDeleteUser(null);
            setDialogError(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete this user?
            </AlertDialogTitle>

            <AlertDialogDescription>
              This permanently deletes{" "}
              <span className="font-medium text-foreground">
                {deleteUser?.fullName ||
                  "this user"}
              </span>{" "}
              and cannot be undone.
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