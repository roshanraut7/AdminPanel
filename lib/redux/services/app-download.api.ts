import { baseApi } from "./base-api";

export type AppDownloadSummary = {
  totalShares: number;
  sharedLinkOpens: number;
  totalDownloads: number;
  directDownloads: number;
  referredDownloads: number;
};

export type AppDownloadShareLink = {
  id: string;
  token: string;
  shareUrl: string;

  sharedAt: string | null;

  shareCount: number;
  pageOpenCount: number;
  downloadCount: number;

  createdAt: string;
  updatedAt: string;
};

export type AppDownloadStatsResponse = {
  summary: AppDownloadSummary;
  shareLinks: AppDownloadShareLink[];
};

export const appDownloadApi =
  baseApi.injectEndpoints({
    overrideExisting: false,

    endpoints: (builder) => ({
      getAppDownloadStats: builder.query<
        AppDownloadStatsResponse,
        void
      >({
        query: () => ({
          url: "/app-download/stats",
          method: "GET",
        }),
      }),
    }),
  });

export const {
  useGetAppDownloadStatsQuery,
} = appDownloadApi;