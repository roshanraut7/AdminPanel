export type AdminCommunityLimitUser = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";

  communityCreated: number;
  communityCreateLimit: number;
  available: number;
  hasReachedLimit: boolean;

  createdAt: string;
};

export type GetCommunityLimitUsersParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type AdminCommunityLimitUsersResponse = {
  data: AdminCommunityLimitUser[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };

  filters: {
    search: string | null;
  };
};

export type UpdateUserCommunityLimitPayload = {
  targetUserId: string;
  newLimit: number;
};

export type UpdateUserCommunityLimitResponse = {
  message: string;

  user: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    role: "USER" | "ADMIN" | "SUPER_ADMIN";

    communityCreated: number;
    previousLimit: number;
    communityCreateLimit: number;
    available: number;
  };
};