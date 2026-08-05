"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Download,
  Loader2,
  MessageCircle,
  Mic,
  Share2,
  Users,
  Zap,
} from "lucide-react";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:4000"
).replace(/\/$/, "");

export default function KamkuroDownloadPage() {
  const [isDownloading, setIsDownloading] =
    useState(false);

  const [referralToken, setReferralToken] =
    useState<string | null>(null);

  /*
   * The mobile app shares:
   *
   * https://kamkuro.com/download?ref=TOKEN
   *
   * When that page opens, record one referral-link opening.
   */
  useEffect(() => {
    const searchParams = new URLSearchParams(
      window.location.search,
    );

    const token = searchParams.get("ref");

    if (!token) {
      return;
    }

    setReferralToken(token);

    /*
     * Avoid counting the same opening repeatedly
     * during the same browser-tab session.
     */
    const storageKey =
      `kamkuro-referral-open:${token}`;

    const alreadyRecorded =
      window.sessionStorage.getItem(storageKey);

    if (alreadyRecorded) {
      return;
    }

    window.sessionStorage.setItem(
      storageKey,
      "true",
    );

    const recordReferralOpen = async () => {
      try {
        const response = await fetch(
          `${API_URL}/app-download/share-links/${encodeURIComponent(
            token,
          )}/open`,
          {
            method: "POST",
            keepalive: true,
          },
        );

        if (!response.ok) {
          console.error(
            "Referral opening could not be recorded.",
          );
        }
      } catch (error) {
        console.error(
          "Failed to record referral opening:",
          error,
        );
      }
    };

    void recordReferralOpen();
  }, []);

  /*
   * Send every APK download through the backend.
   *
   * Direct visit:
   * GET /app-download/apk
   *
   * Referral visit:
   * GET /app-download/apk?ref=TOKEN
   *
   * The backend records the download and then redirects
   * the browser to the real CDN APK.
   */
  const handleDownload = () => {
    if (isDownloading) {
      return;
    }

    setIsDownloading(true);

    const query = referralToken
      ? `?ref=${encodeURIComponent(
          referralToken,
        )}`
      : "";

    const trackedDownloadUrl =
      `${API_URL}/app-download/apk${query}`;

    window.location.assign(
      trackedDownloadUrl,
    );

    /*
     * This only runs if the browser remains on the page,
     * such as when the API request fails.
     */
    window.setTimeout(() => {
      setIsDownloading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      {/* Navbar */}
      <nav className="fixed z-50 w-full border-b border-border bg-card/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <img
              src="/kamkuro.png"
              alt="Kamkuro"
              className="h-9 w-9 rounded-2xl object-contain sm:h-10 sm:w-10"
            />

            <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl">
              kamkuro
            </h1>
          </div>

          <div className="hidden items-center gap-8 text-sm font-medium md:flex">
            <a
              href="#about"
              className="transition-colors hover:text-primary"
            >
              About
            </a>

            <a
              href="#features"
              className="transition-colors hover:text-primary"
            >
              Features
            </a>

            <a
              href="#community"
              className="transition-colors hover:text-primary"
            >
              Community
            </a>
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center gap-2 rounded-2xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-70"
          >
            {isDownloading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}

            <span className="hidden sm:inline">
              {isDownloading
                ? "Starting..."
                : "Download APK"}
            </span>
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-background via-background to-accent/30 pb-16 pt-24 sm:pb-24 sm:pt-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="text-center lg:text-left">
              <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm lg:mx-0">
                <div className="h-2 w-2 animate-pulse rounded-full bg-[#1bd488]" />
                Version 1.0.0 • Android
              </div>

              <h1 className="mb-6 text-5xl font-bold leading-none tracking-tighter sm:text-6xl lg:text-7xl">
                Get{" "}
                <span className="bg-gradient-to-r from-primary to-[#1bd488] bg-clip-text text-transparent">
                  Kamkuro
                </span>
              </h1>

              <p className="mx-auto mb-10 max-w-lg text-xl text-muted-foreground sm:text-2xl lg:mx-0">
                Your ultimate electronic marketplace.
                <br />
                Connect, trade, and grow together.
              </p>

              <div className="flex flex-col items-center gap-4 lg:items-start">
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="group relative flex w-full items-center justify-center gap-4 rounded-3xl bg-gradient-to-r from-primary to-[#1bd488] px-10 py-6 text-xl font-semibold text-primary-foreground shadow-2xl shadow-primary/30 transition-all hover:brightness-110 active:scale-[0.97] disabled:opacity-80 sm:w-auto sm:justify-start sm:gap-6 sm:px-16 sm:py-8 sm:text-2xl"
                >
                  <div className="flex flex-col items-start text-left">
                    <span className="text-xs tracking-widest opacity-80 sm:text-sm">
                      DOWNLOAD FOR ANDROID
                    </span>

                    <span className="text-3xl sm:text-4xl">
                      {isDownloading
                        ? "Starting..."
                        : "kamkuro.apk"}
                    </span>
                  </div>

                  {isDownloading ? (
                    <Loader2 className="h-10 w-10 shrink-0 animate-spin sm:h-12 sm:w-12" />
                  ) : (
                    <Download className="h-10 w-10 shrink-0 transition-transform group-active:rotate-12 sm:h-12 sm:w-12" />
                  )}
                </button>

                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  Safe &amp; Verified • Direct from official
                  servers
                </p>

                {referralToken ? (
                  <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                    <Share2 className="h-4 w-4 text-primary" />
                    You opened a Kamkuro referral link
                  </div>
                ) : null}
              </div>
            </div>

            <div className="relative mt-8 flex justify-center lg:mt-0 lg:justify-end">
              <div className="relative h-[560px] w-[280px] overflow-hidden rounded-[3rem] border-8 border-black bg-black shadow-2xl sm:h-[620px] sm:w-[320px]">
                <img
                  src="/explore.jpeg"
                  alt="Kamkuro App Home"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-x-0 top-0 flex h-8 items-center bg-black/70 px-6 text-[10px] text-white">
                  <div className="flex-1">9:41</div>

                  <div className="flex gap-1">
                    <div>5G</div>
                    <div>92%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section
        id="about"
        className="border-t border-border bg-card py-20"
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
            <div>
              <div className="mb-4 text-sm uppercase tracking-widest text-primary">
                Our Story
              </div>

              <h2 className="mb-8 text-4xl font-bold tracking-tight sm:text-5xl">
                The marketplace for electronics enthusiasts
              </h2>

              <div className="space-y-6 text-lg text-muted-foreground">
                <p>
                  Kamkuro is more than just a buying and
                  selling platform. It is a growing community
                  for people who love technology, gadgets,
                  electronics, and innovation.
                </p>

                <p>
                  We built Kamkuro to make trading electronics
                  simple, safe, and social. Connect with trusted
                  buyers, sellers, professionals, and technical
                  communities.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[9/16] overflow-hidden rounded-3xl border border-border bg-zinc-900 shadow-xl md:aspect-[4/5]">
                <img
                  src="/kamkuro.png"
                  alt="Kamkuro"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="border-t border-border bg-background py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
              Why people choose Kamkuro
            </h2>

            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
              Built for electronics lovers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: (
                  <Zap className="h-10 w-10 text-[#1bd488]" />
                ),
                title: "Lightning Fast Listings",
                description:
                  "Post your electronics in seconds with smart categorization.",
              },
              {
                icon: (
                  <MessageCircle className="h-10 w-10 text-[#1bd488]" />
                ),
                title: "Real-time Chat",
                description:
                  "Negotiate deals instantly with buyers and sellers.",
              },
              {
                icon: (
                  <Share2 className="h-10 w-10 text-[#1bd488]" />
                ),
                title: "Discussion Sharing",
                description:
                  "Create and join meaningful discussions about gadgets.",
              },
              {
                icon: (
                  <Mic className="h-10 w-10 text-[#1bd488]" />
                ),
                title: "Live Rooms",
                description:
                  "Join voice chats and weekly technical discussions.",
              },
              {
                icon: (
                  <Users className="h-10 w-10 text-[#1bd488]" />
                ),
                title: "Thriving Community",
                description:
                  "Connect with fellow technical enthusiasts.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="group rounded-3xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl"
              >
                <div className="mb-8">
                  {feature.icon}
                </div>

                <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                  {feature.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section
        id="community"
        className="border-t border-border bg-card py-20"
      >
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <div className="mx-auto max-w-2xl">
            <h2 className="mb-6 text-4xl font-bold tracking-tight">
              Built for the community
            </h2>

            <p className="mb-12 text-xl text-muted-foreground">
              Kamkuro is where technical people gather to
              discuss, share, and grow together.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="rounded-3xl border border-border bg-background p-8">
              <div className="mb-6 text-[#1bd488]">
                <MessageCircle className="mx-auto h-12 w-12" />
              </div>

              <h4 className="mb-2 text-xl font-semibold">
                Live Chats
              </h4>

              <p className="text-muted-foreground">
                Instant messaging with buyers and sellers
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-background p-8">
              <div className="mb-6 text-[#1bd488]">
                <Share2 className="mx-auto h-12 w-12" />
              </div>

              <h4 className="mb-2 text-xl font-semibold">
                Share Discussions
              </h4>

              <p className="text-muted-foreground">
                Community threads and expert advice
              </p>
            </div>

            <div className="rounded-3xl border border-border bg-background p-8">
              <div className="mb-6 text-[#1bd488]">
                <Mic className="mx-auto h-12 w-12" />
              </div>

              <h4 className="mb-2 text-xl font-semibold">
                Live Rooms
              </h4>

              <p className="text-muted-foreground">
                Weekly AMAs and technical talks
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary py-20 text-primary-foreground">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
            Ready to join the Kamkuro community?
          </h2>

          <p className="mb-12 text-xl opacity-90 sm:text-2xl">
            Download now and start connecting
          </p>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="inline-flex w-full items-center justify-center gap-4 rounded-3xl bg-white px-12 py-6 text-xl font-semibold text-primary transition-all hover:bg-white/90 active:scale-95 disabled:opacity-70 sm:w-auto"
          >
            {isDownloading ? (
              <Loader2 className="h-7 w-7 animate-spin" />
            ) : (
              <Download className="h-7 w-7" />
            )}

            {isDownloading
              ? "STARTING DOWNLOAD..."
              : "DOWNLOAD KAMKURO APK"}
          </button>
        </div>
      </section>

      <footer className="border-t border-border bg-card py-12">
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground sm:px-6">
          © 2026 Kamkuro. All rights reserved.
        </div>
      </footer>
    </div>
  );
}