import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { ROLES, type Role } from "@/config/roles";
import { authOptions } from "@/lib/auth/options";

/** The currently authenticated user, or null. Server-only. */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user ?? null;
}

/** Require any authenticated user; redirect to /login otherwise. */
export async function requireAuth(callbackUrl = "/") {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return user;
}

/** Require a specific role; redirect unauthorised users. */
export async function requireRole(role: Role, callbackUrl = "/") {
  const user = await requireAuth(callbackUrl);
  if (user.role !== role) {
    redirect(user.role === ROLES.ADMIN ? "/admin" : "/dashboard");
  }
  return user;
}
