"use client";

import {
  memo,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  type PaginationState,
  type SortingState,
} from "@tanstack/react-table";
import {
  Globe2,
  RefreshCcw,
  ShieldCheck,
  TriangleAlert,
  UsersRound,
} from "lucide-react";

import { AddCommunityForm } from "@/components/form/add-community";
import { DataTable } from "@/components/common/data-table";
import { communityColumns } from "@/components/column/community-column";
import { AddDistrictCommunityForm } from "@/components/form/add-district-community";
import {
  useGetAdminCommunitiesQuery,
  useGetMyCommunitiesQuery,
} from "@/lib/redux/services/community-api";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type {
  AdminCommunitySortBy,
  GetAdminCommunitiesParams,
} from "@/types/admin-community";

type CommunityTab = "all" | "mine";

const allowedSortFields: AdminCommunitySortBy[] = [
  "name",
  "createdAt",
  "updatedAt",
  "status",
  "visibility",
];

function getSortField(
  columnId?: string,
): AdminCommunitySortBy {
  if (
    columnId &&
    allowedSortFields.includes(
      columnId as AdminCommunitySortBy,
    )
  ) {
    return columnId as AdminCommunitySortBy;
  }

  return "createdAt";
}

const Page = () => {
  const [activeTab, setActiveTab] =
    useState<CommunityTab>("all");

  const [searchInput, setSearchInput] =
    useState("");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  /**
   * Latest community appears first on both tabs.
   */
  const [sorting, setSorting] =
    useState<SortingState>([
      {
        id: "createdAt",
        desc: true,
      },
    ]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setSearch(searchInput.trim());

      setPagination((previous) => ({
        ...previous,
        pageIndex: 0,
      }));
    }, 350);

    return () => {
      window.clearTimeout(timer);
    };
  }, [searchInput]);

  const activeSort = sorting[0];

  const queryParams =
    useMemo<GetAdminCommunitiesParams>(
      () => ({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        search: search || undefined,
        sortBy: getSortField(activeSort?.id),
        sortDirection: activeSort?.desc
          ? "desc"
          : "asc",
      }),
      [
        activeSort?.desc,
        activeSort?.id,
        pagination.pageIndex,
        pagination.pageSize,
        search,
      ],
    );

  /**
   * Only the active tab sends an API request.
   */
  const allCommunitiesQuery =
    useGetAdminCommunitiesQuery(queryParams, {
      skip: activeTab !== "all",
    });

  const myCommunitiesQuery =
    useGetMyCommunitiesQuery(queryParams, {
      skip: activeTab !== "mine",
    });

  const activeQuery =
    activeTab === "all"
      ? allCommunitiesQuery
      : myCommunitiesQuery;

  const communities =
    activeQuery.data?.data ?? [];

  const totalCommunities =
    activeQuery.data?.meta.total ?? 0;

  const totalPages =
    activeQuery.data?.meta.totalPages ?? 0;

  const handleTabChange = (value: string) => {
    const nextTab = value as CommunityTab;

    setActiveTab(nextTab);
    setSearchInput("");
    setSearch("");

    setPagination({
      pageIndex: 0,
      pageSize: 10,
    });

    setSorting([
      {
        id: "createdAt",
        desc: true,
      },
    ]);
  };

  /**
   * A newly created community is owned by the logged-in user.
   * After creation, switch to My Communities and show newest first.
   */
  const handleCommunityCreated = () => {
    setActiveTab("mine");
    setSearchInput("");
    setSearch("");

    setPagination((previous) => ({
      ...previous,
      pageIndex: 0,
    }));

    setSorting([
      {
        id: "createdAt",
        desc: true,
      },
    ]);
  };
  const handleDistrictCommunityCreated = () => {
  setActiveTab("all");
  setSearchInput("");
  setSearch("");

  setPagination((previous) => ({
    ...previous,
    pageIndex: 0,
  }));

  setSorting([
    {
      id: "createdAt",
      desc: true,
    },
  ]);
};

  const tableTitle =
    activeTab === "all"
      ? "All platform communities"
      : "My owned communities";

  const tableDescription =
    activeTab === "all"
      ? "View communities created across the entire application."
      : "Communities created and owned by your logged-in admin account.";

  return (
    <section className="min-h-full space-y-6 bg-background p-5 md:p-7">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <UsersRound className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Communities
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage platform communities and communities owned by you.
            </p>
          </div>
        </div>

       <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
  <AddDistrictCommunityForm
    onCreated={handleDistrictCommunityCreated}
  />

  <AddCommunityForm
    onCreated={handleCommunityCreated}
  />
</div>
      </div>

      {/* Tab Navigation */}
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="space-y-5"
      >
        <TabsList className="h-auto w-full justify-start gap-1 bg-card p-1 sm:w-auto" variant="line">
          <TabsTrigger
            value="all"
            className="gap-2 rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-none"
          >
            <Globe2 className="size-4" />
            All Communities
          </TabsTrigger>

          <TabsTrigger
            value="mine"
            className="gap-2 rounded-lg px-4 py-2.5 text-sm data-[state=active]:bg-accent data-[state=active]:text-accent-foreground data-[state=active]:shadow-none"
          >
            <ShieldCheck className="size-4" />
            My Communities
          </TabsTrigger>
        </TabsList>

        {/* API Error State */}
        {activeQuery.isError && (
          <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />

              <div>
                <p className="text-sm font-semibold text-foreground">
                  Unable to load communities
                </p>

                <p className="text-sm text-muted-foreground">
                  Check your permission and backend connection, then try again.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={() => activeQuery.refetch()}
              className="border-border bg-card hover:bg-muted"
            >
              <RefreshCcw className="mr-2 size-4" />
              Retry
            </Button>
          </div>
        )}

        {/* Table Card */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-foreground">
              {tableTitle}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {tableDescription}
            </p>
          </div>

          <DataTable
            columns={communityColumns}
            data={communities}
            filterKey="name"
            filterPlaceholder={
              activeTab === "all"
                ? "Search all communities..."
                : "Search my communities..."
            }
            emptyMessage={
              activeTab === "all"
                ? "No communities found."
                : "You do not own any communities yet."
            }
            loadingMessage="Loading communities..."
            pageSize={10}
            pageSizeOptions={[10, 20, 30, 40, 50]}
            resourceLabel="communities"
            isLoading={activeQuery.isLoading}
            isFetching={activeQuery.isFetching}
            server={{
              rowCount: totalCommunities,
              pageCount: totalPages,
              pagination,
              onPaginationChange: setPagination,
              sorting,
              onSortingChange: setSorting,
              searchValue: searchInput,
              onSearchChange: setSearchInput,
            }}
          />
        </div>
      </Tabs>
    </section>
  );
};

export default memo(Page);