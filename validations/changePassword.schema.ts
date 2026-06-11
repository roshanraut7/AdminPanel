import { z } from "zod";

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Please enter your current password."),

    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters.")
      .max(100, "New password is too long."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your new password."),
  })
  .refine(
    (values) => values.newPassword === values.confirmPassword,
    {
      message: "New password and confirm password do not match.",
      path: ["confirmPassword"],
    },
  )
  .refine(
    (values) => values.currentPassword !== values.newPassword,
    {
      message: "New password must be different from current password.",
      path: ["newPassword"],
    },
  );

export type ChangePasswordFormValues = z.infer<
  typeof changePasswordSchema
>;