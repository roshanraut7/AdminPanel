import type { AdminUser } from "@/types/user";

export type UserBarChartItem = {
  label: string;
  users: number;
};

export type MockAdminUser = Pick<
  AdminUser,
  | "id"
  | "fullName"
  | "email"
  | "avatarUrl"
  | "status"
  | "documentVerification"
  | "district"
  | "communityCount"
  | "postCount"
  | "joinedAt"
>;

export const mockAdminUsers: MockAdminUser[] = [
  {
    id: "user_001",
    fullName: "Nikhil Adhikari",
    email: "nikhil@example.com",
    avatarUrl: null,
    status: "ACTIVE",
    documentVerification: "VERIFIED",
    district: "Kathmandu",
    communityCount: 6,
    postCount: 24,
    joinedAt: "2026-06-01T10:30:00.000Z",
  },
  {
    id: "user_002",
    fullName: "Aayush Shrestha",
    email: "aayush@example.com",
    avatarUrl: null,
    status: "PENDING",
    documentVerification: "PENDING",
    district: "Lalitpur",
    communityCount: 2,
    postCount: 5,
    joinedAt: "2026-06-03T08:15:00.000Z",
  },
];

export const monthlyUserChartData: UserBarChartItem[] = [
  { label: "Jan", users: 38 },
  { label: "Feb", users: 75 },
  { label: "Mar", users: 44 },
  { label: "Apr", users: 62 },
  { label: "May", users: 49 },
  { label: "Jun", users: 57 },
  { label: "Jul", users: 69 },
  { label: "Aug", users: 31 },
  { label: "Sep", users: 53 },
  { label: "Oct", users: 82 },
  { label: "Nov", users: 64 },
  { label: "Dec", users: 42 },
];

export const yearlyUserChartData: UserBarChartItem[] = [
  { label: "2021", users: 340 },
  { label: "2022", users: 520 },
  { label: "2023", users: 760 },
  { label: "2024", users: 980 },
  { label: "2025", users: 1240 },
  { label: "2026", users: 1460 },
];  