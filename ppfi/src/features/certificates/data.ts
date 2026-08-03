import "server-only";

import { connectToDatabase } from "@/server/db/mongoose";
import { Certificate } from "@/server/db/models/Certificate";

export interface PublicCertificate {
  certificateId: string;
  studentName: string;
  courseTitle: string;
  type: "b2c" | "b2b";
  organizationName: string | null;
  issuedAt: string;
  revoked: boolean;
}

/** Look up a certificate by its public, verifiable ID. */
export async function getCertificateByPublicId(
  certificateId: string,
): Promise<PublicCertificate | null> {
  await connectToDatabase();
  const c = await Certificate.findOne({ certificateId }).lean();
  if (!c) return null;
  return {
    certificateId: c.certificateId,
    studentName: c.studentName,
    courseTitle: c.courseTitle,
    type: c.type,
    organizationName: c.organizationName ?? null,
    issuedAt: new Date(c.issuedAt).toISOString(),
    revoked: c.revoked,
  };
}
