"use client";

import Link from "next/link";
import type { ElementType } from "react";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Mail,
  MapPin,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react";

import AdminPostCard from "@/components/common/post-card";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { buildMockAdminPostsForUser } from "@/mocks/sample-post-mock";
import type { AdminUser } from "@/types/user";

type AdminUserProfileViewProps = {
  user: AdminUser;
  users: AdminUser[];
};

type MockCommunity = {
  id: string;
  name: string;
  role: string;
  visibility: "PUBLIC" | "PRIVATE";
  members: number;
};

type AdminUserWithProfileExtra = AdminUser & {
  coverImage?: string | null;
  coverImageUrl?: string | null;
  coverUrl?: string | null;
  bio?: string | null;
  description?: string | null;
};

export default function AdminUserProfileView({
  user,
  users,
}: AdminUserProfileViewProps) {
  const preview = buildProfilePreview(user, users);
  const posts = buildMockAdminPostsForUser(user);
  const coverImageUrl = getCoverImageUrl(user, posts);
  const description = getProfileDescription(user);

  return (
    <div className="w-full space-y-6">
      {/* Profile header - no rounded card */}
      <section className="bg-card">
        {/* Cover image - no rounded corner */}
        <div className="relative h-44 overflow-hidden bg-gradient-to-br from-accent via-background to-primary/20 sm:h-56 lg:h-64">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={`${user.fullName} cover`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-accent via-background to-primary/20" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/5" />

          <Link
            href="/admin/users"
            aria-label="Back to users"
            className="absolute left-4 top-4 inline-flex size-9 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm backdrop-blur transition hover:bg-background sm:left-5 sm:top-5"
          >
            <ArrowLeft className="size-4" />
          </Link>
        </div>

        {/* Profile information section - no rounded wrapper */}
        <div className="px-5 pb-6 sm:px-8">
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="-mt-14 shrink-0 sm:-mt-16">
              <UserAvatar
                name={user.fullName}
                avatarUrl={user.avatarUrl}
                large
              />
            </div>

            <div className="min-w-0 pt-0 sm:pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {user.fullName}
                </h1>

                <Badge className={getStatusBadgeClassName(user.status)}>
                  {user.status}
                </Badge>
              </div>

              <p className="mt-1 text-sm font-medium text-muted-foreground">
                {posts.length} posts · {user.communityCount} communities
              </p>
            </div>
          </div>

          <div className="mt-5 max-w-5xl">
            <p className="max-w-4xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
              {description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2.5 text-sm font-medium text-muted-foreground">
              <ProfileInfoText icon={Mail} label={user.email} />
              <ProfileInfoText icon={MapPin} label={user.district} />
              <ProfileInfoText
                icon={CalendarDays}
                label={`Joined ${formatDate(user.joinedAt)}`}
              />
              <ProfileInfoText
                icon={Building2}
                label={`${user.communityCount} communities`}
              />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-7 gap-y-3">
              <ProfileInlineStat
                icon={Newspaper}
                label="Posts"
                value={posts.length}
              />
              <ProfileInlineStat
                icon={Building2}
                label="Communities"
                value={user.communityCount}
              />
              <ProfileInlineStat
                icon={UserPlus}
                label="Followers"
                value={preview.followers.length}
              />
              <ProfileInlineStat
                icon={UserCheck}
                label="Following"
                value={preview.following.length}
              />
            </div>
          </div>
        </div>
      </section>

      <Tabs defaultValue="posts" className="space-y-5">
        <TabsList variant="line" className="min-w-max bg-transparent px-0">
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="communities">Communities</TabsTrigger>
          <TabsTrigger value="followers">Followers</TabsTrigger>
          <TabsTrigger value="following">Following</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="mt-0">
          {posts.length > 0 ? (
            <div className="grid w-full gap-5 md:grid-cols-2 xl:grid-cols-3">
              {posts.map((post) => (
                <AdminPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <EmptyTabState
              icon={Newspaper}
              title="No posts yet"
              description="This user has not created any posts in the mock data."
            />
          )}
        </TabsContent>

        <TabsContent value="about" className="mt-0">
          <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
            <section className="bg-card p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-semibold tracking-wide text-foreground">
                Basic information
              </h3>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <InfoCard label="Full name" value={user.fullName} />
                <InfoCard label="Email" value={user.email} />
                <InfoCard label="District" value={user.district} />
                <InfoCard label="Joined" value={formatDate(user.joinedAt)} />
                <InfoCard
                  label="Status"
                  value={user.status}
                  badgeClassName={getStatusBadgeClassName(user.status)}
                />
                <InfoCard
                  label="Document"
                  value={user.documentVerification}
                  badgeClassName={getDocumentBadgeClassName(
                    user.documentVerification
                  )}
                />
              </dl>
            </section>

            <section className="bg-card p-5 shadow-sm sm:p-6">
              <h3 className="text-sm font-semibold tracking-wide text-foreground">
                Account review
              </h3>

              <div className="mt-4 space-y-2.5">
                <ReviewRow
                  valid={user.status !== "BANNED"}
                  label={
                    user.status === "BANNED"
                      ? "Account is currently banned"
                      : "Account is active"
                  }
                />

                <ReviewRow
                  valid={user.documentVerification === "VERIFIED"}
                  label={
                    user.documentVerification === "VERIFIED"
                      ? "Document is verified"
                      : "Document needs admin review"
                  }
                />

                <ReviewRow
                  valid={posts.length > 0}
                  label={`${posts.length} posts available in mock data`}
                />

                <ReviewRow
                  valid={user.communityCount > 0}
                  label={`${user.communityCount} community connections`}
                />
              </div>
            </section>
          </div>
        </TabsContent>

        <TabsContent value="communities" className="mt-0">
          {preview.communities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {preview.communities.map((community) => (
                <article
                  key={community.id}
                  className="flex items-start gap-3 bg-card p-5 shadow-sm"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Building2 className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">
                        {community.name}
                      </h3>

                      <Badge variant="outline">{community.role}</Badge>
                    </div>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {community.members} members ·{" "}
                      {community.visibility.toLowerCase()} community
                    </p>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyTabState
              icon={Building2}
              title="No communities"
              description="This user is not connected with any community in the mock data."
            />
          )}
        </TabsContent>

        <TabsContent value="followers" className="mt-0">
          {preview.followers.length > 0 ? (
            <UserMiniGrid users={preview.followers} />
          ) : (
            <EmptyTabState
              icon={Users}
              title="No followers"
              description="No follower records are available in the mock data."
            />
          )}
        </TabsContent>

        <TabsContent value="following" className="mt-0">
          {preview.following.length > 0 ? (
            <UserMiniGrid users={preview.following} />
          ) : (
            <EmptyTabState
              icon={UserCheck}
              title="Not following anyone"
              description="No following records are available in the mock data."
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function UserAvatar({
  name,
  avatarUrl,
  large = false,
}: {
  name: string;
  avatarUrl?: string | null;
  large?: boolean;
}) {
  const sizeClass = large
    ? "size-28 rounded-full border-[5px] text-3xl sm:size-36 sm:text-4xl"
    : "size-12 rounded-full text-sm";

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={`${sizeClass} shrink-0 border-card bg-card object-cover shadow-lg`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center border-card bg-primary font-bold text-primary-foreground shadow-lg`}
    >
      {getInitials(name)}
    </div>
  );
}

function ProfileInfoText({
  icon: Icon,
  label,
}: {
  icon: ElementType;
  label: string;
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2">
      <Icon className="size-4 shrink-0 text-primary" />
      <span className="truncate">{label || "-"}</span>
    </span>
  );
}

function ProfileInlineStat({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
      <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="size-4" />
      </span>

      <span className="font-bold text-foreground">{value}</span>
      <span className="font-medium">{label}</span>
    </div>
  );
}

function InfoCard({
  label,
  value,
  badgeClassName,
}: {
  label: string;
  value: string;
  badgeClassName?: string;
}) {
  return (
    <div className="bg-background p-3">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>

      {badgeClassName ? (
        <dd className="mt-1.5">
          <Badge className={badgeClassName}>{value}</Badge>
        </dd>
      ) : (
        <dd className="mt-1 break-words text-sm font-semibold text-foreground">
          {value || "-"}
        </dd>
      )}
    </div>
  );
}

function ReviewRow({ valid, label }: { valid: boolean; label: string }) {
  return (
    <div className="flex items-center gap-3 bg-background p-3">
      <div
        className={
          valid
            ? "flex size-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary"
            : "flex size-9 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive"
        }
      >
        {valid ? (
          <ShieldCheck className="size-4" />
        ) : (
          <ShieldAlert className="size-4" />
        )}
      </div>

      <p className="text-sm font-medium text-foreground">{label}</p>
    </div>
  );
}

function EmptyTabState({
  icon: Icon,
  title,
  description,
}: {
  icon: ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex min-h-[260px] flex-col items-center justify-center bg-card p-8 text-center shadow-sm">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-accent text-primary">
        <Icon className="size-6" />
      </div>

      <h3 className="mt-4 font-semibold text-foreground">{title}</h3>

      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function UserMiniGrid({ users }: { users: AdminUser[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="flex items-center justify-between gap-3 bg-card p-4 shadow-sm"
        >
          <div className="flex min-w-0 items-center gap-3">
            <UserAvatar name={user.fullName} avatarUrl={user.avatarUrl} />

            <div className="min-w-0">
              <h3 className="truncate font-semibold text-foreground">
                {user.fullName}
              </h3>

              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>

          <Badge className={getStatusBadgeClassName(user.status)}>
            {user.status}
          </Badge>
        </div>
      ))}
    </div>
  );
}

function buildProfilePreview(user: AdminUser, allUsers: AdminUser[]) {
  const otherUsers = allUsers.filter((item) => item.id !== user.id);

  const followers = otherUsers.slice(0, 6);
  const following = otherUsers.slice().reverse().slice(0, 6);

  const communities: MockCommunity[] = Array.from({
    length: Math.min(user.communityCount, 5),
  }).map((_, index) => {
    const roles = ["Owner", "Moderator", "Member", "Member", "Member"];

    return {
      id: `${user.id}-community-${index + 1}`,
      name:
        index === 0
          ? `${user.district} Community`
          : `Community Group ${index + 1}`,
      role: roles[index] ?? "Member",
      visibility: index % 2 === 0 ? "PUBLIC" : "PRIVATE",
      members: 120 + index * 37,
    };
  });

  return {
    communities,
    followers,
    following,
  };
}

function getCoverImageUrl(
  user: AdminUser,
  posts: ReturnType<typeof buildMockAdminPostsForUser>,
) {
  const profileUser = user as AdminUserWithProfileExtra;

  return (
    profileUser.coverImageUrl ||
    profileUser.coverImage ||
    profileUser.coverUrl ||
    posts[0]?.media?.[0]?.url ||
    null
  );
}

function getProfileDescription(user: AdminUser) {
  const profileUser = user as AdminUserWithProfileExtra;

  if (profileUser.bio) {
    return profileUser.bio;
  }

  if (profileUser.description) {
    return profileUser.description;
  }

  return `Admin profile overview for ${user.fullName}. Review this user's posts, communities, document verification, account status, and platform activity from one place.`;
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
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusBadgeClassName(status: AdminUser["status"]) {
  if (status === "BANNED") {
    return "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/90";
  }

  if (status === "PENDING") {
    return "border-transparent bg-[#b2c9c5]/35 text-[#055b65] hover:bg-[#b2c9c5]/45";
  }

  return "border-transparent bg-primary text-primary-foreground hover:bg-primary/90";
}

function getDocumentBadgeClassName(documentStatus: string) {
  if (documentStatus === "VERIFIED") {
    return "border-transparent bg-accent text-accent-foreground";
  }

  if (documentStatus === "REJECTED") {
    return "border-transparent bg-destructive/10 text-destructive";
  }

  return "border-transparent bg-[#b2c9c5]/30 text-[#055b65]";
}