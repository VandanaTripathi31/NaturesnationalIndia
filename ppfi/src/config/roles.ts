/**
 * User roles finalised in the Handover Document (Section 4).
 *
 * V1 authenticated roles are STUDENT and ADMIN. Guest Visitor and Institute
 * Representative are unauthenticated flows (no login in V1). Mentor and the
 * future Partner Portal user are intentionally excluded from auth in V1.
 */
export const ROLES = {
  STUDENT: "student",
  ADMIN: "admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES: Role[] = [ROLES.STUDENT, ROLES.ADMIN];
