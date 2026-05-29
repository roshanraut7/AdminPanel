import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,

    /**
     * Required for Better Auth cookie session.
     * This sends the browser session cookie to your NestJS backend.
     */
    credentials: "include",

    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),

  tagTypes: [
    "Category",
    "Community",
  ],

  endpoints: () => ({}),
});