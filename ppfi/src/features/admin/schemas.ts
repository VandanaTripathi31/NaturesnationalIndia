import { z } from "zod";

const linesToArray = (v: unknown) =>
  typeof v === "string"
    ? v.split("\n").map((s) => s.trim()).filter(Boolean)
    : Array.isArray(v)
      ? v
      : [];

export const courseSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  title: z.string().min(2).max(120),
  category: z.string().min(2).max(40),
  level: z.string().min(2).max(40),
  excerpt: z.string().min(5).max(200),
  description: z.string().min(10).max(4000),
  durationWeeks: z.coerce.number().int().min(1).max(104),
  price: z.coerce.number().int().min(0),
  image: z.string().url(),
  syllabus: z.preprocess(linesToArray, z.array(z.string())),
  outcomes: z.preprocess(linesToArray, z.array(z.string())),
  featured: z.coerce.boolean().optional().default(false),
  comingSoon: z.coerce.boolean().optional().default(false),
});

export const mentorSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  name: z.string().min(2).max(120),
  role: z.string().min(2).max(120),
  bio: z.string().min(10).max(2000),
  image: z.string().url(),
  expertise: z.preprocess(linesToArray, z.array(z.string())),
  linkedin: z.string().url().optional().or(z.literal("")),
  instagram: z.string().url().optional().or(z.literal("")),
});

export const postSchema = z.object({
  slug: z.string().min(2).max(120).regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and dashes"),
  title: z.string().min(2).max(160),
  excerpt: z.string().min(5).max(280),
  content: z.string().min(20).max(20000),
  category: z.string().min(2).max(40),
  author: z.string().min(2).max(120),
  image: z.string().url(),
  readingMinutes: z.coerce.number().int().min(1).max(60).default(4),
});

export const organizationSchema = z.object({
  name: z.string().min(2).max(160),
  contactPerson: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().min(7).max(20),
  address: z.string().max(300).optional().or(z.literal("")),
  status: z.enum(["active", "paused", "ended"]).default("active"),
  notes: z.string().max(2000).optional().or(z.literal("")),
});

export const batchSchema = z.object({
  name: z.string().min(2).max(120),
  courseSlug: z.string().min(2).max(80),
  type: z.enum(["b2c", "b2b"]).default("b2c"),
  organization: z.string().optional().or(z.literal("")),
  mentorSlug: z.string().optional().or(z.literal("")),
  capacity: z.coerce.number().int().min(0).max(1000).default(0),
  status: z.enum(["upcoming", "running", "completed"]).default("upcoming"),
});

export const enrollmentSchema = z.object({
  student: z.string().min(1, "Select a student"),
  courseSlug: z.string().min(1, "Select a course"),
  source: z.enum(["b2c", "b2b"]).default("b2c"),
});

export const issueCertificateSchema = z.object({
  student: z.string().min(1, "Select a student"),
  courseSlug: z.string().min(1, "Select a course"),
  type: z.enum(["b2c", "b2b"]).default("b2c"),
  organizationName: z.string().optional().or(z.literal("")),
});

export type CourseFormInput = z.infer<typeof courseSchema>;
export type MentorFormInput = z.infer<typeof mentorSchema>;
export type PostFormInput = z.infer<typeof postSchema>;
export type OrganizationFormInput = z.infer<typeof organizationSchema>;
export type BatchFormInput = z.infer<typeof batchSchema>;
