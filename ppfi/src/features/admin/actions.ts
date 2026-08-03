"use server";

import { randomBytes } from "crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ZodSchema } from "zod";

import { ROLES } from "@/config/roles";
import { getCourses } from "@/features/content";
import { requireRole } from "@/lib/auth/session";
import { connectToDatabase } from "@/server/db/mongoose";
import { Batch } from "@/server/db/models/Batch";
import { BlogPostModel } from "@/server/db/models/BlogPost";
import { Certificate } from "@/server/db/models/Certificate";
import { CourseModel } from "@/server/db/models/Course";
import { Enrollment } from "@/server/db/models/Enrollment";
import { Inquiry } from "@/server/db/models/Inquiry";
import { MentorModel } from "@/server/db/models/Mentor";
import { Organization } from "@/server/db/models/Organization";
import { User } from "@/server/db/models/User";

import {
  batchSchema,
  courseSchema,
  enrollmentSchema,
  issueCertificateSchema,
  mentorSchema,
  organizationSchema,
  postSchema,
} from "./schemas";

export type ActionState = {
  error?: string;
  fieldErrors?: Record<string, string>;
} | null;

async function parseForm<T>(
  schema: ZodSchema<T>,
  formData: FormData,
): Promise<{ data: T } | { state: ActionState }> {
  const raw = Object.fromEntries(formData.entries());
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { state: { error: "Please fix the highlighted fields.", fieldErrors } };
  }
  return { data: parsed.data };
}

// ── Courses ──────────────────────────────────────────────────────────────
export async function saveCourse(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(ROLES.ADMIN);
  const result = await parseForm(courseSchema, formData);
  if ("state" in result) return result.state;
  try {
    await connectToDatabase();
    await CourseModel.updateOne(
      { slug: result.data.slug },
      { $set: result.data },
      { upsert: true },
    );
  } catch (e) {
    console.error("[saveCourse]", e);
    return { error: "Could not save course." };
  }
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  redirect("/admin/courses");
}

export async function deleteCourse(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  const slug = String(formData.get("slug"));
  await connectToDatabase();
  await CourseModel.deleteOne({ slug });
  revalidatePath("/admin/courses");
  revalidatePath("/courses");
}

// ── Mentors ──────────────────────────────────────────────────────────────
export async function saveMentor(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(ROLES.ADMIN);
  const result = await parseForm(mentorSchema, formData);
  if ("state" in result) return result.state;
  try {
    await connectToDatabase();
    await MentorModel.updateOne(
      { slug: result.data.slug },
      { $set: result.data },
      { upsert: true },
    );
  } catch (e) {
    console.error("[saveMentor]", e);
    return { error: "Could not save mentor." };
  }
  revalidatePath("/admin/mentors");
  revalidatePath("/mentors");
  redirect("/admin/mentors");
}

export async function deleteMentor(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  const slug = String(formData.get("slug"));
  await connectToDatabase();
  await MentorModel.deleteOne({ slug });
  revalidatePath("/admin/mentors");
  revalidatePath("/mentors");
}

// ── Blog ─────────────────────────────────────────────────────────────────
export async function savePost(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(ROLES.ADMIN);
  const result = await parseForm(postSchema, formData);
  if ("state" in result) return result.state;
  try {
    await connectToDatabase();
    await BlogPostModel.updateOne(
      { slug: result.data.slug },
      { $set: result.data },
      { upsert: true },
    );
  } catch (e) {
    console.error("[savePost]", e);
    return { error: "Could not save post." };
  }
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  const slug = String(formData.get("slug"));
  await connectToDatabase();
  await BlogPostModel.deleteOne({ slug });
  revalidatePath("/admin/blog");
  revalidatePath("/blog");
}

// ── Organizations ────────────────────────────────────────────────────────
export async function saveOrganization(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(ROLES.ADMIN);
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const result = await parseForm(organizationSchema, formData);
  if ("state" in result) return result.state;
  try {
    await connectToDatabase();
    if (id) {
      await Organization.findByIdAndUpdate(id, { $set: result.data });
    } else {
      await Organization.create(result.data);
    }
  } catch (e) {
    console.error("[saveOrganization]", e);
    return { error: "Could not save organization." };
  }
  revalidatePath("/admin/organizations");
  redirect("/admin/organizations");
}

