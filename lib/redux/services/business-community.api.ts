import { baseApi } from "./base-api";

import type {
  ApproveBusinessCommunityRequestResponse,
  BusinessCommunityRequestsQuery,
  BusinessCommunityRequestsResponse,
  MyBusinessCommunityRequestResponse,
  RejectBusinessCommunityRequestInput,
  RejectBusinessCommunityRequestResponse,
  SubmitBusinessCommunityRequestInput,
  SubmitBusinessCommunityRequestResponse,
} from "@/types/business-community";

export const businessCommunityApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      /**
       * User submits a business-community request.
       */
      submitBusinessCommunityRequest:
        builder.mutation<
          SubmitBusinessCommunityRequestResponse,
          SubmitBusinessCommunityRequestInput
        >({
          query: (body) => ({
            url: "/business-community/request",
            method: "POST",
            body,
          }),

          invalidatesTags: [
            {
              type: "BusinessCommunityRequest",
              id: "MY_REQUEST",
            },
          ],
        }),

      /**
       * Logged-in user's latest request.
       */
      getMyBusinessCommunityRequest:
        builder.query<
          MyBusinessCommunityRequestResponse,
          void
        >({
          query: () => ({
            url: "/business-community/request/me",
            method: "GET",
          }),

          providesTags: [
            {
              type: "BusinessCommunityRequest",
              id: "MY_REQUEST",
            },
          ],
        }),

      /**
       * Admin list with status and pagination.
       */
      getBusinessCommunityRequests:
        builder.query<
          BusinessCommunityRequestsResponse,
          BusinessCommunityRequestsQuery
        >({
          query: ({
            status,
            page = 1,
            limit = 10,
          }) => ({
            url:
              "/business-community/admin/requests",

            method: "GET",

            params: {
              status,
              page,
              limit,
            },
          }),

          providesTags: (result) => [
            {
              type:
                "BusinessCommunityRequest",
              id: "LIST",
            },

            ...(result?.data.map(
              (request) =>
                ({
                  type:
                    "BusinessCommunityRequest",
                  id: request.id,
                }) as const,
            ) ?? []),
          ],
        }),

      /**
       * Admin approves request.
       */
      approveBusinessCommunityRequest:
        builder.mutation<
          ApproveBusinessCommunityRequestResponse,
          string
        >({
          query: (requestId) => ({
            url: `/business-community/admin/${requestId}/approve`,
            method: "PATCH",
          }),

          invalidatesTags: (
            _result,
            _error,
            requestId,
          ) => [
            {
              type:
                "BusinessCommunityRequest",
              id: requestId,
            },
            {
              type:
                "BusinessCommunityRequest",
              id: "LIST",
            },
            {
              type: "Community",
              id: "LIST",
            },
          ],
        }),

      /**
       * Admin rejects request.
       */
      rejectBusinessCommunityRequest:
        builder.mutation<
          RejectBusinessCommunityRequestResponse,
          RejectBusinessCommunityRequestInput
        >({
          query: ({
            requestId,
            reason,
          }) => ({
            url: `/business-community/admin/${requestId}/reject`,
            method: "PATCH",

            body: {
              reason,
            },
          }),

          invalidatesTags: (
            _result,
            _error,
            { requestId },
          ) => [
            {
              type:
                "BusinessCommunityRequest",
              id: requestId,
            },
            {
              type:
                "BusinessCommunityRequest",
              id: "LIST",
            },
          ],
        }),
    }),

    overrideExisting: false,
  });

export const {
  useSubmitBusinessCommunityRequestMutation,
  useGetMyBusinessCommunityRequestQuery,
  useGetBusinessCommunityRequestsQuery,
  useApproveBusinessCommunityRequestMutation,
  useRejectBusinessCommunityRequestMutation,
} = businessCommunityApi;