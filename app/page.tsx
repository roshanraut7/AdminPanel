"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import AuthToggleForm from "@/components/form/authForm";
import { authClient } from "@/lib/auth-client";

export default function Page() {
  const router = useRouter();

  const {
    data: session,
    isPending,
  } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/admin");
    }
  }, [isPending, router, session?.user]);

  /**
   * Show loading screen while checking session
   * or while redirecting an already logged-in user.
   */
  if (isPending || session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <LoaderCircle className="size-7 animate-spin text-primary" />
        </div>
      </main>
    );
  }
  return <AuthToggleForm />;
}