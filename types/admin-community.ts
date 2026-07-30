export type AdminCommunityStatus = "ACTIVE" | "INACTIVE";

export type AdminCommunityVisibility = "PUBLIC" | "PRIVATE";

export type AdminCommunitySortBy =
  | "name"
  | "createdAt"
  | "updatedAt"
  | "status"
  | "visibility";

export type SortDirection = "asc" | "desc";

/**
 * Common frontend row type.
 *
 * Both:
 * - GET /admin/communities
 * - GET /communities/managed/my
 *
 * will be converted into this same table shape.
 */
export type AdminCommunity = {
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

  adminId: string;
  adminName: string | null;
  adminEmail: string;
  adminImage: string | null;
  adminRole: string;

  memberCount: number;
  postCount: number;
  joinRequestCount: number;
  bannedCount: number;

  createdAt: string;
  updatedAt: string;
};

export type GetAdminCommunitiesParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: AdminCommunityStatus;
  visibility?: AdminCommunityVisibility;
  categoryId?: string;
  sortBy?: AdminCommunitySortBy;
  sortDirection?: SortDirection;
};

export type CommunityPaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

/**
 * Stats returned by GET /admin/communities.
 */
export type AllCommunityStats = {
  totalCommunities: number;
  activeCommunities: number;
  inactiveCommunities: number;
  publicCommunities: number;
  privateCommunities: number;
  totalMembers: number;
  bannedMembers: number;
  totalPosts: number;
  pendingJoinRequests: number;
};

/**
 * Stats returned by GET /communities/managed/my.
 */
export type MyCommunityStats = {
  totalCommunities: number;
  activeCommunities: number;
  inactiveCommunities: number;
  publicCommunities: number;
  privateCommunities: number;
  activeMembers: number;
  bannedMembers: number;
  publishedPosts: number;
  pendingJoinRequests: number;
};

export type GetAllCommunitiesResponse = {
  data: AdminCommunity[];

  meta: CommunityPaginationMeta;

  stats: AllCommunityStats;

  filters: {
    search: string | null;
    status: AdminCommunityStatus | null;
    visibility: AdminCommunityVisibility | null;
    categoryId: string | null;
    sortBy: AdminCommunitySortBy;
    sortDirection: SortDirection;
  };
};

/**
 * Response used by the frontend after RTK Query transforms
 * the My Communities response into the common AdminCommunity row shape.
 */
export type GetMyCommunitiesResponse = {
  data: AdminCommunity[];

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

export type CreateCommunityPayload = {
  name: string;
  categoryId: string;
  description?: string;
  visibility?: AdminCommunityVisibility;
  avatarImage?: string;
  coverImage?: string;
};
export type DeleteAdminCommunityPayload = {
  communityId: string;
  reason: string;
  confirmationName: string;
};

export type DeleteAdminCommunityResponse = {
  message: string;

  deletedCommunity: {
    id: string;
    name: string;
    slug: string;

    purpose:
      | "GENERAL"
      | "BUSINESS"
      | "DISTRICT_OFFICIAL";

    memberCount: number;
    postCount: number;
    joinRequestCount: number;
    reason: string;
  };
};