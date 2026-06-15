import { notFound } from "next/navigation";

import AdminPostAnalyticsView from "@/components/post/post-analytics";
import { mockAdminUsers } from "@/mocks/user-mock";
import { buildMockAdminPostsForUser } from "@/mocks/sample-post-mock";

type AdminPostAnalyticsPageProps = {
  params: Promise<{
    postId: string;
  }>;
};

export default async function AdminPostAnalyticsPage({
  params,
}: AdminPostAnalyticsPageProps) {
  const { postId } = await params;

  const posts = mockAdminUsers.flatMap((user) =>
    buildMockAdminPostsForUser(user),
  );

  const post = posts.find((item) => item.id === postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="-mt-6">
      <AdminPostAnalyticsView post={post} />
    </div>
  );
}