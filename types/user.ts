export type AdminUserStatus =
  | "ACTIVE"
  | "SUSPENDED"
  | "BANNED"
  | "PENDING";

export type AdminUserDocumentStatus =
  | "VERIFIED"
  | "PENDING"
  | "REJECTED"
  | "NOT_SUBMITTED";

export type AdminUserRole =
  | "USER"
  | "ADMIN"
  | "SUPER_ADMIN";

export type AdminUser = {
  id: string;

  fullName: string;
  firstName: string;
  lastName: string;

  email: string;
  emailVerified: boolean;

  avatarUrl: string | null;
  coverImageUrl: string | null;

  role: AdminUserRole;
  status: AdminUserStatus;

  banned: boolean;
  banReason: string | null;
  banExpires: string | null;

  documentVerification: AdminUserDocumentStatus;

  district: string;
  districtKey: string | null;
  address: string | null;

  businessName: string | null;
  businessType: string | null;
  businessEmail: string | null;
  businessPhoneNo: string | null;

  onboardingCompleted: boolean;

  communityCount: number;
  postCount: number;

  joinedAt: string;
  updatedAt: string;
};