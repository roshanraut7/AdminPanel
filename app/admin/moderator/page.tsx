"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  Ban,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import { StatCard } from "@/components/common/stats-card";
import {
  createModeratorColumns,
  type AdminModerator,
  type ModeratorPermission,
} from "@/components/column/moderator-column";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type AssignableUser = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string;
};

type CommunityOption = {
  id: string;
  name: string;
};

const defaultPermissions: ModeratorPermission = {
  canManageMembers: true,
  canManagePosts: true,
  canManageComments: false,
  canManageReports: false,
};

const mockUsers: AssignableUser[] = [
  {
    id: "user-1",
    fullName: "Aayush Shrestha",
    email: "aayush@example.com",
  },
  {
    id: "user-2",
    fullName: "Sujan Gurung",
    email: "sujan@example.com",
  },
  {
    id: "user-3",
    fullName: "Pratiksha Karki",
    email: "pratiksha@example.com",
  },
  {
    id: "user-4",
    fullName: "Bikash Rai",
    email: "bikash@example.com",
  },
  {
    id: "user-5",
    fullName: "Nishan Tamang",
    email: "nishan@example.com",
  },
  {
    id: "user-6",
    fullName: "Anjali Thapa",
    email: "anjali@example.com",
  },
];

const mockCommunities: CommunityOption[] = [
  {
    id: "community-1",
    name: "Kathmandu Community",
  },
  {
    id: "community-2",
    name: "Pokhara Community",
  },
  {
    id: "community-3",
    name: "Lalitpur Community",
  },
];

const mockModerators: AdminModerator[] = [
  {
    id: "mod-1",
    fullName: "Aayush Shrestha",
    email: "aayush@example.com",
    role: "OWNER",
    status: "ACTIVE",
    moderatedCommunities: 4,
    joinedAt: "2025-11-12T10:20:00.000Z",
    permissions: {
      canManageMembers: true,
      canManagePosts: true,
      canManageComments: true,
      canManageReports: true,
    },
  },
  {
    id: "mod-2",
    fullName: "Sujan Gurung",
    email: "sujan@example.com",
    role: "MODERATOR",
    status: "ACTIVE",
    moderatedCommunities: 2,
    joinedAt: "2026-01-05T09:15:00.000Z",
    permissions: {
      canManageMembers: true,
      canManagePosts: true,
      canManageComments: false,
      canManageReports: true,
    },
  },
  {
    id: "mod-3",
    fullName: "Pratiksha Karki",
    email: "pratiksha@example.com",
    role: "MODERATOR",
    status: "PENDING",
    moderatedCommunities: 1,
    joinedAt: "2026-02-18T14:40:00.000Z",
    permissions: {
      canManageMembers: false,
      canManagePosts: true,
      canManageComments: true,
      canManageReports: false,
    },
  },
  {
    id: "mod-4",
    fullName: "Bikash Rai",
    email: "bikash@example.com",
    role: "MODERATOR",
    status: "SUSPENDED",
    moderatedCommunities: 1,
    joinedAt: "2026-03-22T08:10:00.000Z",
    permissions: {
      canManageMembers: false,
      canManagePosts: false,
      canManageComments: true,
      canManageReports: false,
    },
  },
];

