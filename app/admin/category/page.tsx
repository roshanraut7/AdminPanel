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
  FolderTree,
  RefreshCcw,
  TriangleAlert,
} from "lucide-react";

import { AddCategoryForm } from "@/components/form/add-category";
import { DataTable } from "@/components/common/data-table";
import { categoryColumns } from "@/components/column/category-column";
import { useGetCategoriesQuery } from "@/lib/redux/services/category-api";
import { Button } from "@/components/ui/button";

import type {
  CategorySortBy,
  GetCategoriesParams,
} from "@/types/category";

const allowedSortFields: CategorySortBy[] = [
  "name",
  "createdAt",
  "updatedAt",
  "status",
  "sortOrder",
];

function getSortField(columnId?: string): CategorySortBy {
  if (
    columnId &&
    allowedSortFields.includes(columnId as CategorySortBy)
  ) {
    return columnId as CategorySortBy;
  }

  return "createdAt";
}

const Page = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [pagination, setPagination] =
    useState<PaginationState>({
      pageIndex: 0,
      pageSize: 10,
    });

  /**
   * Default admin table behaviour:
   * show the latest created category first.
   */
  const [sorting, setSorting] = useState<SortingState>([
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

  const queryParams = useMemo<GetCategoriesParams>(
    () => ({
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      search: search || undefined,
      sortBy: getSortField(activeSort?.id),
      sortDirection: activeSort?.desc ? "desc" : "asc",
    }),
    [
      activeSort?.desc,
      activeSort?.id,
      pagination.pageIndex,
      pagination.pageSize,
      search,
    ],
  );

  const {
    data: categoryResponse,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useGetCategoriesQuery(queryParams);

  const categories = categoryResponse?.data ?? [];
  const totalCategories = categoryResponse?.meta.total ?? 0;
  const totalPages = categoryResponse?.meta.totalPages ?? 0;

  /**
   * After a new category is created:
   * - remove old search filters
   * - return to first page
   * - sort by newest first
   *
   * RTK Query invalidates the Category LIST tag in your mutation,
   * so the new request will automatically return the latest category.
   */
  const handleCategoryCreated = () => {
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

  return (
    <section className="min-h-full space-y-6 bg-background p-5 md:p-7">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <FolderTree className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Categories
            </h1>

            <p className="text-sm text-muted-foreground">
              Manage community categories.
            </p>
          </div>
        </div>

        <AddCategoryForm onCreated={handleCategoryCreated} />
      </div>

      {/* API Error State */}
      {isError && (
        <div className="flex flex-col gap-4 rounded-xl border border-destructive/20 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <TriangleAlert className="mt-0.5 size-5 shrink-0 text-destructive" />

            <div>
              <p className="text-sm font-semibold text-foreground">
                Unable to load categories
              </p>

              <p className="text-sm text-muted-foreground">
                Check that your backend is running and try again.
              </p>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            className="border-border bg-card hover:bg-muted"
          >
            <RefreshCcw className="mr-2 size-4" />
            Retry
          </Button>
        </div>
      )}

      {/* Category Table */}
      <div className="rounded-2xl border border-border bg-card p-4 shadow-sm md:p-5">
        <DataTable
          columns={categoryColumns}
          data={categories}
          filterKey="name"
          filterPlaceholder="Search categories..."
          emptyMessage="No categories found."
          loadingMessage="Loading categories..."
          pageSize={10}
          pageSizeOptions={[10, 20, 30, 40, 50]}
          resourceLabel="categories"
          isLoading={isLoading}
          isFetching={isFetching}
          server={{
            rowCount: totalCategories,
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
    </section>
  );
};

export default memo(Page);