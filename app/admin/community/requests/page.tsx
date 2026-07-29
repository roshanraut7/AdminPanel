"use client";

import * as React from "react";
import type {
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import {
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { DataTable } from "@/components/common/data-table";
import { StatCard } from "@/components/common/stats-card";

import { BusinessCommunityReviewSheet } from "@/components/business-community/business-community-review-sheet";
import { getBusinessCommunityRequestColumns } from "@/components/column/business-community-request-column";

import { useGetBusinessCommunityRequestsQuery } from "@/lib/redux/services/business-community.api";

import type {
  BusinessCommunityRequest,
  BusinessCommunityRequestStatus,
} from "@/types/business-community";

const DEFAULT_PAGE_SIZE = 10;

const pageConfiguration: Record<
  BusinessCommunityRequestStatus,
  {
    title: string;
    description: string;
    emptyMessage: string;
    countLabel: string;
  }
> = {
  PENDING: {
    title: "Pending community requests",

    description:
      "Dedicated business and training communities waiting for an administrator decision.",

    emptyMessage:
      "There are no pending business community requests.",

    countLabel: "pending",
  },

  APPROVED: {
    title: "Approved community requests",

    description:
      "Requests that were approved and converted into dedicated communities.",

    emptyMessage:
      "There are no approved business community requests.",

    countLabel: "approved",
  },

  REJECTED: {
    title: "Rejected community requests",

    description:
      "Requests that were rejected with an explanation for the applicant.",

    emptyMessage:
      "There are no rejected business community requests.",

    countLabel: "rejected",
  },
};

export default function BusinessCommunityRequestsPage() {
  const [
    activeStatus,
    setActiveStatus,
  ] =
    React.useState<BusinessCommunityRequestStatus>(
      "PENDING",
    );

  const [pagination, setPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize: DEFAULT_PAGE_SIZE,
    });

  const [sorting, setSorting] =
    React.useState<SortingState>([]);

  const [
    selectedRequest,
    setSelectedRequest,
  ] =
    React.useState<BusinessCommunityRequest | null>(
      null,
    );

  const [
    reviewSheetOpen,
    setReviewSheetOpen,
  ] = React.useState(false);

  /*
   * Main table query.
   */
  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    refetch,
  } =
    useGetBusinessCommunityRequestsQuery({
      status: activeStatus,
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
    });

  /*
   * Separate count queries.
   */
  const {
    data: pendingCountResponse,
    isFetching:
      isPendingCountFetching,
    refetch: refetchPendingCount,
  } =
    useGetBusinessCommunityRequestsQuery({
      status: "PENDING",
      page: 1,
      limit: 1,
    });

  const {
    data: approvedCountResponse,
    isFetching:
      isApprovedCountFetching,
    refetch: refetchApprovedCount,
  } =
    useGetBusinessCommunityRequestsQuery({
      status: "APPROVED",
      page: 1,
      limit: 1,
    });

  const {
    data: rejectedCountResponse,
    isFetching:
      isRejectedCountFetching,
    refetch: refetchRejectedCount,
  } =
    useGetBusinessCommunityRequestsQuery({
      status: "REJECTED",
      page: 1,
      limit: 1,
    });

  const requests =
    response?.data ?? [];

  const currentTotal =
    response?.meta.total ?? 0;

  const pageCount = Math.max(
    response?.meta.totalPages ?? 1,
    1,
  );

  const totalPending =
    pendingCountResponse?.meta.total ??
    0;

  const totalApproved =
    approvedCountResponse?.meta.total ??
    0;

  const totalRejected =
    rejectedCountResponse?.meta.total ??
    0;

  const totalRequests =
    totalPending +
    totalApproved +
    totalRejected;

  const currentPage =
    pageConfiguration[activeStatus];

  const isRefreshing =
    isFetching ||
    isPendingCountFetching ||
    isApprovedCountFetching ||
    isRejectedCountFetching;

  const handleReview =
    React.useCallback(
      (
        request: BusinessCommunityRequest,
      ) => {
        setSelectedRequest(request);
        setReviewSheetOpen(true);
      },
      [],
    );

  const columns = React.useMemo(
    () =>
      getBusinessCommunityRequestColumns(
        {
          onReview: handleReview,
        },
      ),
    [handleReview],
  );

  const handleStatusChange = (
    value: string,
  ) => {
    const nextStatus =
      value as BusinessCommunityRequestStatus;

    setActiveStatus(nextStatus);

    setPagination((current) => ({
      ...current,
      pageIndex: 0,
    }));

    setSorting([]);

    setReviewSheetOpen(false);
    setSelectedRequest(null);
  };

  const handleRefresh = () => {
    void refetch();
    void refetchPendingCount();
    void refetchApprovedCount();
    void refetchRejectedCount();
  };

  /*
   * If the final request on a later page is reviewed,
   * return to the previous page.
   */
  React.useEffect(() => {
    if (
      !isFetching &&
      response &&
      response.data.length === 0 &&
      pagination.pageIndex > 0
    ) {
      setPagination((current) => ({
        ...current,

        pageIndex: Math.max(
          current.pageIndex - 1,
          0,
        ),
      }));
    }
  }, [
    isFetching,
    response,
    pagination.pageIndex,
  ]);

  return (
    <div className="min-w-0 space-y-6">
      {/* Heading */}
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Building2 className="size-5" />
            </div>

            <span className="rounded-full border border-primary/15 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
              Community management
            </span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Business community requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
            Review requests from verified
            businesses and training
            institutes before creating their
            dedicated communities.
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="w-full border-border bg-card sm:w-auto"
        >
          <RefreshCw
            className={`mr-2 size-4 ${
              isRefreshing
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh requests
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Pending requests"
          value={`${totalPending}`}
          change="Live"
          helper="Awaiting admin review"
          icon={Clock3}
          tone="warning"
        />

        <StatCard
          title="Approved"
          value={`${totalApproved}`}
          change="Created"
          helper="Communities successfully created"
          icon={CheckCircle2}
          tone="success"
        />

        <StatCard
          title="Rejected"
          value={`${totalRejected}`}
          change="Reviewed"
          helper="Requests requiring correction"
          icon={XCircle}
          tone="danger"
        />

        <StatCard
          title="Total requests"
          value={`${totalRequests}`}
          change="All"
          helper="Across every request status"
          icon={ShieldCheck}
          tone="info"
        />
      </div>

      {/* Notice */}
      <Alert className="border-primary/15 bg-primary/5">
        <CircleAlert className="size-4 text-primary" />

        <AlertTitle>
          Approval creates a real community
        </AlertTitle>

        <AlertDescription>
          Check the community name,
          description, category, applicant
          verification track and visibility
          before approving. Approval
          immediately creates the dedicated
          business community.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs
        value={activeStatus}
        onValueChange={
          handleStatusChange
        }
        className="w-full"
      >
        <TabsList className="grid h-auto w-full grid-cols-3 rounded-xl bg-secondary p-1 sm:w-fit">
          <TabsTrigger
            value="PENDING"
            className="gap-2 rounded-lg px-3 py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:px-5"
          >
            <Clock3 className="size-4" />

            <span>Pending</span>

            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {totalPending}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="APPROVED"
            className="gap-2 rounded-lg px-3 py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:px-5"
          >
            <CheckCircle2 className="size-4" />

            <span>Approved</span>

            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {totalApproved}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="REJECTED"
            className="gap-2 rounded-lg px-3 py-2.5 data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm sm:px-5"
          >
            <XCircle className="size-4" />

            <span>Rejected</span>

            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">
              {totalRejected}
            </span>
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Table */}
      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm">
        <CardContent className="p-5 sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                {currentPage.title}
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                {
                  currentPage.description
                }
              </p>
            </div>

            <div className="w-fit rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground">
              {currentTotal}{" "}
              {currentPage.countLabel}
            </div>
          </div>

          {isError ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-xl border border-dashed border-destructive/30 bg-destructive/5 p-8 text-center">
              <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
                <CircleAlert className="size-6" />
              </div>

              <h3 className="mt-4 font-semibold text-foreground">
                Could not load community
                requests
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                Check the backend connection,
                authentication cookie and
                administrator permissions,
                then try again.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="mt-5"
              >
                <RefreshCw
                  className={`mr-2 size-4 ${
                    isRefreshing
                      ? "animate-spin"
                      : ""
                  }`}
                />

                Try again
              </Button>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={requests}
              isLoading={isLoading}
              isFetching={isFetching}
              loadingMessage={`Loading ${currentPage.countLabel} community requests...`}
              emptyMessage={
                currentPage.emptyMessage
              }
              resourceLabel="requests"
              pageSize={
                DEFAULT_PAGE_SIZE
              }
              pageSizeOptions={[
                10,
                20,
                30,
                50,
              ]}
              showSearch={false}
              showColumnToggle
              server={{
                rowCount: currentTotal,
                pageCount,
                pagination,

                onPaginationChange:
                  setPagination,

                sorting,

                onSortingChange:
                  setSorting,

                searchValue: "",

                onSearchChange:
                  () => {},
              }}
            />
          )}
        </CardContent>
      </Card>

      {/* Review sheet */}
      <BusinessCommunityReviewSheet
        request={selectedRequest}
        open={reviewSheetOpen}
        onOpenChange={(open) => {
          setReviewSheetOpen(open);

          if (!open) {
            setSelectedRequest(null);
          }
        }}
      />
    </div>
  );
}