export default function ModeratorPage() {
  const [moderators, setModerators] =
    useState<AdminModerator[]>(mockModerators);

  const [selectedModerator, setSelectedModerator] =
    useState<AdminModerator | null>(null);

  const [editablePermissions, setEditablePermissions] =
    useState<ModeratorPermission | null>(null);

  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [permissionDialogOpen, setPermissionDialogOpen] = useState(false);
  const [suspendDialogOpen, setSuspendDialogOpen] = useState(false);
  const [removeDialogOpen, setRemoveDialogOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [selectedCommunityId, setSelectedCommunityId] =
    useState<string | undefined>();
  const [selectedRole, setSelectedRole] =
    useState<AdminModerator["role"]>("MODERATOR");

  const [newModeratorPermissions, setNewModeratorPermissions] =
    useState<ModeratorPermission>(defaultPermissions);

  const availableUsers = useMemo(() => {
    const moderatorEmails = new Set(
      moderators.map((moderator) => moderator.email),
    );

    return mockUsers.filter((user) => !moderatorEmails.has(user.email));
  }, [moderators]);

  const stats = useMemo(() => {
    const active = moderators.filter(
      (item) => item.status === "ACTIVE",
    ).length;

    const suspended = moderators.filter(
      (item) => item.status === "SUSPENDED",
    ).length;

    return {
      total: moderators.length,
      active,
      suspended,
    };
  }, [moderators]);

  const columns = useMemo(
    () =>
      createModeratorColumns({
        onEditPermission: (moderator) => {
          setSelectedModerator(moderator);
          setEditablePermissions({ ...moderator.permissions });
          setPermissionDialogOpen(true);
        },
        onSuspendModerator: (moderator) => {
          setSelectedModerator(moderator);
          setSuspendDialogOpen(true);
        },
        onRemoveModerator: (moderator) => {
          setSelectedModerator(moderator);
          setRemoveDialogOpen(true);
        },
        onViewAnalysis: (moderator) => {
          setSelectedModerator(moderator);
          console.log("View analysis", moderator);
        },
      }),
    [],
  );

  const handleOpenAssignDialog = () => {
    setSelectedUserId(undefined);
    setSelectedCommunityId(undefined);
    setSelectedRole("MODERATOR");
    setNewModeratorPermissions(defaultPermissions);
    setAssignDialogOpen(true);
  };

  const handleCancelAssignModerator = () => {
    setAssignDialogOpen(false);
    setSelectedUserId(undefined);
    setSelectedCommunityId(undefined);
    setSelectedRole("MODERATOR");
    setNewModeratorPermissions(defaultPermissions);
  };

  const handleAssignPermissionChange = (
    key: keyof ModeratorPermission,
    value: boolean,
  ) => {
    setNewModeratorPermissions((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  const handleAssignModerator = () => {
    const selectedUser = mockUsers.find((user) => user.id === selectedUserId);

    if (!selectedUser || !selectedCommunityId) return;

    const newModerator: AdminModerator = {
      id: `mod-${Date.now()}`,
      fullName: selectedUser.fullName,
      email: selectedUser.email,
      avatarUrl: selectedUser.avatarUrl,
      role: selectedRole,
      status: "ACTIVE",
      moderatedCommunities: 1,
      joinedAt: new Date().toISOString(),
      permissions: newModeratorPermissions,
    };

    setModerators((previous) => [newModerator, ...previous]);
    handleCancelAssignModerator();
  };

  const handlePermissionChange = (
    key: keyof ModeratorPermission,
    value: boolean,
  ) => {
    setEditablePermissions((previous) => {
      if (!previous) return previous;

      return {
        ...previous,
        [key]: value,
      };
    });
  };

  const handleSavePermissions = () => {
    if (!selectedModerator || !editablePermissions) return;

    setModerators((previous) =>
      previous.map((item) =>
        item.id === selectedModerator.id
          ? {
              ...item,
              permissions: editablePermissions,
            }
          : item,
      ),
    );

    setPermissionDialogOpen(false);
    setSelectedModerator(null);
    setEditablePermissions(null);
  };

  const handleCancelPermissionEdit = () => {
    setPermissionDialogOpen(false);
    setSelectedModerator(null);
    setEditablePermissions(null);
  };

  const handleSuspendModerator = () => {
    if (!selectedModerator) return;

    setModerators((previous) =>
      previous.map((item) =>
        item.id === selectedModerator.id
          ? {
              ...item,
              status: "SUSPENDED",
            }
          : item,
      ),
    );

    setSuspendDialogOpen(false);
    setSelectedModerator(null);
  };

  const handleRemoveModerator = () => {
    if (!selectedModerator) return;

    setModerators((previous) =>
      previous.filter((item) => item.id !== selectedModerator.id),
    );

    setRemoveDialogOpen(false);
    setSelectedModerator(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground">
            Moderators
          </h1>

          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Manage community moderators, review their access level, and update
            moderation permissions from one place.
          </p>
        </div>

        <Button
          type="button"
          onClick={handleOpenAssignDialog}
          className="w-full sm:w-auto"
        >
          <UserCog className="mr-2 size-4" />
          Add moderator
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total moderators"
          value={String(stats.total)}
          change="+2"
          helper="Across all communities"
          icon={UsersRound}
          tone="info"
        />

        <StatCard
          title="Active moderators"
          value={String(stats.active)}
          change="+1"
          helper="Currently managing communities"
          icon={ShieldCheck}
          tone="success"
        />

        <StatCard
          title="Suspended moderators"
          value={String(stats.suspended)}
          change="-1"
          helper="Restricted moderator access"
          icon={AlertTriangle}
          tone="danger"
        />
      </div>

      <DataTable
        columns={columns}
        data={moderators}
        filterKey="fullName"
        filterPlaceholder="Search moderator by name..."
        emptyMessage="No moderators found."
        resourceLabel="moderators"
        pageSize={10}
      />

      <Dialog
        open={assignDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelAssignModerator();
            return;
          }

          setAssignDialogOpen(open);
        }}
      >
        <DialogContent className="border-border bg-card sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Assign moderator</DialogTitle>
            <DialogDescription>
              Select a user, choose the community, and assign moderator access.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Select user
                </p>

                <Select
                  value={selectedUserId}
                  onValueChange={setSelectedUserId}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue placeholder="Choose user" />
                  </SelectTrigger>

                  <SelectContent className="border-border bg-popover">
                    {availableUsers.length > 0 ? (
                      availableUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.fullName}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-user" disabled>
                        No users available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>

                {selectedUserId && (
                  <p className="text-xs text-muted-foreground">
                    {
                      mockUsers.find((user) => user.id === selectedUserId)
                        ?.email
                    }
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Select community
                </p>

                <Select
                  value={selectedCommunityId}
                  onValueChange={setSelectedCommunityId}
                >
                  <SelectTrigger className="border-border bg-card">
                    <SelectValue placeholder="Choose community" />
                  </SelectTrigger>

                  <SelectContent className="border-border bg-popover">
                    {mockCommunities.map((community) => (
                      <SelectItem key={community.id} value={community.id}>
                        {community.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground">
                Assign as
              </p>

              <Select
                value={selectedRole}
                onValueChange={(value) =>
                  setSelectedRole(value as AdminModerator["role"])
                }
              >
                <SelectTrigger className="border-border bg-card">
                  <SelectValue placeholder="Choose role" />
                </SelectTrigger>

                <SelectContent className="border-border bg-popover">
                  <SelectItem value="MODERATOR">Moderator</SelectItem>
                  <SelectItem value="OWNER">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <p className="text-sm font-semibold text-foreground">
                Moderator permissions
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Choose what this moderator can manage after assignment.
              </p>

              <div className="mt-4 space-y-3">
                <PermissionCheckbox
                  id="new-canManageMembers"
                  label="Manage members"
                  description="Allow this moderator to approve, remove, or manage community members."
                  checked={newModeratorPermissions.canManageMembers}
                  onCheckedChange={(value) =>
                    handleAssignPermissionChange("canManageMembers", value)
                  }
                />

                <PermissionCheckbox
                  id="new-canManagePosts"
                  label="Manage posts"
                  description="Allow this moderator to approve, hide, or remove posts."
                  checked={newModeratorPermissions.canManagePosts}
                  onCheckedChange={(value) =>
                    handleAssignPermissionChange("canManagePosts", value)
                  }
                />

                <PermissionCheckbox
                  id="new-canManageComments"
                  label="Manage comments"
                  description="Allow this moderator to review, hide, or remove comments."
                  checked={newModeratorPermissions.canManageComments}
                  onCheckedChange={(value) =>
                    handleAssignPermissionChange("canManageComments", value)
                  }
                />

                <PermissionCheckbox
                  id="new-canManageReports"
                  label="Manage reports"
                  description="Allow this moderator to review user reports and moderation reports."
                  checked={newModeratorPermissions.canManageReports}
                  onCheckedChange={(value) =>
                    handleAssignPermissionChange("canManageReports", value)
                  }
                />
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelAssignModerator}
                className="border-border bg-card"
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={handleAssignModerator}
                disabled={!selectedUserId || !selectedCommunityId}
              >
                Assign moderator
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={permissionDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleCancelPermissionEdit();
            return;
          }

          setPermissionDialogOpen(open);
        }}
      >
        <DialogContent className="border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit permission</DialogTitle>
            <DialogDescription>
              Select which moderator actions this user is allowed to perform.
            </DialogDescription>
          </DialogHeader>

          {selectedModerator && editablePermissions && (
            <div className="space-y-5">
              <div className="rounded-xl border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">
                  {selectedModerator.fullName}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedModerator.email}
                </p>
              </div>

              <div className="space-y-3">
                <PermissionCheckbox
                  id="edit-canManageMembers"
                  label="Manage members"
                  description="Allow this moderator to approve, remove, or manage community members."
                  checked={editablePermissions.canManageMembers}
                  onCheckedChange={(value) =>
                    handlePermissionChange("canManageMembers", value)
                  }
                />

                <PermissionCheckbox
                  id="edit-canManagePosts"
                  label="Manage posts"
                  description="Allow this moderator to approve, hide, or remove posts."
                  checked={editablePermissions.canManagePosts}
                  onCheckedChange={(value) =>
                    handlePermissionChange("canManagePosts", value)
                  }
                />

                <PermissionCheckbox
                  id="edit-canManageComments"
                  label="Manage comments"
                  description="Allow this moderator to review, hide, or remove comments."
                  checked={editablePermissions.canManageComments}
                  onCheckedChange={(value) =>
                    handlePermissionChange("canManageComments", value)
                  }
                />

                <PermissionCheckbox
                  id="edit-canManageReports"
                  label="Manage reports"
                  description="Allow this moderator to review user reports and moderation reports."
                  checked={editablePermissions.canManageReports}
                  onCheckedChange={(value) =>
                    handlePermissionChange("canManageReports", value)
                  }
                />
              </div>

              <div className="flex flex-col-reverse gap-2 border-t border-border pt-4 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancelPermissionEdit}
                  className="border-border bg-card"
                >
                  Cancel
                </Button>

                <Button type="button" onClick={handleSavePermissions}>
                  Save changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={suspendDialogOpen}
        onOpenChange={setSuspendDialogOpen}
      >
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Suspend moderator?</AlertDialogTitle>
            <AlertDialogDescription>
              This will suspend{" "}
              <span className="font-medium text-foreground">
                {selectedModerator?.fullName}
              </span>
              . They will no longer be able to use moderator permissions.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSuspendModerator}
              className="bg-amber-600 text-white hover:bg-amber-700"
            >
              <Ban className="mr-2 size-4" />
              Suspend
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={removeDialogOpen}
        onOpenChange={setRemoveDialogOpen}
      >
        <AlertDialogContent className="border-border bg-card">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove moderator?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove{" "}
              <span className="font-medium text-foreground">
                {selectedModerator?.fullName}
              </span>{" "}
              from the moderator list. This action can be connected with your
              backend remove moderator API.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveModerator}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function PermissionCheckbox({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-accent/50"
    >
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(value) => onCheckedChange(Boolean(value))}
        className="mt-0.5"
      />

      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{label}</p>
        <p className="text-xs leading-5 text-muted-foreground">
          {description}
        </p>
      </div>
    </label>
  );
}