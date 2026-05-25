"use client";

import { type SyntheticEvent, useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";

type AuthMode = "login" | "signup";

export default function AuthToggleForm() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleLoginSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }
    toast.success("Login submitted successfully.");
  };

  const handleSignupSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const password = String(formData.get("password") || "").trim();
    const confirmPassword = String(formData.get("confirmPassword") || "").trim();
    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all signup fields.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }
    toast.success("Account created successfully.");
  };

  return (
    <section className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="relative w-full max-w-[460px]">
          <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-muted blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 text-card-foreground shadow-[0_12px_32px_rgba(22,101,52,0.08)]">

            {/* ── Custom tab switcher — plain div, no shadcn TabsList ── */}
            <div className="rounded-[1.55rem] border border-border/70 bg-muted p-1.5">
              <div className="grid w-full grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className={`flex items-center justify-center gap-2 rounded-[1rem] px-3 py-3 text-xs font-semibold transition-all sm:text-sm ${
                    mode === "login"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <LogIn className="h-4 w-4 shrink-0" />
                  <span className="truncate">Log in</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className={`flex items-center justify-center gap-2 rounded-[1rem] px-3 py-3 text-xs font-semibold transition-all sm:text-sm ${
                    mode === "signup"
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <UserRound className="h-4 w-4 shrink-0" />
                  <span className="truncate">Sign up</span>
                </button>
              </div>
            </div>

            {/* ── Tab content still uses Radix Tabs for accessibility ── */}
            <Tabs value={mode} onValueChange={(v) => setMode(v as AuthMode)}>
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLoginSubmit} className="px-3 pb-3 pt-7">
                  <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary text-primary-foreground shadow-sm">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                      Welcome back
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Log in to continue managing your account.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      id="login-email"
                      name="email"
                      type="email"
                      label="Email address"
                      placeholder="Enter your email"
                      autoComplete="email"
                      icon={<Mail className="h-4 w-4" />}
                    />
                    <PasswordInput
                      id="login-password"
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      showPassword={showLoginPassword}
                      onTogglePassword={() => setShowLoginPassword((p) => !p)}
                      rightLabel={
                        <button
                          type="button"
                          className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
                        >
                          Forgot password?
                        </button>
                      }
                    />
                    <Button
                      type="submit"
                      className="h-[52px] w-full rounded-2xl border border-border bg-primary text-[15px] font-semibold text-primary-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
                    >
                      Log in
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <SwitchFooter
                    text="Don't have an account yet?"
                    actionText="Sign up"
                    onClick={() => setMode("signup")}
                  />
                </form>
              </TabsContent>

              <TabsContent value="signup" className="mt-0">
                <form onSubmit={handleSignupSubmit} className="px-3 pb-3 pt-7">
                  <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary text-primary-foreground shadow-sm">
                      <UserRound className="h-5 w-5" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                      Create an account
                    </h1>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Sign up and start using your dashboard.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      id="signup-name"
                      name="name"
                      type="text"
                      label="Full name"
                      placeholder="Enter your full name"
                      autoComplete="name"
                      icon={<UserRound className="h-4 w-4" />}
                    />
                    <FormInput
                      id="signup-email"
                      name="email"
                      type="email"
                      label="Email address"
                      placeholder="Enter your email"
                      autoComplete="email"
                      icon={<Mail className="h-4 w-4" />}
                    />
                    <PasswordInput
                      id="signup-password"
                      name="password"
                      label="Password"
                      placeholder="Create a password"
                      autoComplete="new-password"
                      showPassword={showSignupPassword}
                      onTogglePassword={() => setShowSignupPassword((p) => !p)}
                    />
                    <PasswordInput
                      id="signup-confirm-password"
                      name="confirmPassword"
                      label="Confirm password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      showPassword={showConfirmPassword}
                      onTogglePassword={() => setShowConfirmPassword((p) => !p)}
                    />
                    <Button
                      type="submit"
                      className="h-[52px] w-full rounded-2xl border border-border bg-primary text-[15px] font-semibold text-primary-foreground shadow-sm transition hover:bg-accent hover:text-accent-foreground"
                    >
                      Create an account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <SwitchFooter
                    text="Already have an account?"
                    actionText="Log in"
                    onClick={() => setMode("login")}
                  />
                </form>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </section>
  );
}

function FormInput({
  id, name, type, label, placeholder, autoComplete, icon,
}: {
  id: string; name: string; type: string; label: string;
  placeholder: string; autoComplete: string; icon: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-sm font-semibold text-foreground">
        {label}
      </Label>
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        <Input
          id={id} name={name} type={type} placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-[52px] rounded-2xl border-input bg-background pl-11 pr-4 text-[15px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}

function PasswordInput({
  id, name, label, placeholder, autoComplete,
  showPassword, onTogglePassword, rightLabel,
}: {
  id: string; name: string; label: string; placeholder: string;
  autoComplete: string; showPassword: boolean;
  onTogglePassword: () => void; rightLabel?: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </Label>
        {rightLabel}
      </div>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id} name={name} type={showPassword ? "text" : "password"}
          placeholder={placeholder} autoComplete={autoComplete}
          className="h-[52px] rounded-2xl border-input bg-background pl-11 pr-12 text-[15px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-ring"
        />
        <button
          type="button" onClick={onTogglePassword}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function SwitchFooter({ text, actionText, onClick }: {
  text: string; actionText: string; onClick: () => void;
}) {
  return (
    <div className="mt-7 rounded-2xl border border-border bg-muted px-4 py-4 text-center text-sm text-muted-foreground">
      {text}{" "}
      <button
        type="button" onClick={onClick}
        className="font-bold text-foreground transition hover:text-accent-foreground hover:underline"
      >
        {actionText}
      </button>
    </div>
  );
}