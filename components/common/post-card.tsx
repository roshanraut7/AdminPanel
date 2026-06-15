"use client";

import { useCallback, useState, type ElementType, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  EllipsisVertical,
  ImageIcon,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  BarChart3,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { AdminMockPost } from "@/mocks/sample-post-mock";

type AdminPostCardProps = {
  post: AdminMockPost;
};

export default function AdminPostCard({ post }: AdminPostCardProps) {
  const router = useRouter();

  const totalReactions = post.likes + post.dislikes;

  const [deletePost, setDeletePost] = useState<AdminMockPost | null>(null);

  const handleOpenDeleteDialog = useCallback(() => {
    setDeletePost(post);
  }, [post]);

  const handleViewAnalytics = useCallback(() => {
    router.push(`/admin/posts/${post.id}/analytics`);
  }, [router, post.id]);

  const handleConfirmDelete = useCallback(() => {
    if (!deletePost) return;

    console.log("Delete confirmed for post:", deletePost.id);

    // Later you can call backend delete API here
    // await deletePostMutation(deletePost.id)

    setDeletePost(null);
  }, [deletePost]);

  return (
    <>
      <Card className="overflow-hidden rounded-2xl border-border bg-card shadow-sm hover:border-primary/20 hover:shadow-md">
        <CardHeader className="space-y-3 p-4 pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 shrink-0 items-center gap-3">
              <PostAvatar
                name={post.authorName}
                avatarUrl={post.authorAvatarUrl}
              />

              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="truncate text-sm font-semibold leading-none text-foreground">
                    {post.authorName}
                  </h3>

                  <span className="shrink-0 px-2 py-2 text-xs text-muted-foreground">
                    posted in
                  </span>

                  <Badge
                    variant="outline"
                    className="h-5 rounded-md px-1.5 text-[10px] font-medium"
                  >
                    {post.community}
                  </Badge>
                </div>

                <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays className="size-3.5" />
                    {formatDate(post.createdAt)}
                  </span>

                  <span>•</span>

                  <span>{post.tag}</span>
                </div>
              </div>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-accent hover:text-primary"
                >
                  <EllipsisVertical className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuItem
                  onClick={handleViewAnalytics}
                  className="cursor-pointer gap-2"
                >
                  <BarChart3 className="size-4" />
                  View analytics
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={handleOpenDeleteDialog}
                  className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-4" />
                  Delete post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="space-y-1">
            <h2 className="line-clamp-2 text-[15px] font-semibold leading-6 text-foreground">
              {post.title}
            </h2>

            <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
              {post.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0 pt-0">
          {post.media.length > 0 ? (
            <div className="relative border-y border-border bg-muted/40">
              <Carousel className="w-full">
                <CarouselContent className="ml-0">
                  {post.media.map((media) => (
                    <CarouselItem key={media.id} className="pl-0">
                      <div className="relative h-[260px] w-full overflow-hidden bg-muted md:h-[280px]">
                        <img
                          src={media.url}
                          alt={media.alt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {post.media.length > 1 ? (
                  <>
                    <CarouselPrevious className="left-3 size-8 border-white/50 bg-white/90 text-foreground shadow-sm hover:bg-white" />
                    <CarouselNext className="right-3 size-8 border-white/50 bg-white/90 text-foreground shadow-sm hover:bg-white" />
                  </>
                ) : null}
              </Carousel>
            </div>
          ) : (
            <div className="mx-4 flex h-[260px] items-center justify-center rounded-xl border border-dashed border-border bg-muted/40">
              <div className="flex flex-col items-center text-muted-foreground">
                <ImageIcon className="size-8" />
                <p className="mt-2 text-sm">No media attached</p>
              </div>
            </div>
          )}

          <div className="px-4 py-3">
            <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="flex gap-2">
                  <ReactionBubble className="bg-primary text-primary-foreground">
                    <ThumbsUp className="size-3" />
                  </ReactionBubble>

                  <ReactionBubble className="bg-muted text-destructive-foreground">
                    <ThumbsDown className="size-3" />
                  </ReactionBubble>
                </div>

                <span>{totalReactions} reactions</span>
              </div>

              <div className="flex items-center gap-3">
                <span>{post.comments} comments</span>
                <span>{post.shares} shares</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2">
          <PostAction icon={ThumbsUp} label="Like" value={post.likes} />
          <PostAction icon={ThumbsDown} label="Dislike" value={post.dislikes} />
          <PostAction
            icon={MessageCircle}
            label="Comment"
            value={post.comments}
          />
          <PostAction icon={Share2} label="Share" value={post.shares} />
        </CardFooter>
      </Card>

      <AlertDialog
        open={Boolean(deletePost)}
        onOpenChange={(open) => {
          if (!open) setDeletePost(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this post?</AlertDialogTitle>

            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the post
              titled{" "}
              <span className="font-medium text-foreground">
                “{deletePost?.title}”
              </span>
              .
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

function PostAvatar({
  name,
  avatarUrl,
}: {
  name: string;
  avatarUrl?: string | null;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className="size-10 rounded-full border border-border object-cover"
      />
    );
  }

  return (
    <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
      {getInitials(name)}
    </div>
  );
}

function ReactionBubble({
  children,
  className,
}: {
  children: ReactNode;
  className: string;
}) {
  return (
    <div
      className={`flex size-5 items-center justify-center rounded-full ring-2 ring-card ${className}`}
    >
      {children}
    </div>
  );
}

function PostAction({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: number;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      className="h-9 gap-1.5 rounded-lg px-3 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-primary"
    >
      <Icon className="size-4" />
      <span>{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </Button>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((item) => item[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}