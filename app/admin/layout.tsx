import type { ReactNode } from "react";

import AdminDashboard from "@/components/dashboard/AdminDashboard";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminDashboard>{children}</AdminDashboard>;
}