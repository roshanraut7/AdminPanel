import { createAuthClient } from "better-auth/react";
import {
  adminClient,
  inferAdditionalFields,
} from "better-auth/client/plugins";

import {
  adminAccessControl,
  betterAuthRoles,
} from "@/lib/admin-permissions";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,

  fetchOptions: {
    credentials: "include",
  },

  plugins: [
    /**
     * Gives access to:
     *
     * authClient.admin.listUsers()
     * authClient.admin.banUser()
     * authClient.admin.unbanUser()
     * authClient.admin.removeUser()
     */
    adminClient({
      ac: adminAccessControl,
      roles: betterAuthRoles,
    }),

    /**
     * Backend and frontend are separate projects,
     * so manually describe additional user fields.
     */
    inferAdditionalFields({
      user: {
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

        businessEmail: {
          type: "string",
          required: false,
          input: false,
        },

        businessPhoneNo: {
          type: "string",
          required: false,
          input: false,
        },

        address: {
          type: "string",
          required: false,
          input: true,
        },

        /**
         * District is not collected by the current signup form.
         * Keep these optional at signup and fill them later
         * from profile/onboarding.
         */
        districtKey: {
          type: "string",
          required: false,
          input: true,
        },

        districtName: {
          type: "string",
          required: false,
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