"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import LandingPage from "@/components/landing/landing-page";
import { authClient } from "@/lib/auth-client";

type AppRole = "USER" | "ADMIN" | "SUPER_ADMIN";

const MEMBER_HOME_PATH = "/feed"; // Change this if your member dashboard uses another route.
const ADMIN_HOME_PATH = "/admin";

export default function Page() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (isPending || !session?.user) {
      return;
    }

    const role = session.user.role as AppRole | undefined;
    const destination =
      role === "ADMIN" || role === "SUPER_ADMIN"
        ? ADMIN_HOME_PATH
        : MEMBER_HOME_PATH;

    router.replace(destination);
  }, [isPending, router, session?.user]);

  if (isPending || session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <LoaderCircle className="size-7 animate-spin text-primary" />
          <p className="text-sm">Opening Kamkuro...</p>
        </div>
      </main>
    );
  }

  return <LandingPage />;
}