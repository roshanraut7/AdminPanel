export type AdminUserStatus = "ACTIVE" | "SUSPENDED" | "BANNED" | "PENDING";

export type AdminUserDocumentStatus =
  | "VERIFIED"
  | "PENDING"
  | "REJECTED"
  | "NOT_SUBMITTED";

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  status: AdminUserStatus;
  documentVerification: AdminUserDocumentStatus;
  district: string;
  communityCount: number;
  postCount: number;
  joinedAt: string;
};