import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,

  fetchOptions: {
    credentials: "include",
  },

  /**
   * Your Better Auth server is in a separate NestJS project.
   * Therefore, these additional user fields must be described
   * manually on the Next.js client for correct TypeScript support.
   */
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ["USER", "ADMIN", "SUPER_ADMIN"],
          required: false,
          defaultValue: "USER",
          input: false,
        },

        firstName: {
          type: "string",
          required: true,
          input: true,
        },

        lastName: {
          type: "string",
          required: true,
          input: true,
        },

        businessName: {
          type: "string",
          required: false,
          input: false,
        },

        businessType: {
          type: "string",
          required: false,
          input: false,
        },

        panNo: {
          type: "string",
          required: false,
          input: false,
        },

        registrationNo: {
          type: "string",
          required: false,
          input: false,
        },

        address: {
          type: "string",
          required: true,
          input: true,
        },

        coverImage: {
          type: "string",
          required: false,
          input: false,
        },

        onboardingCompleted: {
          type: "boolean",
          required: false,
          defaultValue: false,
          input: false,
        },
      },
    }),
  ],
});

export type AuthSession = typeof authClient.$Infer.Session;