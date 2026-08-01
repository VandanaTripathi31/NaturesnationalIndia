"use server";

import { connectToDatabase } from "@/server/db/mongoose";
import { ContactMessage } from "@/server/db/models/ContactMessage";
import { Inquiry } from "@/server/db/models/Inquiry";

import { contactSchema, inquirySchema, type ContactInput, type InquiryInput } from "./schemas";

export type LeadResult =
  | { success: true }
  | { success: false; error: string; fieldErrors?: Record<string, string> };

function collectFieldErrors(issues: { path: (string | number)[]; message: string }[]) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}

export async function submitContactMessage(input: ContactInput): Promise<LeadResult> {
  const parsed = contactSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  try {
    await connectToDatabase();
    await ContactMessage.create(parsed.data);
    return { success: true };
  } catch (error) {
    console.error("[submitContactMessage]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function submitInquiry(input: InquiryInput): Promise<LeadResult> {
  const parsed = inquirySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: collectFieldErrors(parsed.error.issues),
    };
  }

  try {
    await connectToDatabase();
    await Inquiry.create(parsed.data);
    return { success: true };
  } catch (error) {
    console.error("[submitInquiry]", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
