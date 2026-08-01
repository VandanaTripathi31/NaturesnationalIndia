import "server-only";

import { getCourseBySlug } from "@/features/content";
import { connectToDatabase } from "@/server/db/mongoose";
import { Certificate } from "@/server/db/models/Certificate";
import { Enrollment } from "@/server/db/models/Enrollment";
import { User } from "@/server/db/models/User";

export interface EnrollmentView {
  id: string;
  courseSlug: string;
  courseTitle: string;
  courseImage: string;
  courseCategory: string;
  durationWeeks: number;
  status: "active" | "completed" | "cancelled";
  progress: number;
  source: "b2c" | "b2b";
  enrolledAt: string;
}

export interface CertificateView {
  id: string;
  certificateId: string;
  courseTitle: string;
  type: "b2c" | "b2b";
  organizationName: string | null;
  issuedAt: string;
}

/** Enrollments for a student, enriched with course catalogue metadata. */
export async function getStudentEnrollments(userId: string): Promise<EnrollmentView[]> {
  await connectToDatabase();
  const rows = await Enrollment.find({ student: userId }).sort({ createdAt: -1 }).lean();

  return rows.map((e) => {
    const course = getCourseBySlug(e.courseSlug);
    return {
      id: String(e._id),
      courseSlug: e.courseSlug,
      courseTitle: course?.title ?? e.courseSlug,
      courseImage: course?.image ?? "",
      courseCategory: course?.category ?? "Course",
      durationWeeks: course?.durationWeeks ?? 0,
      status: e.status,
      progress: e.progress,
      source: e.source,
      enrolledAt: new Date(e.enrolledAt ?? e.createdAt).toISOString(),
    };
  });
}

export async function getStudentCertificates(userId: string): Promise<CertificateView[]> {
  await connectToDatabase();
  const rows = await Certificate.find({ student: userId, revoked: false })
    .sort({ issuedAt: -1 })
    .lean();

  return rows.map((c) => ({
    id: String(c._id),
    certificateId: c.certificateId,
    courseTitle: c.courseTitle,
    type: c.type,
    organizationName: c.organizationName ?? null,
    issuedAt: new Date(c.issuedAt).toISOString(),
  }));
}

export interface ProfileView {
  name: string;
  email: string;
  phone: string;
  image: string;
}

export async function getStudentProfile(userId: string): Promise<ProfileView | null> {
  await connectToDatabase();
  const user = await User.findById(userId).lean();
  if (!user) return null;
  return {
    name: user.name,
    email: user.email,
    phone: user.phone ?? "",
    image: user.image ?? "",
  };
}
