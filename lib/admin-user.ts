import { toAbsoluteFileUrl } from "@/lib/file-url";

import type {
  AdminUser,
  AdminUserDocumentStatus,
  AdminUserRole,
  AdminUserStatus,
} from "@/types/user";

export type BetterAuthAdminUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;

  image?: string | null;
  coverImage?: string | null;

  createdAt: Date | string;
  updatedAt?: Date | string;

  role?: string | null;

  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | string | null;

  firstName?: string | null;
  lastName?: string | null;

  address?: string | null;
  districtKey?: string | null;
  districtName?: string | null;

  businessName?: string | null;
  businessType?: string | null;
  businessEmail?: string | null;
  businessPhoneNo?: string | null;

  onboardingCompleted?: boolean | null;

  isVerified?: boolean | null;
  verificationTrack?: string | null;

  communityCount?: number;
  postCount?: number;

  _count?: {
    communityMemberships?: number;
    communityPosts?: number;
  };
};

function normalizeDate(
  value?: Date | string | null,
): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
}

function getFullName(
  user: BetterAuthAdminUser,
): string {
  const firstName =
    user.firstName?.trim() ?? "";

  const lastName =
    user.lastName?.trim() ?? "";

  const combinedName = [
    firstName,
    lastName,
  ]
    .filter(Boolean)
    .join(" ")
    .trim();

  if (combinedName) {
    return combinedName;
  }

  if (user.name?.trim()) {
    return user.name.trim();
  }

  return user.email;
}

function getRole(
  role?: string | null,
): AdminUserRole {
  if (role === "ADMIN") {
    return "ADMIN";
  }

  if (role === "SUPER_ADMIN") {
    return "SUPER_ADMIN";
  }

  return "USER";
}

export function isBanActive(
  user: Pick<
    BetterAuthAdminUser,
    "banned" | "banExpires"
  >,
): boolean {
  if (!user.banned) {
    return false;
  }

  if (!user.banExpires) {
    return true;
  }

  const expiresAt =
    new Date(user.banExpires).getTime();

  if (Number.isNaN(expiresAt)) {
    return true;
  }

  return expiresAt > Date.now();
}

function getStatus(
  user: BetterAuthAdminUser,
): AdminUserStatus {
  if (isBanActive(user)) {
    return "BANNED";
  }

  if (!user.emailVerified) {
    return "PENDING";
  }

  return "ACTIVE";
}

function getDocumentStatus(
  user: BetterAuthAdminUser,
): AdminUserDocumentStatus {
  if (user.isVerified) {
    return "VERIFIED";
  }

  if (user.verificationTrack) {
    return "PENDING";
  }

  return "NOT_SUBMITTED";
}

export function mapBetterAuthUser(
  user: BetterAuthAdminUser,
): AdminUser {
  return {
    id: user.id,

    fullName: getFullName(user),

    firstName:
      user.firstName?.trim() ?? "",

    lastName:
      user.lastName?.trim() ?? "",

    email: user.email,

    emailVerified:
      Boolean(user.emailVerified),

    avatarUrl:
      toAbsoluteFileUrl(user.image) ??
      null,

    coverImageUrl:
      toAbsoluteFileUrl(
        user.coverImage,
      ) ?? null,

    role: getRole(user.role),

    status: getStatus(user),

    banned: Boolean(user.banned),

    banReason:
      user.banReason?.trim() || null,

    banExpires:
      normalizeDate(user.banExpires),

    documentVerification:
      getDocumentStatus(user),

    district:
      user.districtName?.trim() ||
      "Not provided",

    districtKey:
      user.districtKey?.trim() ||
      null,

    address:
      user.address?.trim() || null,

    businessName:
      user.businessName?.trim() ||
      null,

    businessType:
      user.businessType?.trim() ||
      null,

    businessEmail:
      user.businessEmail?.trim() ||
      null,

    businessPhoneNo:
      user.businessPhoneNo?.trim() ||
      null,

    onboardingCompleted:
      Boolean(
        user.onboardingCompleted,
      ),

    communityCount:
      user.communityCount ??
      user._count
        ?.communityMemberships ??
      0,

    postCount:
      user.postCount ??
      user._count?.communityPosts ??
      0,

    joinedAt:
      normalizeDate(user.createdAt) ??
      new Date(0).toISOString(),

    updatedAt:
      normalizeDate(user.updatedAt) ??
      normalizeDate(user.createdAt) ??
      new Date(0).toISOString(),
  };
}

export function getApiErrorMessage(
  error: unknown,
  fallbackMessage: string,
): string {
  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.trim()
  ) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallbackMessage;
}