export type CategoryStatus = "ACTIVE" | "INACTIVE";

export type CategorySortBy =
  | "name"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "sortOrder";

export type SortDirection = "asc" | "desc";

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: CategoryStatus;
  sortOrder: number;
  communityCount: number;
  createdAt: string;
  updatedAt: string;
};

export type CreatedCategory = Omit<Category, "communityCount">;

export type GetCategoriesParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: CategoryStatus;
  sortBy?: CategorySortBy;
  sortDirection?: SortDirection;
};

export type CategoryPaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export type GetCategoriesResponse = {
  data: Category[];

  meta: CategoryPaginationMeta;

  filters: {
    search: string | null;
    status: CategoryStatus | null;
    sortBy: CategorySortBy;
    sortDirection: SortDirection;
  };
};

export type CreateCategoryPayload = {
  name: string;
  description?: string;
};