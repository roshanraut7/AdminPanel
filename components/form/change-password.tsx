"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/validations/changePassword.schema";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type PasswordField = "currentPassword" | "newPassword" | "confirmPassword";

export function ChangePasswordForm() {
  const [isChanging, setIsChanging] = useState(false);

  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<PasswordField, boolean>
  >({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setVisiblePasswords((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const onSubmit = async (values: ChangePasswordFormValues) => {
    try {
      setIsChanging(true);

      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        toast.error(error.message || "Unable to change password.");
        return;
      }

      toast.success("Password changed successfully.");
      reset();
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="space-y-5"
    >
      <div className="space-y-2">
        <Label htmlFor="current-password">
          Current password
        </Label>

        <div className="relative">
          <Input
            id="current-password"
            type={
              visiblePasswords.currentPassword
                ? "text"
                : "password"
            }
            disabled={isChanging}
            placeholder="Enter current password"
            aria-invalid={Boolean(errors.currentPassword)}
            className="pr-11"
            {...register("currentPassword")}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isChanging}
            onClick={() =>
              togglePasswordVisibility("currentPassword")
            }
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label={
              visiblePasswords.currentPassword
                ? "Hide current password"
                : "Show current password"
            }
          >
            {visiblePasswords.currentPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>

        {errors.currentPassword?.message && (
          <p className="text-sm text-destructive">
            {errors.currentPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="new-password">
          New password
        </Label>

        <div className="relative">
          <Input
            id="new-password"
            type={
              visiblePasswords.newPassword
                ? "text"
                : "password"
            }
            disabled={isChanging}
            placeholder="Enter new password"
            aria-invalid={Boolean(errors.newPassword)}
            className="pr-11"
            {...register("newPassword")}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isChanging}
            onClick={() =>
              togglePasswordVisibility("newPassword")
            }
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label={
              visiblePasswords.newPassword
                ? "Hide new password"
                : "Show new password"
            }
          >
            {visiblePasswords.newPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>

        {errors.newPassword?.message && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password">
          Confirm new password
        </Label>

        <div className="relative">
          <Input
            id="confirm-password"
            type={
              visiblePasswords.confirmPassword
                ? "text"
                : "password"
            }
            disabled={isChanging}
            placeholder="Confirm new password"
            aria-invalid={Boolean(errors.confirmPassword)}
            className="pr-11"
            {...register("confirmPassword")}
          />

          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={isChanging}
            onClick={() =>
              togglePasswordVisibility("confirmPassword")
            }
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2 text-muted-foreground hover:bg-transparent hover:text-foreground"
            aria-label={
              visiblePasswords.confirmPassword
                ? "Hide confirm password"
                : "Show confirm password"
            }
          >
            {visiblePasswords.confirmPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </Button>
        </div>

        {errors.confirmPassword?.message && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isChanging}
        className="bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isChanging && (
          <LoaderCircle className="mr-2 size-4 animate-spin" />
        )}

        {isChanging ? "Changing..." : "Change Password"}
      </Button>
    </form>
  );
}