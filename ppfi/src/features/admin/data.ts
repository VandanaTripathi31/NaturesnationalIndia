import "server-only";

import { connectToDatabase } from "@/server/db/mongoose";
import { Batch } from "@/server/db/models/Batch";
import { Certificate } from "@/server/db/models/Certificate";
import { ContactMessage } from "@/server/db/models/ContactMessage";
import { Enrollment } from "@/server/db/models/Enrollment";
import { Inquiry } from "@/server/db/models/Inquiry";
import { Organization } from "@/server/db/models/Organization";
import { ROLES } from "@/config/roles";
import { User } from "@/server/db/models/User";

export async function getAdminStats() {
  await connectToDatabase();
  const [students, activeEnrollments, newInquiries, certificates, organizations, messages] =
    await Promise.all([
      User.countDocuments({ role: ROLES.STUDENT }),
      Enrollment.countDocuments({ status: "active" }),
      Inquiry.countDocuments({ status: "new" }),
      Certificate.countDocuments({ revoked: false }),
      Organization.countDocuments({ status: "active" }),
      ContactMessage.countDocuments({ handled: false }),
    ]);
  return { students, activeEnrollments, newInquiries, certificates, organizations, messages };
}

export async function getRecentInquiries(limit = 5) {
  await connectToDatabase();
  const rows = await Inquiry.find().sort({ createdAt: -1 }).limit(limit).lean();
  return rows.map((r) => ({
    id: String(r._id),
    instituteName: r.instituteName,
    contactPerson: r.contactPerson,
    status: r.status,
    createdAt: new Date(r.createdAt).toISOString(),
  }));
}

export async function listInquiries() {
  await connectToDatabase();
  const rows = await Inquiry.find().sort({ createdAt: -1 }).lean();
  return rows.map((r) => ({
    id: String(r._id),
    instituteName: r.instituteName,
    contactPerson: r.contactPerson,
    email: r.email,
    phone: r.phone,
    studentStrength: r.studentStrength,
    interestAreas: r.interestAreas,
    timeSlots: r.timeSlots ?? "",
    message: r.message ?? "",
    status: r.status,
    createdAt: new Date(r.createdAt).toISOString(),
  }));
}

export async function listStudents() {
  await connectToDatabase();
  const rows = await User.find({ role: ROLES.STUDENT }).sort({ createdAt: -1 }).lean();
  const ids = rows.map((r) => r._id);
  const counts = await Enrollment.aggregate<{ _id: unknown; count: number }>([
    { $match: { student: { $in: ids } } },
    { $group: { _id: "$student", count: { $sum: 1 } } },
  ]);
  const countMap = new Map(counts.map((c) => [String(c._id), c.count]));
  return rows.map((r) => ({
    id: String(r._id),
    name: r.name,
    email: r.email,
    phone: r.phone ?? "",
    enrollments: countMap.get(String(r._id)) ?? 0,
    createdAt: new Date(r.createdAt).toISOString(),
  }));
}

export async function listOrganizations() {
  await connectToDatabase();
  const rows = await Organization.find().sort({ createdAt: -1 }).lean();
  return rows.map((r) => ({
    id: String(r._id),
    name: r.name,
    contactPerson: r.contactPerson,
    email: r.email,
    phone: r.phone,
    status: r.status,
    createdAt: new Date(r.createdAt).toISOString(),
  }));
}

export async function listBatches() {
  await connectToDatabase();
  const rows = await Batch.find().populate("organization", "name").sort({ createdAt: -1 }).lean();
  return rows.map((r) => ({
    id: String(r._id),
    name: r.name,
    courseSlug: r.courseSlug,
    type: r.type,
    organizationName:
      r.organization && typeof r.organization === "object" && "name" in r.organization
        ? (r.organization as { name: string }).name
        : null,
    status: r.status,
    capacity: r.capacity,
  }));
}

export async function listCertificates() {
  await connectToDatabase();
  const rows = await Certificate.find().sort({ createdAt: -1 }).lean();
  return rows.map((r) => ({
    id: String(r._id),
    certificateId: r.certificateId,
    studentName: r.studentName,
    courseTitle: r.courseTitle,
    type: r.type,
    organizationName: r.organizationName ?? null,
    revoked: r.revoked,
    issuedAt: new Date(r.issuedAt).toISOString(),
  }));
}

export async function getOrganizationById(id: string) {
  await connectToDatabase();
  const r = await Organization.findById(id).lean();
  if (!r) return null;
  return {
    id: String(r._id),
    name: r.name,
    contactPerson: r.contactPerson,
    email: r.email,
    phone: r.phone,
    address: r.address ?? "",
    status: r.status,
    notes: r.notes ?? "",
  };
}

export async function getBatchById(id: string) {
  await connectToDatabase();
  const r = await Batch.findById(id).lean();
  if (!r) return null;
  return {
    id: String(r._id),
    name: r.name,
    courseSlug: r.courseSlug,
    type: r.type,
    organization: r.organization ? String(r.organization) : "",
    mentorSlug: r.mentorSlug ?? "",
    capacity: r.capacity,
    status: r.status,
  };
}

export async function getOrganizationOptions() {
  await connectToDatabase();
  const rows = await Organization.find({ status: "active" }).select("name").lean();
  return rows.map((r) => ({ id: String(r._id), name: r.name }));
}

export async function getStudentOptions() {
  await connectToDatabase();
  const rows = await User.find({ role: ROLES.STUDENT }).select("name email").lean();
  return rows.map((r) => ({ id: String(r._id), name: r.name, email: r.email }));
}
