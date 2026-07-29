import {
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl:
      process.env.NEXT_PUBLIC_API_URL,

    credentials: "include",

    prepareHeaders: (headers) => {
      headers.set(
        "Content-Type",
        "application/json",
      );

      return headers;
    },
  }),

  tagTypes: [
    "Category",
    "Community",
    "Verification",
    "BusinessCommunityRequest",
  ],

  endpoints: () => ({}),
});