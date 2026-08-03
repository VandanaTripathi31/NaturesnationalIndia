"use server";

import { revalidatePath } from "next/cache";

import { getCurrentUser } from "@/lib/auth/session";
import { connectToDatabase } from "@/server/db/mongoose";
import { User } from "@/server/db/models/User";

import { profileSchema, type ProfileInput } from "./schemas";

export type ProfileResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

export async function updateProfile(input: ProfileInput): Promise<ProfileResult> {
  const user = await getCurrentUser();
  if (!user) return { success: false, error: "You must be signed in." };

  const parsed = profileSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { success: false, error: "Please fix the highlighted fields.", fieldErrors };
  }

  try {
    await connectToDatabase();
    await User.findByIdAndUpdate(user.id, {
      $set: {
        name: parsed.data.name,
        phone: parsed.data.phone || undefined,
        image: parsed.data.image || undefined,
      },
    });
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("[updateProfile]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
