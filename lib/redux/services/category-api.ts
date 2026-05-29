import { baseApi } from "./base-api";

import type {
  Category,
  CreatedCategory,
  CreateCategoryPayload,
  GetCategoriesParams,
  GetCategoriesResponse,
} from "@/types/category";

export const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * GET /categories
     */
    getCategories: builder.query<
      GetCategoriesResponse,
      GetCategoriesParams
    >({
      query: (params) => ({
        url: "/categories",
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result
          ? [
              { type: "Category" as const, id: "LIST" },
              ...result.data.map((category) => ({
                type: "Category" as const,
                id: category.id,
              })),
            ]
          : [{ type: "Category" as const, id: "LIST" }],
    }),

    /**
     * POST /categories
     */
    createCategory: builder.mutation<
      CreatedCategory,
      CreateCategoryPayload
    >({
      query: (body) => ({
        url: "/categories",
        method: "POST",
        body,
      }),

      invalidatesTags: [{ type: "Category", id: "LIST" }],
    }),

    /**
     * Available for your action menu later:
     * PATCH /categories/:id
     */
    updateCategory: builder.mutation<
      CreatedCategory,
      {
        id: string;
        body: Partial<CreateCategoryPayload>;
      }
    >({
      query: ({ id, body }) => ({
        url: `/categories/${id}`,
        method: "PATCH",
        body,
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),

    /**
     * Available for your action menu later:
     * PATCH /categories/:id/status
     */
    updateCategoryStatus: builder.mutation<
      CreatedCategory,
      {
        id: string;
        status: Category["status"];
      }
    >({
      query: ({ id, status }) => ({
        url: `/categories/${id}/status`,
        method: "PATCH",
        body: {
          status,
        },
      }),

      invalidatesTags: (_result, _error, { id }) => [
        { type: "Category", id },
        { type: "Category", id: "LIST" },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useUpdateCategoryStatusMutation,
} = categoryApi;