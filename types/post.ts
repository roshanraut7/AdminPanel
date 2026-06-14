export type AdminPostStatus = "PUBLISHED" | "HIDDEN" | "REMOVED" | "DRAFT";

export type AdminPostType = "TEXT" | "MEDIA" | "LINK" | "POLL";

export type AdminPost = {
  id: string;
  title: string;
  content: string;
  type: AdminPostType;
  tag: string;
  status: AdminPostStatus;
  authorName: string;
  communityName: string;
  likeCount: number;
  commentCount: number;
  shareCount: number;
  createdAt: string;
};