"use server";

import { ROLES } from "@/config/roles";
import { hashPassword } from "@/lib/auth/password";
import { connectToDatabase } from "@/server/db/mongoose";
import { User } from "@/server/db/models/User";

import { signupSchema, type SignupInput } from "./schemas";

export type ActionResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

/**
 * Register a new B2C student account.
 *
 * Guests self-register as STUDENT only — the ADMIN role is never assignable
 * through public signup (created via the seed script / by another admin).
 */
export async function registerStudent(input: SignupInput): Promise<ActionResult> {
  const parsed = signupSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  const { name, email, password } = parsed.data;

  try {
    await connectToDatabase();

    const existing = await User.findOne({ email }).select("_id").lean();
    if (existing) {
      return {
        success: false,
        error: "An account with this email already exists.",
        fieldErrors: { email: "Email already registered" },
      };
    }

    const passwordHash = await hashPassword(password);
    await User.create({ name, email, passwordHash, role: ROLES.STUDENT });

    return { success: true };
  } catch (error) {
    console.error("[registerStudent]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
