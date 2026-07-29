"use client";

import * as React from "react";
import { format } from "date-fns";
import { type DateRange } from "react-day-picker";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type OnChangeFn,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  LoaderCircle,
  Search,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 30, 40, 50];

interface ServerTableOptions {
  rowCount: number;
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];

  filterKey?: string;
  filterPlaceholder?: string;

  /**
   * Date range filtering remains client-side only.
   * Do not pass this for live API tables until the backend supports
   * createdFrom and createdTo query parameters.
   */
  dateFilterKey?: string;
  dateFilterLabel?: string;

  emptyMessage?: string;
  loadingMessage?: string;

  pageSize?: number;
  pageSizeOptions?: number[];
  resourceLabel?: string;

  isLoading?: boolean;
  isFetching?: boolean;
showSearch?: boolean;
showColumnToggle?: boolean;
  /**
   * Pass this object when the backend controls page/search/sort.
   */
  server?: ServerTableOptions;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  filterKey,
  filterPlaceholder = "Search...",
  dateFilterKey,
  dateFilterLabel = "Created at",
  emptyMessage = "No results found.",
  loadingMessage = "Loading data...",
  pageSize = 10,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
  resourceLabel = "rows",
  isLoading = false,
  isFetching = false,
  server,
    showSearch = true,
  showColumnToggle = true,
}: DataTableProps<TData, TValue>) {
  const isServerSide = Boolean(server);

  const [internalSorting, setInternalSorting] =
    React.useState<SortingState>([]);
  const [internalPagination, setInternalPagination] =
    React.useState<PaginationState>({
      pageIndex: 0,
      pageSize,
    });
  const [columnFilters, setColumnFilters] =
    React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [dateRange, setDateRange] =
    React.useState<DateRange | undefined>(undefined);

  const resolvedSorting = server?.sorting ?? internalSorting;
  const resolvedPagination = server?.pagination ?? internalPagination;

  const availablePageSizes = React.useMemo(
    () =>
      Array.from(
        new Set([pageSize, ...pageSizeOptions]),
      ).sort((first, second) => first - second),
    [pageSize, pageSizeOptions],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: resolvedSorting,
      pagination: resolvedPagination,
      columnFilters,
      columnVisibility,
    },

    onSortingChange:
      server?.onSortingChange ?? setInternalSorting,
    onPaginationChange:
      server?.onPaginationChange ?? setInternalPagination,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),

    manualPagination: isServerSide,
    manualSorting: isServerSide,

    pageCount: server?.pageCount,
    rowCount: server?.rowCount,
  });

  const textFilterColumn =
    !isServerSide && filterKey
      ? table.getColumn(filterKey)
      : undefined;

  const dateColumn =
    !isServerSide && dateFilterKey
      ? table.getColumn(dateFilterKey)
      : undefined;

  const searchValue = isServerSide
    ? server?.searchValue ?? ""
    : (textFilterColumn?.getFilterValue() as string) ?? "";

  const totalRows = isServerSide
    ? server?.rowCount ?? 0
    : table.getFilteredRowModel().rows.length;

  const startRow =
    totalRows === 0
      ? 0
      : resolvedPagination.pageIndex *
          resolvedPagination.pageSize +
        1;

  const endRow = Math.min(
    (resolvedPagination.pageIndex + 1) *
      resolvedPagination.pageSize,
    totalRows,
  );

  const hasActiveFilters = isServerSide
    ? Boolean(server?.searchValue)
    : columnFilters.length > 0;

  const handleSearchChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = event.target.value;

    if (isServerSide && server) {
      server.onSearchChange(value);

      server.onPaginationChange((previous) => ({
        ...previous,
        pageIndex: 0,
      }));

      return;
    }

    textFilterColumn?.setFilterValue(value);
    table.setPageIndex(0);
  };

  const handleDateRangeChange = (
    range: DateRange | undefined,
  ) => {
    setDateRange(range);
    dateColumn?.setFilterValue(range);
    table.setPageIndex(0);
  };

  const resetFilters = () => {
    if (isServerSide && server) {
      server.onSearchChange("");

      server.onPaginationChange((previous) => ({
        ...previous,
        pageIndex: 0,
      }));

      return;
    }

    setDateRange(undefined);
    table.resetColumnFilters();
    table.setPageIndex(0);
  };

  const dateButtonLabel = !dateRange?.from
    ? dateFilterLabel
    : !dateRange.to
      ? format(dateRange.from, "dd MMM yyyy")
      : `${format(dateRange.from, "dd MMM yyyy")} - ${format(
          dateRange.to,
          "dd MMM yyyy",
        )}`;

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
          {showSearch &&
  (filterKey || isServerSide) && (
            <div className="relative w-full sm:w-[300px]">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                placeholder={filterPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
                className="h-10 border-input bg-card pl-9 shadow-none placeholder:text-muted-foreground focus-visible:ring-ring"
              />
            </div>
          )}

          {/* Client-side tables only until backend date filters are added */}
          {dateColumn && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={
                    dateRange?.from
                      ? "h-10 border-primary/30 bg-accent text-accent-foreground hover:bg-accent"
                      : "h-10 border-border bg-card text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }
                >
                  <CalendarDays className="mr-2 size-4" />
                  {dateButtonLabel}
                </Button>
              </PopoverTrigger>

              <PopoverContent
                align="start"
                className="w-auto border-border bg-popover p-0 text-popover-foreground"
              >
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  defaultMonth={dateRange?.from}
                  numberOfMonths={2}
                  autoFocus
                  className="p-3"
                />

                {dateRange?.from && (
                  <div className="flex justify-end border-t border-border p-3">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleDateRangeChange(undefined)
                      }
                    >
                      Clear date
                    </Button>
                  </div>
                )}
              </PopoverContent>
            </Popover>
          )}

          {hasActiveFilters && (
            <Button
              type="button"
              variant="ghost"
              onClick={resetFilters}
              className="h-10 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            >
              Reset
              <X className="ml-2 size-4" />
            </Button>
          )}

          {isFetching && !isLoading && (
            <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
          )}
        </div>

       {showColumnToggle && (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button
        type="button"
        variant="outline"
        className="h-10 border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground"
      >
        Columns

        <ChevronDown className="ml-2 size-4 text-muted-foreground" />
      </Button>
    </DropdownMenuTrigger>

    <DropdownMenuContent
      align="end"
      className="w-48 border-border bg-popover text-popover-foreground"
    >
      {table
        .getAllColumns()
        .filter((column) =>
          column.getCanHide(),
        )
        .map((column) => (
          <DropdownMenuCheckboxItem
            key={column.id}
            checked={column.getIsVisible()}
            onCheckedChange={(value) =>
              column.toggleVisibility(
                Boolean(value),
              )
            }
            className="capitalize focus:bg-accent focus:text-accent-foreground"
          >
            {column.id}
          </DropdownMenuCheckboxItem>
        ))}
    </DropdownMenuContent>
  </DropdownMenu>
)}
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <Table>
          <TableHeader className="bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-border hover:bg-secondary"
              >
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-12 px-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                >
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <LoaderCircle className="size-4 animate-spin text-primary" />
                    {loadingMessage}
                  </div>
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-border transition-colors hover:bg-accent/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="px-4 py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-sm text-muted-foreground"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-4 border-t border-border pt-4 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-medium text-foreground">
            {startRow}
          </span>
          -
          <span className="font-medium text-foreground">
            {endRow}
          </span>{" "}
          of{" "}
          <span className="font-medium text-foreground">
            {totalRows}
          </span>{" "}
          {resourceLabel}
        </p>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <p className="whitespace-nowrap text-sm text-muted-foreground">
              Rows per page
            </p>

            <Select
              value={`${resolvedPagination.pageSize}`}
              onValueChange={(value) =>
                table.setPageSize(Number(value))
              }
            >
              <SelectTrigger className="h-9 w-[74px] border-border bg-card">
                <SelectValue />
              </SelectTrigger>

              <SelectContent className="border-border bg-popover">
                {availablePageSizes.map((size) => (
                  <SelectItem
                    key={size}
                    value={`${size}`}
                  >
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <p className="whitespace-nowrap text-sm text-muted-foreground">
            Page{" "}
            <span className="font-medium text-foreground">
              {resolvedPagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {table.getPageCount() || 1}
            </span>
          </p>

          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="hidden size-9 border-border bg-card lg:inline-flex"
            >
              <ChevronsLeft className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="size-9 border-border bg-card"
            >
              <ChevronLeft className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="size-9 border-border bg-card"
            >
              <ChevronRight className="size-4" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() =>
                table.setPageIndex(
                  Math.max(table.getPageCount() - 1, 0),
                )
              }
              disabled={!table.getCanNextPage()}
              className="hidden size-9 border-border bg-card lg:inline-flex"
            >
              <ChevronsRight className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}