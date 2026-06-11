import { baseApi } from "./base-api";

import type {
  AdminCommunity,
  AdminCommunitySortBy,
  AdminCommunityStatus,
  AdminCommunityVisibility,
  CommunityPaginationMeta,
  CreateCommunityPayload,
  GetAdminCommunitiesParams,
  GetAllCommunitiesResponse,
  GetMyCommunitiesResponse,
  MyCommunityStats,
  SortDirection,
} from "@/types/admin-community";

import type {
  AdminCommunityLimitUsersResponse,
  GetCommunityLimitUsersParams,
  UpdateUserCommunityLimitPayload,
  UpdateUserCommunityLimitResponse,
} from "@/types/community-request";

type ManagedCommunityRow = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  avatarImage: string | null;
  coverImage: string | null;

  visibility: AdminCommunityVisibility;
  status: AdminCommunityStatus;

  categoryId: string;
  categoryName: string;
  categorySlug: string;

  ownerId: string;
  ownerName: string | null;
  ownerEmail: string;
  ownerImage: string | null;
  ownerAppRole: string;

  memberCount: number;
  postCount: number;
  pendingJoinRequestCount: number;
  bannedCount: number;

  createdAt: string;
  updatedAt: string;
};

type RawGetMyCommunitiesResponse = {
  data: ManagedCommunityRow[];
  meta: CommunityPaginationMeta;
  stats: MyCommunityStats;

  filters: {
    search: string | null;
    status: AdminCommunityStatus | null;
    visibility: AdminCommunityVisibility | null;
    categoryId: string | null;
    sortBy: AdminCommunitySortBy;
    sortDirection: SortDirection;
  };
};

function mapManagedCommunityToTableRow(
  community: ManagedCommunityRow,
): AdminCommunity {
  return {
    id: community.id,
    name: community.name,
    slug: community.slug,
    description: community.description,
    avatarImage: community.avatarImage,
    coverImage: community.coverImage,

    visibility: community.visibility,
    status: community.status,

    categoryId: community.categoryId,
    categoryName: community.categoryName,
    categorySlug: community.categorySlug,

    adminId: community.ownerId,
    adminName: community.ownerName,
    adminEmail: community.ownerEmail,
    adminImage: community.ownerImage,
    adminRole: community.ownerAppRole,

    memberCount: community.memberCount,
    postCount: community.postCount,
    joinRequestCount: community.pendingJoinRequestCount,
    bannedCount: community.bannedCount,

    createdAt: community.createdAt,
    updatedAt: community.updatedAt,
  };
}
export type CreateOfficialDistrictCommunityPayload = {
  districtKey: string;
  districtName: string;
  categoryId: string;
  description?: string;
};

export const communityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    /**
     * Existing app-admin endpoint.
     * Uses your AdminCommunityController.
     */
    getAdminCommunities: builder.query<
      GetAllCommunitiesResponse,
      GetAdminCommunitiesParams
    >({
      query: (params) => ({
        url: "/admin/communities",
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result
          ? [
              { type: "Community" as const, id: "ADMIN_LIST" },
              ...result.data.map((community) => ({
                type: "Community" as const,
                id: community.id,
              })),
            ]
          : [{ type: "Community" as const, id: "ADMIN_LIST" }],
    }),

    /**
     * Existing owner-management endpoint.
     * Uses your CommunityController.
     */
    getMyCommunities: builder.query<
      GetMyCommunitiesResponse,
      GetAdminCommunitiesParams
    >({
      query: (params) => ({
        url: "/communities/managed/my",
        method: "GET",
        params,
      }),

      transformResponse: (
        response: RawGetMyCommunitiesResponse,
      ): GetMyCommunitiesResponse => ({
        ...response,
        data: response.data.map(mapManagedCommunityToTableRow),
      }),

      providesTags: (result) =>
        result
          ? [
              { type: "Community" as const, id: "MY_LIST" },
              ...result.data.map((community) => ({
                type: "Community" as const,
                id: community.id,
              })),
            ]
          : [{ type: "Community" as const, id: "MY_LIST" }],
    }),

    /**
     * Existing create endpoint.
     * The logged-in admin becomes owner of the created community.
     */
    createCommunity: builder.mutation<
      unknown,
      CreateCommunityPayload
    >({
      query: (body) => ({
        url: "/communities",
        method: "POST",
        body,
      }),

      invalidatesTags: [
        { type: "Community", id: "ADMIN_LIST" },
        { type: "Community", id: "MY_LIST" },
      ],
    }),
// creating official district community
    createOfficialDistrictCommunity: builder.mutation<
  unknown,
  CreateOfficialDistrictCommunityPayload
>({
  query: (body) => ({
    url: "/admin/communities/district-official",
    method: "POST",
    body,
  }),

  invalidatesTags: [
    { type: "Community", id: "ADMIN_LIST" },
    { type: "Community", id: "MY_LIST" },
  ],
}),

    /**
     * Existing admin details endpoint.
     */
    getAdminCommunityDetails: builder.query<unknown, string>({
      query: (communityId) => ({
        url: `/admin/communities/${communityId}`,
        method: "GET",
      }),

      providesTags: (_result, _error, communityId) => [
        { type: "Community", id: communityId },
      ],
    }),

    /**
     * New admin endpoint.
     *
     * Loads users with:
     * - created general community count
     * - current allowed limit
     * - available remaining slots
     *
     * Backend:
     * GET /admin/communities/limit-users
     */
    getCommunityLimitUsers: builder.query<
      AdminCommunityLimitUsersResponse,
      GetCommunityLimitUsersParams
    >({
      query: (params) => ({
        url: "/admin/communities/limit-users",
        method: "GET",
        params,
      }),

      providesTags: (result) =>
        result
          ? [
              { type: "Community" as const, id: "COMMUNITY_LIMIT_USERS" },
              ...result.data.map((user) => ({
                type: "Community" as const,
                id: `COMMUNITY_LIMIT_USER_${user.id}`,
              })),
            ]
          : [
              {
                type: "Community" as const,
                id: "COMMUNITY_LIMIT_USERS",
              },
            ],
    }),

    /**
     * New admin endpoint.
     *
     * Increases one selected user's community creation limit.
     *
     * Backend:
     * PATCH /admin/communities/users/:targetUserId/community-limit
     */
    updateUserCommunityLimit: builder.mutation<
      UpdateUserCommunityLimitResponse,
      UpdateUserCommunityLimitPayload
    >({
      query: ({ targetUserId, newLimit }) => ({
        url: `/admin/communities/users/${targetUserId}/community-limit`,
        method: "PATCH",
        body: {
          newLimit,
        },
      }),

      invalidatesTags: (_result, _error, { targetUserId }) => [
        {
          type: "Community" as const,
          id: "COMMUNITY_LIMIT_USERS",
        },
        {
          type: "Community" as const,
          id: `COMMUNITY_LIMIT_USER_${targetUserId}`,
        },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetAdminCommunitiesQuery,
  useGetMyCommunitiesQuery,
  useCreateCommunityMutation,
  useGetAdminCommunityDetailsQuery,

  // New community limit hooks
  useGetCommunityLimitUsersQuery,
  useUpdateUserCommunityLimitMutation,
    useCreateOfficialDistrictCommunityMutation,
} = communityApi;