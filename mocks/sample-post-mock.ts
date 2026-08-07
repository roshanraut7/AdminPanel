import type { AdminUser } from "@/types/user";

export type AdminPostMedia = {
  id: string;
  url: string;
  alt: string;
};

export type AdminMockPost = {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatarUrl?: string | null;
  title: string;
  description: string;
  community: string;
  tag: "GENERAL" | "QUESTION" | "ANNOUNCEMENT" | "OFFER" | "HELP";
  createdAt: string;
  media: AdminPostMedia[];
  likes: number;
  dislikes: number;
  comments: number;
  shares: number;
};

/**
 * Only the user fields required for generating mock posts.
 *
 * This means we do NOT need the complete AdminUser object.
 */
export type MockPostUser = Pick<
  AdminUser,
  | "id"
  | "fullName"
  | "avatarUrl"
  | "district"
  | "postCount"
  | "joinedAt"
>;

const samplePostImages = [
  "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1511632765486-a01980e01a18?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=1200&auto=format&fit=crop",
];

export function buildMockAdminPostsForUser(
  user: MockPostUser,
): AdminMockPost[] {
  const totalPosts = Math.max(user.postCount, 0);

  const postTemplates = [
    {
      title: "Community update shared with members",
      description:
        "The user shared a local community update with useful information for nearby members.",
      tag: "ANNOUNCEMENT" as const,
    },
    {
      title: "Asked for help from the community",
      description:
        "The user created a discussion post asking members for suggestions and support.",
      tag: "HELP" as const,
    },
    {
      title: "Posted a local recommendation",
      description:
        "The user recommended a place, service or useful contact inside the community.",
      tag: "GENERAL" as const,
    },
    {
      title: "Started a community discussion",
      description:
        "The user opened a discussion thread to collect opinions from other members.",
      tag: "QUESTION" as const,
    },
    {
      title: "Shared an offer with local users",
      description:
        "The user published a mock offer post visible to members in the community.",
      tag: "OFFER" as const,
    },
    {
      title: "Published a member notice",
      description:
        "The user shared a short notice for community members using mock activity data.",
      tag: "ANNOUNCEMENT" as const,
    },
  ];

  return Array.from({
    length: Math.min(totalPosts, 8),
  }).map((_, index) => {
    const template =
      postTemplates[index % postTemplates.length];

    return {
      id: `${user.id}-post-${index + 1}`,

      authorId: user.id,
      authorName: user.fullName,
      authorAvatarUrl: user.avatarUrl,

      title: template.title,
      description: template.description,

      community: `${user.district} Community`,

      tag: template.tag,

      createdAt: user.joinedAt,

      media: [
        {
          id: `${user.id}-post-${index + 1}-media-1`,
          url:
            samplePostImages[
              index % samplePostImages.length
            ],
          alt: `${template.title} image 1`,
        },
        {
          id: `${user.id}-post-${index + 1}-media-2`,
          url:
            samplePostImages[
              (index + 1) % samplePostImages.length
            ],
          alt: `${template.title} image 2`,
        },
        {
          id: `${user.id}-post-${index + 1}-media-3`,
          url:
            samplePostImages[
              (index + 2) % samplePostImages.length
            ],
          alt: `${template.title} image 3`,
        },
      ],

      likes: 18 + index * 6,
      dislikes: index % 2 === 0 ? 1 : 3,
      comments: 5 + index * 2,
      shares: 2 + index,
    };
  });
}