"use client";

import Link from "next/link";
import { useMemo, useState, type ElementType, type ReactNode } from "react";
import {
  ArrowLeft,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Eye,
  MessageCircle,
  Share2,
  ThumbsDown,
  ThumbsUp,
  Timer,
} from "lucide-react";

import { ReusableBarChartCard } from "@/components/charts/reusable-bar-chart-card";
import { ReusablePieChartCard } from "../charts/pie-chart";
import { GrowthAreaChart } from "@/components/charts/growth-area-chart";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import type { AdminMockPost } from "@/mocks/sample-post-mock";

type AdminPostAnalyticsViewProps = {
  post: AdminMockPost;
};

type AnalyticsTab = "overview" | "engagement" | "feedback";

type TimeRange = "LAST_7_DAYS" | "LAST_30_DAYS" | "LAST_90_DAYS" | "ALL_TIME";

type MetricChangeType = "up" | "down" | "neutral";

const TIME_RANGE_OPTIONS: {
  label: string;
  value: TimeRange;
}[] = [
  {
    label: "Last 7 days",
    value: "LAST_7_DAYS",
  },
  {
    label: "Last 30 days",
    value: "LAST_30_DAYS",
  },
  {
    label: "Last 90 days",
    value: "LAST_90_DAYS",
  },
  {
    label: "All time",
    value: "ALL_TIME",
  },
];

