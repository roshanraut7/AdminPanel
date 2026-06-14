"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import { DataTable } from "@/components/common/data-table";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { mockAdminPosts } from "@/mocks/post-mock";
import type { AdminPost } from "@/types/post";

import { createPostColumns } from "@/components/column/post-column";

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<AdminPost[]>(mockAdminPosts);
  const [deletePost, setDeletePost] = useState<AdminPost | null>(null);

  const handleEditPost = useCallback((post: AdminPost) => {
    console.log("Edit post:", post);

    // Later you can redirect to edit page here:
    // router.push(`/admin/posts/${post.id}/edit`);
  }, []);

  const handleOpenDeleteDialog = useCallback((post: AdminPost) => {
    setDeletePost(post);
  }, []);

  const handleConfirmDelete = () => {
    if (!deletePost) return;

    setPosts((previousPosts) =>
      previousPosts.filter((post) => post.id !== deletePost.id),
    );

    setDeletePost(null);
  };

  const columns = useMemo(
    () =>
      createPostColumns({
        onEdit: handleEditPost,
        onDelete: handleOpenDeleteDialog,
      }),
    [handleEditPost, handleOpenDeleteDialog],
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Posts
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Manage community posts, engagement, status and actions.
            </p>
          </div>

          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/posts/create">
              <Plus className="mr-2 size-4" />
              Create Post
            </Link>
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={posts}
          filterKey="title"
          filterPlaceholder="Search posts..."
          resourceLabel="posts"
          emptyMessage="No posts found."
          pageSize={10}
        />
      </div>

      <AlertDialog
        open={Boolean(deletePost)}
        onOpenChange={(open) => {
          if (!open) {
            setDeletePost(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deletePost?.title || "this post"}
              </span>{" "}
              from the posts table.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete post
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}