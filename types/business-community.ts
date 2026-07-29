export type BusinessCommunityRequestStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export type CommunityVisibility =
  | "PUBLIC"
  | "PRIVATE";

export type VerificationTrack =
  | "BUSINESS"
  | "TRAINING"
  | "INDIVIDUAL";

export type BusinessCommunityRequestUser = {
  id: string;
  name: string;
  email: string;
  businessName: string | null;
  verificationTrack: VerificationTrack | null;
  image: string | null;
};

export type BusinessCommunityRequestCategory = {
  id: string;
  name: string;
  slug: string;
};

export type BusinessCommunityRequest = {
  id: string;
  userId: string;

  name: string;
  description: string | null;

  categoryId: string;
  category: BusinessCommunityRequestCategory;

  visibility: CommunityVisibility;

  avatarImage: string | null;
  coverImage: string | null;

  status: BusinessCommunityRequestStatus;

  rejectionReason: string | null;

  reviewedById: string | null;
  reviewedAt: string | null;

  createdCommunityId: string | null;

  createdAt: string;
  updatedAt: string;

  user: BusinessCommunityRequestUser;
};

export type BusinessCommunityRequestsResponse = {
  data: BusinessCommunityRequest[];

  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type BusinessCommunityRequestsQuery = {
  status: BusinessCommunityRequestStatus;
  page?: number;
  limit?: number;
};

export type SubmitBusinessCommunityRequestInput = {
  name: string;
  description?: string;
  categoryId: string;
  visibility?: CommunityVisibility;
  avatarImage?: string | null;
  coverImage?: string | null;
};

export type SubmitBusinessCommunityRequestResponse = {
  message: string;
  request: BusinessCommunityRequest;
};

export type ApproveBusinessCommunityRequestResponse = {
  message: string;
  request: BusinessCommunityRequest;

  community: {
    id: string;
    name: string;
    [key: string]: unknown;
  };
};

export type RejectBusinessCommunityRequestInput = {
  requestId: string;
  reason: string;
};

export type RejectBusinessCommunityRequestResponse = {
  message: string;
  request: BusinessCommunityRequest;
};

export type MyBusinessCommunityRequestResponse = {
  latestRequest: BusinessCommunityRequest | null;
};