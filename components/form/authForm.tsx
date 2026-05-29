"use client";

import {
  type FormEvent,
  type ReactNode,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  LogIn,
  MapPin,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent } from "@/components/ui/tabs";

type AuthMode = "login" | "signup";
type AppRole = "USER" | "ADMIN" | "SUPER_ADMIN";

const ADMIN_HOME_PATH = "/admin";

export default function AuthToggleForm() {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>("login");

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);

  const handleModeChange = (nextMode: AuthMode) => {
    if (isLoginSubmitting || isSignupSubmitting) {
      return;
    }

    setMode(nextMode);
  };

  const handleLoginSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      toast.error("Please enter your email and password.");
      return;
    }

    try {
      setIsLoginSubmitting(true);

      const { error } = await authClient.signIn.email({
        email,
        password,
        rememberMe: true,
      });

      if (error) {
        toast.error(error.message || "Invalid email or password.");
        return;
      }

      /**
       * Get the latest authenticated user session after login.
       * This is important because only ADMIN and SUPER_ADMIN
       * should enter this admin dashboard.
       */
      const sessionResult = await authClient.getSession();

      if (sessionResult.error || !sessionResult.data?.user) {
        toast.error("Unable to verify your account session.");
        return;
      }

      const role = sessionResult.data.user.role as AppRole | undefined;

      if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
        await authClient.signOut();

        toast.error(
          "This account does not have permission to access the admin dashboard.",
        );

        return;
      }

      toast.success("Login successful.");

      router.replace(ADMIN_HOME_PATH);
      router.refresh();
    } catch {
      toast.error("Unable to log in. Please try again.");
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleSignupSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? "",
    );

    if (
      !firstName ||
      !lastName ||
      !address ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      toast.error("Please fill in all signup fields.");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Password and confirm password do not match.");
      return;
    }

    const name = `${firstName} ${lastName}`.trim();

    try {
      setIsSignupSubmitting(true);

      const { error } = await authClient.signUp.email({
        name,
        firstName,
        lastName,
        address,
        email,
        password,
      });

      if (error) {
        toast.error(error.message || "Unable to create account.");
        return;
      }

      /**
       * Better Auth signs the newly created user in automatically
       * unless autoSignIn is disabled in the backend.
       *
       * Your backend creates signup accounts with role USER,
       * but this is an admin dashboard. Sign out the newly-created
       * normal account and ask the user to use an admin account.
       */
      await authClient.signOut();

      form.reset();
      setMode("login");

      toast.success(
        "Account created. Admin access must be assigned before dashboard login.",
      );
    } catch {
      toast.error("Unable to create account. Please try again.");
    } finally {
      setIsSignupSubmitting(false);
    }
  };

  return (
    <section className="min-h-screen bg-background px-4 py-10 text-foreground">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl items-center justify-center">
        <div className="relative w-full max-w-[460px]">
          <div className="pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-muted blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-20 h-64 w-64 rounded-full bg-accent/40 blur-3xl" />

          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-card p-3 text-card-foreground shadow-[0_12px_32px_rgba(22,101,52,0.08)]">
            {/* Custom Tab Switcher */}
            <div className="rounded-[1.55rem] border border-border/70 bg-muted p-1.5">
              <div className="grid w-full grid-cols-2 gap-1">
                <button
                  type="button"
                  onClick={() => handleModeChange("login")}
                  disabled={isLoginSubmitting || isSignupSubmitting}
                  className={`flex items-center justify-center gap-2 rounded-[1rem] px-3 py-3 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
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
                  onClick={() => handleModeChange("signup")}
                  disabled={isLoginSubmitting || isSignupSubmitting}
                  className={`flex items-center justify-center gap-2 rounded-[1rem] px-3 py-3 text-xs font-semibold transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm ${
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

            <Tabs
              value={mode}
              onValueChange={(value) =>
                handleModeChange(value as AuthMode)
              }
            >
              {/* Login */}
              <TabsContent value="login" className="mt-0">
                <form
                  onSubmit={handleLoginSubmit}
                  className="px-3 pb-3 pt-7"
                >
                  <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary text-primary-foreground shadow-sm">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                      Welcome back
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Log in to continue managing PasalGuff.
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
                      disabled={isLoginSubmitting}
                    />

                    <PasswordInput
                      id="login-password"
                      name="password"
                      label="Password"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      showPassword={showLoginPassword}
                      onTogglePassword={() =>
                        setShowLoginPassword((previous) => !previous)
                      }
                      disabled={isLoginSubmitting}
                      rightLabel={
                        <button
                          type="button"
                          disabled={isLoginSubmitting}
                          className="text-sm font-semibold text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Forgot password?
                        </button>
                      }
                    />

                    <Button
                      type="submit"
                      disabled={isLoginSubmitting}
                      className="h-[52px] w-full rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isLoginSubmitting ? "Logging in..." : "Log in"}

                      {!isLoginSubmitting && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <SwitchFooter
                    text="Don't have an account yet?"
                    actionText="Sign up"
                    onClick={() => handleModeChange("signup")}
                    disabled={isLoginSubmitting}
                  />
                </form>
              </TabsContent>

              {/* Signup */}
              <TabsContent value="signup" className="mt-0">
                <form
                  onSubmit={handleSignupSubmit}
                  className="px-3 pb-3 pt-7"
                >
                  <div className="mb-7 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-primary text-primary-foreground shadow-sm">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <h1 className="text-2xl font-bold tracking-[-0.03em] text-foreground">
                      Create an account
                    </h1>

                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      Create your PasalGuff account.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormInput
                        id="signup-first-name"
                        name="firstName"
                        type="text"
                        label="First name"
                        placeholder="First name"
                        autoComplete="given-name"
                        icon={<UserRound className="h-4 w-4" />}
                        disabled={isSignupSubmitting}
                      />

                      <FormInput
                        id="signup-last-name"
                        name="lastName"
                        type="text"
                        label="Last name"
                        placeholder="Last name"
                        autoComplete="family-name"
                        icon={<UserRound className="h-4 w-4" />}
                        disabled={isSignupSubmitting}
                      />
                    </div>

                    <FormInput
                      id="signup-address"
                      name="address"
                      type="text"
                      label="Address"
                      placeholder="Enter your address"
                      autoComplete="street-address"
                      icon={<MapPin className="h-4 w-4" />}
                      disabled={isSignupSubmitting}
                    />

                    <FormInput
                      id="signup-email"
                      name="email"
                      type="email"
                      label="Email address"
                      placeholder="Enter your email"
                      autoComplete="email"
                      icon={<Mail className="h-4 w-4" />}
                      disabled={isSignupSubmitting}
                    />

                    <PasswordInput
                      id="signup-password"
                      name="password"
                      label="Password"
                      placeholder="Minimum 8 characters"
                      autoComplete="new-password"
                      showPassword={showSignupPassword}
                      onTogglePassword={() =>
                        setShowSignupPassword((previous) => !previous)
                      }
                      disabled={isSignupSubmitting}
                    />

                    <PasswordInput
                      id="signup-confirm-password"
                      name="confirmPassword"
                      label="Confirm password"
                      placeholder="Confirm your password"
                      autoComplete="new-password"
                      showPassword={showConfirmPassword}
                      onTogglePassword={() =>
                        setShowConfirmPassword((previous) => !previous)
                      }
                      disabled={isSignupSubmitting}
                    />

                    <Button
                      type="submit"
                      disabled={isSignupSubmitting}
                      className="h-[52px] w-full rounded-2xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSignupSubmitting
                        ? "Creating account..."
                        : "Create an account"}

                      {!isSignupSubmitting && (
                        <ArrowRight className="ml-2 h-4 w-4" />
                      )}
                    </Button>
                  </div>

                  <SwitchFooter
                    text="Already have an account?"
                    actionText="Log in"
                    onClick={() => handleModeChange("login")}
                    disabled={isSignupSubmitting}
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

interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  icon: ReactNode;
  disabled?: boolean;
}

function FormInput({
  id,
  name,
  type,
  label,
  placeholder,
  autoComplete,
  icon,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={id}
        className="text-sm font-semibold text-foreground"
      >
        {label}
      </Label>

      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>

        <Input
          id={id}
          name={name}
          type={type}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          required
          className="h-[52px] rounded-2xl border-input bg-background pl-11 pr-4 text-[15px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>
    </div>
  );
}

interface PasswordInputProps {
  id: string;
  name: string;
  label: string;
  placeholder: string;
  autoComplete: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  rightLabel?: ReactNode;
  disabled?: boolean;
}

function PasswordInput({
  id,
  name,
  label,
  placeholder,
  autoComplete,
  showPassword,
  onTogglePassword,
  rightLabel,
  disabled = false,
}: PasswordInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label
          htmlFor={id}
          className="text-sm font-semibold text-foreground"
        >
          {label}
        </Label>

        {rightLabel}
      </div>

      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={8}
          disabled={disabled}
          required
          className="h-[52px] rounded-2xl border-input bg-background pl-11 pr-12 text-[15px] text-foreground shadow-none placeholder:text-muted-foreground focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-60"
        />

        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}

interface SwitchFooterProps {
  text: string;
  actionText: string;
  onClick: () => void;
  disabled?: boolean;
}

function SwitchFooter({
  text,
  actionText,
  onClick,
  disabled = false,
}: SwitchFooterProps) {
  return (
    <div className="mt-7 rounded-2xl border border-border bg-muted px-4 py-4 text-center text-sm text-muted-foreground">
      {text}{" "}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="font-bold text-foreground transition hover:text-accent-foreground hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {actionText}
      </button>
    </div>
  );
}