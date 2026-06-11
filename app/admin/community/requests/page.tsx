"use client";

import * as React from "react";
import { type PaginationState, type SortingState } from "@tanstack/react-table";
import { LoaderCircle } from "lucide-react";

import type { AdminCommunityLimitUser } from "@/types/community-request";

import {
  useGetCommunityLimitUsersQuery,
  useUpdateUserCommunityLimitMutation,
} from "@/lib/redux/services/community-api";

import { DataTable } from "@/components/common/data-table";
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

import { createCommunityRequestColumns } from "@/components/column/communityrequest-column";

function getApiErrorMessage(error: unknown) {
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

    if (typeof data?.message === "string") {
      return data.message;
    }
  }

  return "Could not increase community limit.";
}

export default function CommunityRequestsPage() {
  const [search, setSearch] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [selectedUser, setSelectedUser] =
    React.useState<AdminCommunityLimitUser | null>(null);

  const [newLimit, setNewLimit] = React.useState("");
  const [errorMessage, setErrorMessage] =
    React.useState<string | null>(null);

  /*
   * Small delay before API search call.
   * This prevents sending a new request for every key press.
   */
  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [search]);

  const queryParams = React.useMemo(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      ...(debouncedSearch
        ? {
            search: debouncedSearch,
          }
        : {}),
    }),
    [
      pagination.pageIndex,
      pagination.pageSize,
      debouncedSearch,
    ],
  );

  /*
   * GET /admin/communities/limit-users
   */
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCommunityLimitUsersQuery(queryParams);

  /*
   * PATCH /admin/communities/users/:targetUserId/community-limit
   */
  const [
    updateUserCommunityLimit,
    { isLoading: isUpdating },
  ] = useUpdateUserCommunityLimitMutation();

  const data = response?.data ?? [];
  const total = response?.meta.total ?? 0;
  const totalPages = response?.meta.totalPages ?? 1;

  const columns = React.useMemo(
    () =>
      createCommunityRequestColumns({
        onIncreaseLimit: (user) => {
          setSelectedUser(user);
          setNewLimit(String(user.communityCreateLimit + 1));
          setErrorMessage(null);
        },
      }),
    [],
  );

  async function handleIncreaseLimit() {
    if (!selectedUser) {
      return;
    }

    const parsedLimit = Number(newLimit);

    if (
      !Number.isInteger(parsedLimit) ||
      parsedLimit <= selectedUser.communityCreateLimit
    ) {
      setErrorMessage(
        `New limit must be greater than ${selectedUser.communityCreateLimit}.`,
      );
      return;
    }

    try {
      setErrorMessage(null);

      await updateUserCommunityLimit({
        targetUserId: selectedUser.id,
        newLimit: parsedLimit,
      }).unwrap();

      /*
       * The mutation invalidates COMMUNITY_LIMIT_USERS,
       * so RTK Query automatically reloads the table.
       */
      setSelectedUser(null);
      setNewLimit("");
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Community Requests
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            View user community allowances and increase limits when required.
          </p>
        </div>

        {isError && (
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
          >
            Try Again
          </Button>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        filterPlaceholder="Search user name or email..."
        emptyMessage={
          isError
            ? "Could not load community requests."
            : "No users found."
        }
        loadingMessage="Loading community requests..."
        resourceLabel="users"
        isLoading={isLoading}
        isFetching={isFetching}
        server={{
          rowCount: total,
          pageCount: totalPages,
          pagination,
          onPaginationChange: setPagination,
          sorting,
          onSortingChange: setSorting,
          searchValue: search,
          onSearchChange: setSearch,
        }}
      />

      <Dialog
        open={Boolean(selectedUser)}
        onOpenChange={(open) => {
          if (!open && !isUpdating) {
            setSelectedUser(null);
            setNewLimit("");
            setErrorMessage(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[440px]">
          <DialogHeader>
            <DialogTitle>
              Increase Community Limit
            </DialogTitle>

            <DialogDescription>
              Increase the community creation allowance for{" "}
              <span className="font-medium text-foreground">
                {selectedUser?.name}
              </span>
              .
            </DialogDescription>
          </DialogHeader>

          {selectedUser && (
            <div className="space-y-4 py-2">
              <div className="rounded-lg border border-border bg-secondary/40 p-4">
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Created
                    </p>

                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {selectedUser.communityCreated}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Current Limit
                    </p>

                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {selectedUser.communityCreateLimit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Available
                    </p>

                    <p className="mt-1 text-lg font-semibold text-foreground">
                      {selectedUser.available}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="newLimit">
                  New community limit
                </Label>

                <Input
                  id="newLimit"
                  type="number"
                  min={selectedUser.communityCreateLimit + 1}
                  value={newLimit}
                  onChange={(event) => {
                    setNewLimit(event.target.value);
                    setErrorMessage(null);
                  }}
                  placeholder="Enter new limit"
                />

                {errorMessage && (
                  <p className="text-sm text-destructive">
                    {errorMessage}
                  </p>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setSelectedUser(null);
                setNewLimit("");
                setErrorMessage(null);
              }}
              disabled={isUpdating}
            >
              Cancel
            </Button>

            <Button
              type="button"
              onClick={handleIncreaseLimit}
              disabled={isUpdating}
            >
              {isUpdating && (
                <LoaderCircle className="mr-2 size-4 animate-spin" />
              )}

              Confirm Increase
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}