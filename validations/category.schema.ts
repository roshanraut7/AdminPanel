import * as z from "zod/v4";

export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      error: "Category name must be at least 2 characters.",
    })
    .max(80, {
      error: "Category name must not exceed 80 characters.",
    }),

  description: z
    .string()
    .trim()
    .max(500, {
      error: "Description must not exceed 500 characters.",
    })
    .optional(),
});

export type CreateCategoryFormValues = z.infer<
  typeof createCategorySchema
>;