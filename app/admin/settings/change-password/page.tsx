import { KeyRound } from "lucide-react";

import { ChangePasswordForm } from "@/components/form/change-password";

export default function ChangePasswordPage() {
  return (
    <section className="min-h-full bg-background p-5 md:p-7">
      <div className="mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <KeyRound className="size-5" />
          </div>

          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Change Password
            </h1>

            <p className="text-sm text-muted-foreground">
              Update your account password to keep your admin account secure.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm md:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-foreground">
              Password Security
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Enter your current password and choose a new password.
            </p>
          </div>

          <ChangePasswordForm />
        </div>
      </div>
    </section>
  );
}