export async function deleteOrganization(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  await connectToDatabase();
  await Organization.findByIdAndDelete(String(formData.get("id")));
  revalidatePath("/admin/organizations");
}

// ── Batches ──────────────────────────────────────────────────────────────
export async function saveBatch(_prev: ActionState, formData: FormData): Promise<ActionState> {
  await requireRole(ROLES.ADMIN);
  const id = formData.get("id") ? String(formData.get("id")) : null;
  const result = await parseForm(batchSchema, formData);
  if ("state" in result) return result.state;
  const { organization, ...rest } = result.data;
  const payload = { ...rest, organization: organization || null };
  try {
    await connectToDatabase();
    if (id) {
      await Batch.findByIdAndUpdate(id, { $set: payload });
    } else {
      await Batch.create(payload);
    }
  } catch (e) {
    console.error("[saveBatch]", e);
    return { error: "Could not save batch." };
  }
  revalidatePath("/admin/batches");
  redirect("/admin/batches");
}

export async function deleteBatch(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  await connectToDatabase();
  await Batch.findByIdAndDelete(String(formData.get("id")));
  revalidatePath("/admin/batches");
}

// ── Inquiries ────────────────────────────────────────────────────────────
export async function updateInquiryStatus(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  await connectToDatabase();
  await Inquiry.findByIdAndUpdate(id, { $set: { status } });
  revalidatePath("/admin/inquiries");
}

export async function convertInquiryToOrganization(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  const id = String(formData.get("id"));
  await connectToDatabase();
  const inquiry = await Inquiry.findById(id);
  if (!inquiry) return;
  await Organization.create({
    name: inquiry.instituteName,
    contactPerson: inquiry.contactPerson,
    email: inquiry.email,
    phone: inquiry.phone,
    status: "active",
    sourceInquiry: inquiry._id,
  });
  inquiry.status = "converted";
  await inquiry.save();
  revalidatePath("/admin/inquiries");
  revalidatePath("/admin/organizations");
  redirect("/admin/organizations");
}

// ── Students / Enrollments ───────────────────────────────────────────────
export async function createEnrollment(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(ROLES.ADMIN);
  const result = await parseForm(enrollmentSchema, formData);
  if ("state" in result) return result.state;
  try {
    await connectToDatabase();
    await Enrollment.updateOne(
      { student: result.data.student, courseSlug: result.data.courseSlug },
      { $setOnInsert: { ...result.data, status: "active", progress: 0 } },
      { upsert: true },
    );
  } catch (e) {
    console.error("[createEnrollment]", e);
    return { error: "Could not create enrollment." };
  }
  revalidatePath("/admin/students");
  redirect("/admin/students");
}

// ── Certificates ─────────────────────────────────────────────────────────
export async function issueCertificate(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireRole(ROLES.ADMIN);
  const result = await parseForm(issueCertificateSchema, formData);
  if ("state" in result) return result.state;
  const { student, courseSlug, type, organizationName } = result.data;

  try {
    await connectToDatabase();
    const [user, courses] = await Promise.all([User.findById(student).lean(), getCourses()]);
    if (!user) return { error: "Student not found." };
    const course = courses.find((c) => c.slug === courseSlug);
    if (!course) return { error: "Course not found." };

    const certificateId = `PPFI-${new Date().getFullYear()}-${randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    await Certificate.create({
      certificateId,
      student: user._id,
      studentName: user.name,
      courseSlug,
      courseTitle: course.title,
      type,
      organizationName: type === "b2b" ? organizationName || null : null,
    });

    // Mark the enrollment completed (create one if it doesn't exist).
    await Enrollment.updateOne(
      { student: user._id, courseSlug },
      { $set: { status: "completed", progress: 100, completedAt: new Date() } },
      { upsert: true },
    );
  } catch (e) {
    console.error("[issueCertificate]", e);
    return { error: "Could not issue certificate." };
  }
  revalidatePath("/admin/certificates");
  redirect("/admin/certificates");
}

export async function revokeCertificate(formData: FormData): Promise<void> {
  await requireRole(ROLES.ADMIN);
  await connectToDatabase();
  await Certificate.findByIdAndUpdate(String(formData.get("id")), {
    $set: { revoked: true },
  });
  revalidatePath("/admin/certificates");
}
