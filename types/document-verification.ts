export type VerificationTrack =
  | "BUSINESS"
  | "TRAINING"
  | "INDIVIDUAL";

export type VerificationDocumentType =
  | "PAN"
  | "CITIZENSHIP"
  | "INSTITUTE_CERTIFICATE";

export type VerificationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED";

export interface VerificationRequestUser {
  id: string;
  name: string;
  email: string;

  businessName: string | null;
  businessType: string | null;
  image: string | null;
}

export interface VerificationRequest {
  id: string;
  userId: string;

  track: VerificationTrack;
  documentType: VerificationDocumentType;
  documentNumber: string | null;

  documentFrontUrl: string | null;
  documentBackUrl: string | null;

  status: VerificationStatus;

  rejectionReason: string | null;
  reviewedById: string | null;
  reviewedAt: string | null;

  createdAt: string;
  updatedAt: string;

  user: VerificationRequestUser;
}

export interface VerificationPaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PendingVerificationResponse {
  data: VerificationRequest[];

  meta: VerificationPaginationMeta;
}

export interface VerificationReviewResponse {
  message: string;
  request: VerificationRequest;
}

export interface PendingVerificationQuery {
  page: number;
  limit: number;
}