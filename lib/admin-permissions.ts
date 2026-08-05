// src/lib/admin-permissions.ts

import { createAccessControl } from "better-auth/plugins/access";
import {
  adminAc,
  defaultStatements,
} from "better-auth/plugins/admin/access";

const statements = {
  ...defaultStatements,
} as const;

export const adminAccessControl =
  createAccessControl(statements);

export const userRole =
  adminAccessControl.newRole({
    user: [],
    session: [],
  });

export const adminRole =
  adminAccessControl.newRole({
    ...adminAc.statements,
  });

export const superAdminRole =
  adminAccessControl.newRole({
    ...adminAc.statements,
  });

export const betterAuthRoles = {
  USER: userRole,
  ADMIN: adminRole,
  SUPER_ADMIN: superAdminRole,
};