export default function AdminPostAnalyticsView({
  post,
}: AdminPostAnalyticsViewProps) {
  const [tab, setTab] = useState<AnalyticsTab>("overview");
  const [timeRange, setTimeRange] = useState<TimeRange>("LAST_7_DAYS");

  const analytics = useMemo(() => {
    return buildMockPostAnalytics(post, timeRange);
  }, [post, timeRange]);

  return (
    <div className="w-full space-y-6">
      <section className="bg-card p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <div className="flex min-w-0 flex-wrap items-center gap-3">
              <Link
                href="/admin/users"
                aria-label="Back"
                className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-primary transition hover:bg-accent/80"
              >
                <ArrowLeft className="size-4" />
              </Link>

              <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                Post Analytics
              </h1>

              <Badge variant="outline">{post.tag}</Badge>

              <Badge variant="outline">{post.community}</Badge>
            </div>

            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Track post views, engagement, feedback and audience performance.
            </p>
          </div>

          <TimeRangeFilter value={timeRange} onChange={setTimeRange} />
        </div>
      </section>

      <PostPreviewCard post={post} analytics={analytics} />

      <Tabs
        value={tab}
        onValueChange={(value) => setTab(value as AnalyticsTab)}
        className="space-y-5"
      >
        <TabsList variant="line" className="min-w-max bg-transparent px-0">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-0">
          <OverviewTab post={post} analytics={analytics} />
        </TabsContent>

        <TabsContent value="engagement" className="mt-0">
          <EngagementTab analytics={analytics} />
        </TabsContent>

        <TabsContent value="feedback" className="mt-0">
          <FeedbackTab analytics={analytics} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PostPreviewCard({
  post,
  analytics,
}: {
  post: AdminMockPost;
  analytics: ReturnType<typeof buildMockPostAnalytics>;
}) {
  const thumbnail = post.media[0]?.url;

  return (
    <section className="grid gap-5 bg-card p-5 shadow-sm sm:p-6 lg:grid-cols-[340px_1fr]">
      <div className="overflow-hidden rounded-2xl bg-muted">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={post.media[0]?.alt || post.title}
            className="h-64 w-full object-cover lg:h-full"
          />
        ) : (
          <div className="flex h-64 items-center justify-center text-muted-foreground">
            <BarChart3 className="size-10" />
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="bg-primary text-primary-foreground">
            {post.tag}
          </Badge>

          <Badge variant="outline">{post.community}</Badge>

          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <CalendarDays className="size-3.5" />
            {formatDate(post.createdAt)}
          </span>
        </div>

        <h2 className="mt-3 text-xl font-bold tracking-tight text-foreground">
          {post.title}
        </h2>

        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {post.description}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          <PreviewMetric icon={ThumbsUp} label="Likes" value={post.likes} />

          <PreviewMetric
            icon={ThumbsDown}
            label="Dislikes"
            value={post.dislikes}
          />

          <PreviewMetric
            icon={MessageCircle}
            label="Comments"
            value={post.comments}
          />

          <PreviewMetric icon={Share2} label="Shares" value={post.shares} />
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
          <span>
            Approval rate:{" "}
            <strong className="text-foreground">
              {analytics.approvalRate.toFixed(1)}%
            </strong>
          </span>

          <span>
            Total actions:{" "}
            <strong className="text-foreground">
              {formatCompactNumber(analytics.totalActions)}
            </strong>
          </span>
        </div>
      </div>
    </section>
  );
}

function OverviewTab({
  post,
  analytics,
}: {
  post: AdminMockPost;
  analytics: ReturnType<typeof buildMockPostAnalytics>;
}) {
  const last7DaysAnalytics = useMemo(() => {
    return buildMockPostAnalytics(post, "LAST_7_DAYS");
  }, [post]);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <MetricCard
          icon={Eye}
          title="Total Views"
          subtitle="Total post views"
          value={formatCompactNumber(analytics.totalViews)}
          changeType="up"
        
        />

        <MetricCard
          icon={ThumbsUp}
          title="Likes"
          subtitle="People liked this post"
          value={formatCompactNumber(post.likes)}
          changeType="up"
        />

        <MetricCard
          icon={ThumbsDown}
          title="Dislikes"
          subtitle="Negative reactions"
          value={formatCompactNumber(post.dislikes)}
          changeType="down"
        />

        <MetricCard
          icon={MessageCircle}
          title="Comments"
          subtitle="Total comments"
          value={formatCompactNumber(post.comments)}
          changeType="up"
        />

        <MetricCard
          icon={Share2}
          title="Shares"
          subtitle="Total post shares"
          value={formatCompactNumber(post.shares)}
          changeType="up"
        />

        <MetricCard
          icon={Timer}
          title="Avg. Screen Time"
          subtitle="Time spent on post"
          value={`${analytics.averageScreenTimeSeconds}s`}
          changeType="up"
        />
      </div>

      <GrowthAreaChart
        title="Last 7 days trend"
        description="Daily views and likes trend for this post."
        data={last7DaysAnalytics.performance}
        series={[
          {
            dataKey: "views",
            label: "Views",
          },
          {
            dataKey: "likes",
            label: "Likes",
          },
        ]}
        showControls={false}
        height={340}
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <SectionCard
          title="Traffic sources"
          description="Where people found this post."
        >
          <div className="space-y-4">
            {analytics.trafficSources.map((source) => (
              <ProgressRow
                key={source.label}
                label={source.label}
                value={`${formatCompactNumber(source.views)} views`}
                percentage={source.percentage}
              />
            ))}
          </div>
        </SectionCard>

        <ReusablePieChartCard
          title="Audience by district"
          subtitle="Top districts viewing this post."
          data={analytics.districts}
          nameKey="label"
          valueKey="viewers"
          valueLabel="Viewers"
          totalLabel="Total viewers"
          formatValue={formatCompactNumber}
        />
      </div>
    </div>
  );
}

function EngagementTab({
  analytics,
}: {
  analytics: ReturnType<typeof buildMockPostAnalytics>;
}) {
  return (
    <div className="grid gap-5 xl:grid-cols-2">
      <SectionCard title="Reaction summary">
        <div className="divide-y divide-border">
          <DetailRow label="Likes" value={formatCompactNumber(analytics.likes)} />

          <DetailRow
            label="Dislikes"
            value={formatCompactNumber(analytics.dislikes)}
          />

          <DetailRow
            label="Total reactions"
            value={formatCompactNumber(analytics.totalReactions)}
          />

          <DetailRow
            label="Approval rate"
            value={`${analytics.approvalRate.toFixed(1)}%`}
          />
        </div>

        <div className="mt-5">
          <div className="flex h-3 overflow-hidden rounded-full bg-muted">
            <div
              className="bg-primary"
              style={{
                width: `${analytics.approvalRate}%`,
              }}
            />

            <div
              className="bg-destructive"
              style={{
                width: `${100 - analytics.approvalRate}%`,
              }}
            />
          </div>

          <div className="mt-3 flex items-center gap-5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              Likes
            </span>

            <span className="inline-flex items-center gap-2">
              <span className="size-2 rounded-full bg-destructive" />
              Dislikes
            </span>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Discussion activity">
        <div className="divide-y divide-border">
          <DetailRow
            label="Main comments"
            value={formatCompactNumber(analytics.mainComments)}
          />

          <DetailRow
            label="Replies"
            value={formatCompactNumber(analytics.replies)}
          />

          <DetailRow
            label="Total discussion"
            value={formatCompactNumber(analytics.totalComments)}
          />
        </div>
      </SectionCard>

      <ReusableBarChartCard
        title="Likes performance"
        subtitle="Daily likes trend based on the selected time period."
        data={analytics.performance}
        labelKey="label"
        valueKey="likes"
        valueLabel="Likes"
        totalLabel="Total likes"
        showMenu={false}
        formatValue={formatCompactNumber}
      />

      <ReusableBarChartCard
        title="Comments performance"
        subtitle="Daily comment trend based on the selected time period."
        data={analytics.performance}
        labelKey="label"
        valueKey="comments"
        valueLabel="Comments"
        totalLabel="Total comments"
        showMenu={false}
        formatValue={formatCompactNumber}
      />

      <ReusableBarChartCard
        title="Shares performance"
        subtitle="Daily share trend based on the selected time period."
        data={analytics.performance}
        labelKey="label"
        valueKey="shares"
        valueLabel="Shares"
        totalLabel="Total shares"
        showMenu={false}
        formatValue={formatCompactNumber}
      />

      <SectionCard title="Shares">
        <div className="space-y-4">
          {analytics.sharePlatforms.map((platform) => (
            <ProgressRow
              key={platform.label}
              label={platform.label}
              value={`${formatCompactNumber(platform.count)} shares`}
              percentage={platform.percentage}
            />
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function FeedbackTab({
  analytics,
}: {
  analytics: ReturnType<typeof buildMockPostAnalytics>;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          icon={ThumbsDown}
          title="Negative Feedback"
          subtitle="Users reported issues"
          value={formatCompactNumber(analytics.negativeFeedback)}
          change="↘ 6%"
          changeType="down"
          iconClassName="text-rose-500"
          titleClassName="text-rose-500"
        />

        <MetricCard
          icon={CheckCircle2}
          title="Approval Rate"
          subtitle="Positive reaction ratio"
          value={`${analytics.approvalRate.toFixed(1)}%`}
          change="↗ 11%"
          changeType="up"
          iconClassName="text-emerald-600"
          titleClassName="text-emerald-600"
        />
      </div>

      <SectionCard title="Feedback summary">
        <p className="text-sm leading-6 text-muted-foreground">
          {analytics.negativeFeedback === 0
            ? "No users have submitted negative feedback for this post."
            : `${analytics.negativeFeedback} users submitted negative feedback for this post.`}
        </p>
      </SectionCard>

      <SectionCard title="Main reasons">
        <div className="space-y-4">
          {analytics.feedbackReasons.map((reason) => (
            <ProgressRow
              key={reason.label}
              label={reason.label}
              value={`${reason.count} reports`}
              percentage={reason.percentage}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Recent anonymous feedback">
        <div className="space-y-3">
          {analytics.recentFeedback.map((feedback) => (
            <div key={feedback.id} className="rounded-xl bg-background p-4">
              <p className="text-sm font-medium text-foreground">
                {feedback.reason}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {feedback.createdAt}
              </p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function TimeRangeFilter({
  value,
  onChange,
}: {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}) {
  const selectedOption =
    TIME_RANGE_OPTIONS.find((option) => option.value === value) ??
    TIME_RANGE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="h-10 min-w-[150px] justify-between rounded-full"
        >
          {selectedOption.label}
          <ChevronDown className="ml-2 size-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        {TIME_RANGE_OPTIONS.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => onChange(option.value)}
            className={
              option.value === value
                ? "bg-accent font-semibold text-primary"
                : ""
            }
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function MetricCard({
  icon: Icon,
  title,
  subtitle,
  value,
  change,
  changeType = "neutral",
  iconClassName = "text-primary",
  titleClassName = "text-primary",
}: {
  icon: ElementType;
  title: string;
  subtitle: string;
  value: string;
  change?: string;
  changeType?: MetricChangeType;
  iconClassName?: string;
  titleClassName?: string;
}) {
  const changeClassName =
    changeType === "up"
      ? "text-emerald-600"
      : changeType === "down"
        ? "text-rose-500"
        : "text-muted-foreground";

  return (
    <div className="rounded-3xl border border-border bg-card p-5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex size-10 shrink-0 items-center justify-center rounded-2xl bg-accent ${iconClassName}`}
        >
          <Icon className="size-5" />
        </div>

        {change ? (
          <span className={`whitespace-nowrap text-sm font-semibold ${changeClassName}`}>
            {change}
          </span>
        ) : null}
      </div>

      <div className="mt-5">
        <p className="text-2xl font-bold leading-none tracking-tight text-foreground sm:text-3xl">
          {value}
        </p>

        <p className={`mt-3 text-sm font-semibold ${titleClassName}`}>
          {title}
        </p>

        <p className="mt-1 line-clamp-2 text-sm leading-5 text-muted-foreground">
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function PreviewMetric({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: number;
}) {
  return (
    <div className="flex min-w-[118px] items-center gap-2 rounded-xl bg-background p-3">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent text-primary">
        <Icon className="size-4" />
      </span>

      <div>
        <p className="text-sm font-bold leading-none text-foreground">
          {formatCompactNumber(value)}
        </p>

        <p className="mt-1 text-xs font-medium text-muted-foreground">
          {label}
        </p>
      </div>
    </div>
  );
}

function SectionCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-card p-5 shadow-sm sm:p-6">
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>

        {description ? (
          <p className="mt-1 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>

      <div className="mt-5">{children}</div>
    </section>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>

      <p className="text-right text-sm font-semibold text-foreground">
        {value}
      </p>
    </div>
  );
}

function ProgressRow({
  label,
  value,
  percentage,
}: {
  label: string;
  value: string;
  percentage: number;
}) {
  const safePercentage = Math.max(0, Math.min(percentage, 100));

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-foreground">{label}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{value}</p>
        </div>

        <p className="text-sm font-bold text-primary">{safePercentage}%</p>
      </div>

      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary"
          style={{
            width: `${safePercentage}%`,
          }}
        />
      </div>
    </div>
  );
}

function buildMockPostAnalytics(post: AdminMockPost, timeRange: TimeRange) {
  const rangeMultiplier = getRangeMultiplier(timeRange);

  const likes = post.likes;
  const dislikes = post.dislikes;
  const totalReactions = likes + dislikes;

  const approvalRate =
    totalReactions > 0
      ? Number(((likes / totalReactions) * 100).toFixed(1))
      : 0;

  const totalActions = post.likes + post.dislikes + post.comments + post.shares;

  const totalViews = Math.round((totalActions * 38 + 260) * rangeMultiplier);
  const uniqueViewers = Math.round(totalViews * 0.62);
  const averageScreenTimeSeconds = 34 + post.comments;

  const performance = Array.from({ length: 7 }).map((_, index) => {
    const base = Math.round(totalViews / 7);
    const growth = index * (post.likes + post.comments + 4);

    return {
      label: `D${index + 1}`,
      views: Math.max(8, base + growth),
      likes: Math.max(1, Math.round((post.likes / 7) * (index + 1))),
      comments: Math.max(0, Math.round((post.comments / 7) * (index + 1))),
      shares: Math.max(0, Math.round((post.shares / 7) * (index + 1))),
    };
  });

  return {
    likes,
    dislikes,
    totalReactions,
    approvalRate,
    totalActions,
    totalViews,
    uniqueViewers,
    averageScreenTimeSeconds,
    mainComments: Math.max(1, Math.round(post.comments * 0.68)),
    replies: Math.max(0, post.comments - Math.round(post.comments * 0.68)),
    totalComments: post.comments,
    negativeFeedback: post.dislikes,
    performance,
    trafficSources: [
      {
        label: "Home feed",
        views: Math.round(totalViews * 0.42),
        percentage: 42,
      },
      {
        label: "Community page",
        views: Math.round(totalViews * 0.31),
        percentage: 31,
      },
      {
        label: "Profile page",
        views: Math.round(totalViews * 0.18),
        percentage: 18,
      },
      {
        label: "Shared link",
        views: Math.round(totalViews * 0.09),
        percentage: 9,
      },
    ],
    districts: [
      {
        label: "Kathmandu",
        viewers: Math.round(uniqueViewers * 0.38),
        percentage: 38,
      },
      {
        label: "Lalitpur",
        viewers: Math.round(uniqueViewers * 0.25),
        percentage: 25,
      },
      {
        label: "Bhaktapur",
        viewers: Math.round(uniqueViewers * 0.19),
        percentage: 19,
      },
      {
        label: "Pokhara",
        viewers: Math.round(uniqueViewers * 0.11),
        percentage: 11,
      },
    ],
    sharePlatforms: [
      {
        label: "In-app share",
        count: Math.max(1, Math.round(post.shares * 0.55)),
        percentage: 55,
      },
      {
        label: "Copy link",
        count: Math.max(1, Math.round(post.shares * 0.3)),
        percentage: 30,
      },
      {
        label: "External apps",
        count: Math.max(0, Math.round(post.shares * 0.15)),
        percentage: 15,
      },
    ],
    feedbackReasons: [
      {
        label: "Not useful",
        count: Math.max(0, Math.round(post.dislikes * 0.45)),
        percentage: 45,
      },
      {
        label: "Low quality",
        count: Math.max(0, Math.round(post.dislikes * 0.35)),
        percentage: 35,
      },
      {
        label: "Wrong category",
        count: Math.max(0, Math.round(post.dislikes * 0.2)),
        percentage: 20,
      },
    ],
    recentFeedback:
      post.dislikes > 0
        ? [
            {
              id: `${post.id}-feedback-1`,
              reason: "This post needs clearer information.",
              createdAt: "2 days ago",
            },
            {
              id: `${post.id}-feedback-2`,
              reason: "The content could be more specific.",
              createdAt: "5 days ago",
            },
          ]
        : [],
  };
}

function getRangeMultiplier(timeRange: TimeRange) {
  if (timeRange === "LAST_7_DAYS") return 1;
  if (timeRange === "LAST_30_DAYS") return 2.4;
  if (timeRange === "LAST_90_DAYS") return 4.8;

  return 6.5;
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

function formatCompactNumber(value: number) {
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(value >= 10_000_000 ? 0 : 1)}M`;
  }

  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  }

  return String(value);
}