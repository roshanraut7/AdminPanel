export type PostTab = "text" | "media" | "link" | "poll";

export type PostTag =
  | "GENERAL"
  | "ANNOUNCEMENT"
  | "QUESTION"
  | "OFFER"
  | "EVENT"
  | "NEWS";

export type PostVisibility = "PUBLIC" | "COMMUNITY" | "PRIVATE";

export type CommunityVisibility = "PUBLIC" | "PRIVATE";

export type AdminCommunity = {
  id: string;
  name: string;
  visibility: CommunityVisibility;
  purpose?: "NORMAL" | "DISTRICT_OFFICIAL";
  memberCount: number;
};

export type AdminDraftPost = {
  id: string;
  title: string;
  communityId: string;
  tag: PostTag;
  visibility: PostVisibility;
  postTab: PostTab;
  contentHtml: string;
  linkUrl?: string;
  updatedAt: string;
};

export type SampleMediaItem = {
  id: string;
  url: string;
  name: string;
};

export const sampleCommunities: AdminCommunity[] = [
  {
    id: "community-kathmandu",
    name: "Kathmandu Community",
    visibility: "PUBLIC",
    purpose: "NORMAL",
    memberCount: 2450,
  },
  {
    id: "community-baitadi",
    name: "Baitadi Community",
    visibility: "PUBLIC",
    purpose: "NORMAL",
    memberCount: 420,
  },
  {
    id: "community-business",
    name: "Business Owners Nepal",
    visibility: "PRIVATE",
    purpose: "NORMAL",
    memberCount: 310,
  },
  {
    id: "official-district",
    name: "Official District Community",
    visibility: "PUBLIC",
    purpose: "DISTRICT_OFFICIAL",
    memberCount: 1120,
  },
];

export const sampleTagOptions: {
  value: PostTag;
  label: string;
  description: string;
}[] = [
  {
    value: "GENERAL",
    label: "General",
    description: "Normal community update",
  },
  {
    value: "ANNOUNCEMENT",
    label: "Announcement",
    description: "Important official notice",
  },
  {
    value: "QUESTION",
    label: "Question",
    description: "Ask members for help",
  },
  {
    value: "OFFER",
    label: "Offer",
    description: "Promotion or discount",
  },
  {
    value: "EVENT",
    label: "Event",
    description: "Community event update",
  },
  {
    value: "NEWS",
    label: "News",
    description: "News or information post",
  },
];

export const sampleVisibilityOptions: {
  value: PostVisibility;
  label: string;
  description: string;
}[] = [
  {
    value: "PUBLIC",
    label: "Public",
    description: "Visible to everyone",
  },
  {
    value: "COMMUNITY",
    label: "Community",
    description: "Visible to community members",
  },
  {
    value: "PRIVATE",
    label: "Private",
    description: "Visible to selected/private members",
  },
];

export const sampleDraftPosts: AdminDraftPost[] = [
  {
    id: "draft-1",
    title: "Welcome update for new members",
    communityId: "community-kathmandu",
    tag: "ANNOUNCEMENT",
    visibility: "PUBLIC",
    postTab: "text",
    contentHtml:
      "<p>Welcome to our community. Please respect each other and share useful updates.</p>",
    updatedAt: "Today, 10:20 AM",
  },
  {
    id: "draft-2",
    title: "Weekend business meetup",
    communityId: "community-business",
    tag: "EVENT",
    visibility: "COMMUNITY",
    postTab: "poll",
    contentHtml: "<p>We are planning a small meetup this weekend.</p>",
    updatedAt: "Yesterday, 8:40 PM",
  },
];

export const sampleMediaItems: SampleMediaItem[] = [
  {
    id: "sample-media-1",
    name: "community-cover.jpg",
    url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "sample-media-2",
    name: "announcement.jpg",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=1200&auto=format&fit=crop",
  },
];