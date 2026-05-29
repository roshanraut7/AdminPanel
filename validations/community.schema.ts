import * as z from "zod/v4";

export const createCommunitySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, {
      error: "Community name must be at least 2 characters.",
    }),

  categoryId: z
    .string()
    .trim()
    .min(1, {
      error: "Please select a category.",
    }),

  visibility: z.enum(["PUBLIC", "PRIVATE"]),

  description: z
    .string()
    .trim()
    .optional(),
});

export type CreateCommunityFormValues = z.infer<
  typeof createCommunitySchema
>;