"use client";

import { useCallback, useMemo, useState } from "react";
import { Ban, UsersRound } from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import { StatCard } from "@/components/common/stats-card";
import { UserGrowthChartCard } from "@/components/charts/user-barchart";
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
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { mockAdminUsers } from "@/mocks/user-mock";
import type { AdminUser } from "@/types/user";

import { createUserColumns } from "@/components/column/user-column";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(mockAdminUsers);

  const [profileUser, setProfileUser] = useState<AdminUser | null>(null);
  const [banUser, setBanUser] = useState<AdminUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null);

  const totalUsers = users.length;

  const bannedUsers = useMemo(() => {
    return users.filter((user) => user.status === "BANNED").length;
  }, [users]);

  const bannedPercentage = totalUsers
    ? Math.round((bannedUsers / totalUsers) * 100)
    : 0;

  const handleViewProfile = useCallback((user: AdminUser) => {
    setProfileUser(user);
  }, []);

  const handleOpenBanDialog = useCallback((user: AdminUser) => {
    setBanUser(user);
  }, []);

  const handleOpenDeleteDialog = useCallback((user: AdminUser) => {
    setDeleteUser(user);
  }, []);

  const handleConfirmBan = () => {
    if (!banUser) return;

    setUsers((previousUsers) =>
      previousUsers.map((user) =>
        user.id === banUser.id
          ? {
              ...user,
              status: "BANNED",
            }
          : user,
      ),
    );

    setBanUser(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteUser) return;

    setUsers((previousUsers) =>
      previousUsers.filter((user) => user.id !== deleteUser.id),
    );

    setDeleteUser(null);
  };

  const columns = useMemo(
    () =>
      createUserColumns({
        onViewProfile: handleViewProfile,
        onBanUser: handleOpenBanDialog,
        onDeleteUser: handleOpenDeleteDialog,
      }),
    [handleViewProfile, handleOpenBanDialog, handleOpenDeleteDialog],
  );

  return (
    <>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Users
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage users, document verification, community activity and account
            actions.
          </p>
        </div>

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
              helper="Users currently banned"
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
          emptyMessage="No users found."
          pageSize={10}
        />
      </div>

      <Dialog
        open={Boolean(profileUser)}
        onOpenChange={(open) => {
          if (!open) setProfileUser(null);
        }}
      >
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>User profile</DialogTitle>
            <DialogDescription>
              Basic user information from mock data.
            </DialogDescription>
          </DialogHeader>

          {profileUser ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
                {profileUser.avatarUrl ? (
                  <img
                    src={profileUser.avatarUrl}
                    alt={profileUser.fullName}
                    className="size-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {profileUser.fullName
                      .split(" ")
                      .map((item) => item[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-foreground">
                    {profileUser.fullName}
                  </h3>

                  <p className="text-sm text-muted-foreground">
                    {profileUser.email}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard label="Status" value={profileUser.status} />
                <InfoCard
                  label="Document"
                  value={profileUser.documentVerification}
                />
                <InfoCard label="District" value={profileUser.district} />
                <InfoCard
                  label="Communities"
                  value={`${profileUser.communityCount}`}
                />
                <InfoCard label="Posts" value={`${profileUser.postCount}`} />
                <InfoCard
                  label="Joined"
                  value={new Date(profileUser.joinedAt).toLocaleDateString(
                    "en-GB",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    },
                  )}
                />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(banUser)}
        onOpenChange={(open) => {
          if (!open) setBanUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Ban this user?</AlertDialogTitle>

            <AlertDialogDescription>
              This will change{" "}
              <span className="font-medium text-foreground">
                {banUser?.fullName || "this user"}
              </span>{" "}
              status to banned. You can later connect this action to your
              backend API.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmBan}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              Ban user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={Boolean(deleteUser)}
        onOpenChange={(open) => {
          if (!open) setDeleteUser(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this user?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteUser?.fullName || "this user"}
              </span>{" "}
              from the mock users table.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>

      <div className="mt-1">
        <Badge variant="outline">{value}</Badge>
      </div>
    </div>
  );
}