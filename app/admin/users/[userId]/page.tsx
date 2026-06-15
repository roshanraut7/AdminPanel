import { notFound } from "next/navigation";

import AdminUserProfileView from "@/components/user-profile";
import { mockAdminUsers } from "@/mocks/user-mock";

type AdminUserProfilePageProps = {
  params: Promise<{
    userId: string;
  }>;
};

export default async function AdminUserProfilePage({
  params,
}: AdminUserProfilePageProps) {
  const { userId } = await params;

  const user = mockAdminUsers.find((item) => item.id === userId);

  if (!user) {
    notFound();
  }

  return <div className="-mt-6">
    <AdminUserProfileView user={user} users={mockAdminUsers} />
  </div> 
}