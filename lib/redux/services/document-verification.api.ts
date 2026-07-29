import { baseApi } from "./base-api";

import type {
  PendingVerificationResponse,
  VerificationReviewResponse,
  VerificationStatus,
} from "@/types/document-verification";

type GetVerificationRequestsQuery = {
  status: VerificationStatus;
  page: number;
  limit: number;
};

export const documentVerificationApi =
  baseApi.injectEndpoints({
    endpoints: (builder) => ({
      getVerificationRequests:
        builder.query<
          PendingVerificationResponse,
          GetVerificationRequestsQuery
        >({
          query: ({
            status,
            page,
            limit,
          }) => ({
            url: "/verification/admin/requests",
            method: "GET",

            params: {
              status,
              page,
              limit,
            },
          }),

          providesTags: (
            result,
            _error,
            argument,
          ) =>
            result
              ? [
                  {
                    type: "Verification" as const,
                    id: `${argument.status}_LIST`,
                  },

                  ...result.data.map(
                    (request) => ({
                      type: "Verification" as const,
                      id: request.id,
                    }),
                  ),
                ]
              : [
                  {
                    type: "Verification" as const,
                    id: `${argument.status}_LIST`,
                  },
                ],
        }),

      approveVerificationRequest:
        builder.mutation<
          VerificationReviewResponse,
          string
        >({
          query: (requestId) => ({
            url: `/verification/admin/${requestId}/approve`,
            method: "PATCH",
          }),

          invalidatesTags: (
            _result,
            _error,
            requestId,
          ) => [
            {
              type: "Verification",
              id: requestId,
            },
            {
              type: "Verification",
              id: "PENDING_LIST",
            },
            {
              type: "Verification",
              id: "APPROVED_LIST",
            },
          ],
        }),

      rejectVerificationRequest:
        builder.mutation<
          VerificationReviewResponse,
          {
            requestId: string;
            reason: string;
          }
        >({
          query: ({
            requestId,
            reason,
          }) => ({
            url: `/verification/admin/${requestId}/reject`,
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
              type: "Verification",
              id: requestId,
            },
            {
              type: "Verification",
              id: "PENDING_LIST",
            },
            {
              type: "Verification",
              id: "REJECTED_LIST",
            },
          ],
        }),
    }),

    overrideExisting: false,
  });

export const {
  useGetVerificationRequestsQuery,
  useApproveVerificationRequestMutation,
  useRejectVerificationRequestMutation,
} = documentVerificationApi;