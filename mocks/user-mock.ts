import type { AdminUser } from "@/types/user";

export type UserBarChartItem = {
  label: string;
  users: number;
};

// export const mockAdminUsers: AdminUser[] = [
//   {
//     id: "user_001",
//     fullName: "Nikhil Adhikari",
//     email: "nikhil@example.com",
//     avatarUrl: null,
//     status: "ACTIVE",
//     documentVerification: "VERIFIED",
//     district: "Kathmandu",
//     communityCount: 6,
//     postCount: 24,
//     joinedAt: "2026-06-01T10:30:00.000Z",
//   },
//   {
//     id: "user_002",
//     fullName: "Aayush Shrestha",
//     email: "aayush@example.com",
//     avatarUrl: null,
//     status: "PENDING",
//     documentVerification: "PENDING",
//     district: "Lalitpur",
//     communityCount: 2,
//     postCount: 5,
//     joinedAt: "2026-06-03T08:15:00.000Z",
//   },
//   {
//     id: "user_003",
//     fullName: "Sneha Gurung",
//     email: "sneha@example.com",
//     avatarUrl: null,
//     status: "ACTIVE",
//     documentVerification: "NOT_SUBMITTED",
//     district: "Pokhara",
//     communityCount: 4,
//     postCount: 12,
//     joinedAt: "2026-05-28T13:20:00.000Z",
//   },
//   {
//     id: "user_004",
//     fullName: "Rajan Thapa",
//     email: "rajan@example.com",
//     avatarUrl: null,
//     status: "BANNED",
//     documentVerification: "REJECTED",
//     district: "Bhaktapur",
//     communityCount: 1,
//     postCount: 2,
//     joinedAt: "2026-05-20T11:45:00.000Z",
//   },
//   {
//     id: "user_005",
//     fullName: "Maya Tamang",
//     email: "maya@example.com",
//     avatarUrl: null,
//     status: "SUSPENDED",
//     documentVerification: "VERIFIED",
//     district: "Chitwan",
//     communityCount: 3,
//     postCount: 9,
//     joinedAt: "2026-05-15T09:00:00.000Z",
//   },
// ];

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