"use client";

import {
  type SyntheticEvent,
  type ReactNode,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
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

export type AuthMode = "login" | "signup";
type AppRole = "USER" | "ADMIN" | "SUPER_ADMIN";

const MEMBER_HOME_PATH = "/feed"; // Change this to your real user dashboard route.
const ADMIN_HOME_PATH = "/admin";

interface AuthToggleFormProps {
  initialMode?: AuthMode;
  onModeChange?: (mode: AuthMode) => void;
  onSuccess?: () => void;
}

export default function AuthToggleForm({
  initialMode = "login",
  onModeChange,
  onSuccess,
}: AuthToggleFormProps) {
  const router = useRouter();

  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoginSubmitting, setIsLoginSubmitting] = useState(false);
  const [isSignupSubmitting, setIsSignupSubmitting] = useState(false);

  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  const handleModeChange = (nextMode: AuthMode) => {
    if (isLoginSubmitting || isSignupSubmitting) {
      return;
    }

    setMode(nextMode);
    onModeChange?.(nextMode);
  };

  const openAuthenticatedArea = (role?: AppRole) => {
    const destination =
      role === "ADMIN" || role === "SUPER_ADMIN"
        ? ADMIN_HOME_PATH
        : MEMBER_HOME_PATH;

    onSuccess?.();
    router.replace(destination);
    router.refresh();
  };

  const handleLoginSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
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

      const sessionResult = await authClient.getSession();

      if (sessionResult.error || !sessionResult.data?.user) {
        toast.error("Unable to verify your account session.");
        return;
      }

      const role = sessionResult.data.user.role as AppRole | undefined;

      toast.success("Welcome back to Kamkuro.");
      openAuthenticatedArea(role);
    } catch {
      toast.error("Unable to sign in. Please try again.");
    } finally {
      setIsLoginSubmitting(false);
    }
  };

  const handleSignupSubmit = async (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    const firstName = String(formData.get("firstName") ?? "").trim();
    const lastName = String(formData.get("lastName") ?? "").trim();
    const address = String(formData.get("address") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (!firstName || !lastName || !address || !email || !password || !confirmPassword) {
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

      const sessionResult = await authClient.getSession();
      form.reset();

      if (sessionResult.data?.user) {
        const role = sessionResult.data.user.role as AppRole | undefined;
        toast.success("Your Kamkuro account is ready.");
        openAuthenticatedArea(role);
        return;
      }

      setMode("login");
      onModeChange?.("login");
      toast.success("Account created. Check your email if verification is required, then sign in.");
    } catch {
      toast.error("Unable to create account. Please try again.");
    } finally {
      setIsSignupSubmitting(false);
    }
  };

  return (
    <section className="bg-background p-3 text-foreground sm:p-5">
      <div className="overflow-hidden rounded-2xl border border-border bg-card p-2 text-card-foreground shadow-[0_18px_55px_rgba(5,91,101,0.08)]">
        <div className="rounded-xl border border-border/70 bg-muted p-1">
          <div className="grid grid-cols-2 gap-1">
            <button
              type="button"
              onClick={() => handleModeChange("login")}
              disabled={isLoginSubmitting || isSignupSubmitting}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                mode === "login"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LogIn className="size-4" />
              Sign in
            </button>

            <button
              type="button"
              onClick={() => handleModeChange("signup")}
              disabled={isLoginSubmitting || isSignupSubmitting}
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                mode === "signup"
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <UserRound className="size-4" />
              Sign up
            </button>
          </div>
        </div>

        <Tabs value={mode} onValueChange={(value) => handleModeChange(value as AuthMode)}>
          <TabsContent value="login" className="mt-0">
            <form onSubmit={handleLoginSubmit} className="px-3 pb-3 pt-6 sm:px-5 sm:pb-5">
              <AuthHeading
                icon={<ShieldCheck className="size-5" />}
                title="Welcome back"
                description="Sign in to continue your Kamkuro conversations."
              />

              <div className="space-y-4">
                <FormInput
                  id="login-email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="Enter your email"
                  autoComplete="email"
                  icon={<Mail className="size-4" />}
                  disabled={isLoginSubmitting}
                />

                <PasswordInput
                  id="login-password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  showPassword={showLoginPassword}
                  onTogglePassword={() => setShowLoginPassword((previous) => !previous)}
                  disabled={isLoginSubmitting}
                  rightLabel={
                    <Link
                      href="/forgot-password"
                      className="text-xs font-semibold text-muted-foreground hover:text-foreground"
                    >
                      Forgot password?
                    </Link>
                  }
                />

                <Button
                  type="submit"
                  disabled={isLoginSubmitting}
                  className="h-12 w-full rounded-xl text-sm font-semibold"
                >
                  {isLoginSubmitting ? "Signing in..." : "Sign in"}
                  {!isLoginSubmitting && <ArrowRight className="ml-2 size-4" />}
                </Button>
              </div>

              <SwitchFooter
                text="New to Kamkuro?"
                actionText="Create an account"
                onClick={() => handleModeChange("signup")}
                disabled={isLoginSubmitting}
              />
            </form>
          </TabsContent>

          <TabsContent value="signup" className="mt-0">
            <form onSubmit={handleSignupSubmit} className="px-3 pb-3 pt-6 sm:px-5 sm:pb-5">
              <AuthHeading
                icon={<UserRound className="size-5" />}
                title="Join Kamkuro"
                description="Create your profile and find your communities."
              />

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormInput
                    id="signup-first-name"
                    name="firstName"
                    type="text"
                    label="First name"
                    placeholder="First name"
                    autoComplete="given-name"
                    icon={<UserRound className="size-4" />}
                    disabled={isSignupSubmitting}
                  />

                  <FormInput
                    id="signup-last-name"
                    name="lastName"
                    type="text"
                    label="Last name"
                    placeholder="Last name"
                    autoComplete="family-name"
                    icon={<UserRound className="size-4" />}
                    disabled={isSignupSubmitting}
                  />
                </div>

                <FormInput
                  id="signup-address"
                  name="address"
                  type="text"
                  label="Address"
                  placeholder="City or address"
                  autoComplete="street-address"
                  icon={<MapPin className="size-4" />}
                  disabled={isSignupSubmitting}
                />

                <FormInput
                  id="signup-email"
                  name="email"
                  type="email"
                  label="Email address"
                  placeholder="Enter your email"
                  autoComplete="email"
                  icon={<Mail className="size-4" />}
                  disabled={isSignupSubmitting}
                />

                <PasswordInput
                  id="signup-password"
                  name="password"
                  label="Password"
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  showPassword={showSignupPassword}
                  onTogglePassword={() => setShowSignupPassword((previous) => !previous)}
                  disabled={isSignupSubmitting}
                />

                <PasswordInput
                  id="signup-confirm-password"
                  name="confirmPassword"
                  label="Confirm password"
                  placeholder="Confirm your password"
                  autoComplete="new-password"
                  showPassword={showConfirmPassword}
                  onTogglePassword={() => setShowConfirmPassword((previous) => !previous)}
                  disabled={isSignupSubmitting}
                />

                <p className="text-xs leading-5 text-muted-foreground">
                  By creating an account, you agree to the{" "}
                  <Link href="/terms" className="font-semibold text-foreground hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="font-semibold text-foreground hover:underline">
                    Privacy Policy
                  </Link>
                  .
                </p>

                <Button
                  type="submit"
                  disabled={isSignupSubmitting}
                  className="h-12 w-full rounded-xl text-sm font-semibold"
                >
                  {isSignupSubmitting ? "Creating account..." : "Create account"}
                  {!isSignupSubmitting && <ArrowRight className="ml-2 size-4" />}
                </Button>
              </div>

              <SwitchFooter
                text="Already have an account?"
                actionText="Sign in"
                onClick={() => handleModeChange("login")}
                disabled={isSignupSubmitting}
              />
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}

function AuthHeading({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="mb-6 text-center">
      <div className="mx-auto mb-4 flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        {icon}
      </div>
      <h1 className="text-2xl font-bold tracking-[-0.035em]">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
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
      <Label htmlFor={id} className="text-sm font-semibold">
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
          className="h-12 rounded-xl bg-background pl-11 pr-4 text-sm"
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
        <Label htmlFor={id} className="text-sm font-semibold">
          {label}
        </Label>
        {rightLabel}
      </div>
      <div className="relative">
        <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={8}
          disabled={disabled}
          required
          className="h-12 rounded-xl bg-background pl-11 pr-12 text-sm"
        />
        <button
          type="button"
          onClick={onTogglePassword}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
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

function SwitchFooter({ text, actionText, onClick, disabled = false }: SwitchFooterProps) {
  return (
    <div className="mt-6 rounded-xl border border-border bg-muted px-4 py-3 text-center text-sm text-muted-foreground">
      {text}{" "}
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        className="font-bold text-foreground hover:text-primary hover:underline disabled:cursor-not-allowed disabled:opacity-50"
      >
        {actionText}
      </button>
    </div>
  );
}