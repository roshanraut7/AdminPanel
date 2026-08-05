"use client";

import type { LucideIcon } from "lucide-react";
import {
  Download,
  ExternalLink,
  Link2,
  MousePointerClick,
  RefreshCw,
  Share2,
} from "lucide-react";

import {
  useGetAppDownloadStatsQuery,
} from "@/lib/redux/services/app-download.api";

function formatDate(
  value: string | null,
) {
  if (!value) {
    return "Not shared";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Invalid date";
  }

  return new Intl.DateTimeFormat(
    "en-GB",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

export default function DownloadStatsPage() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } =
    useGetAppDownloadStatsQuery(
      undefined,
      {
        pollingInterval: 30_000,
        refetchOnFocus: true,
        refetchOnReconnect: true,
      },
    );

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <RefreshCw className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <h2 className="font-semibold text-destructive">
          Failed to load APK download statistics
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Check that the backend statistics endpoint is
          available and that the current account has admin
          permission.
        </p>

        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  const {
    summary,
    shareLinks,
  } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            APK Download Statistics
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Monitor direct downloads and referral-link
            performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            void refetch();
          }}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-60"
        >
          <RefreshCw
            className={`h-4 w-4 ${
              isFetching
                ? "animate-spin"
                : ""
            }`}
          />

          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatisticsCard
          title="Total Downloads"
          value={summary.totalDownloads}
          icon={Download}
        />

        <StatisticsCard
          title="Referral Downloads"
          value={summary.referredDownloads}
          icon={Link2}
        />

        <StatisticsCard
          title="Direct Downloads"
          value={summary.directDownloads}
          icon={Download}
        />

        <StatisticsCard
          title="Shares"
          value={summary.totalShares}
          icon={Share2}
        />

        <StatisticsCard
          title="Referral Opens"
          value={summary.sharedLinkOpens}
          icon={MousePointerClick}
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-5 py-4">
          <h2 className="font-semibold">
            Referral links
          </h2>

          <p className="mt-1 text-xs text-muted-foreground">
            Individual share, open, and download counts.
          </p>
        </div>

        {shareLinks.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No referral links have been created yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 font-medium">
                    Token
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Shares
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Opens
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Downloads
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Shared
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Created
                  </th>

                  <th className="px-5 py-3 font-medium">
                    Referral page
                  </th>
                </tr>
              </thead>

              <tbody>
                {shareLinks.map((link) => (
                  <tr
                    key={link.id}
                    className="border-t border-border"
                  >
                    <td className="px-5 py-4">
                      <code className="rounded-md bg-muted px-2 py-1 text-xs">
                        {link.token.length > 14
                          ? `${link.token.slice(
                              0,
                              14,
                            )}…`
                          : link.token}
                      </code>
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {link.shareCount}
                    </td>

                    <td className="px-5 py-4 font-medium">
                      {link.pageOpenCount}
                    </td>

                    <td className="px-5 py-4 font-semibold text-primary">
                      {link.downloadCount}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(link.sharedAt)}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(link.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <a
                        href={link.shareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-primary hover:underline"
                      >
                        Open
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatisticsCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: number;
  icon: LucideIcon;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>

        <span className="text-2xl font-bold">
          {value.toLocaleString()}
        </span>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {title}
      </p>
    </div>
  );
}