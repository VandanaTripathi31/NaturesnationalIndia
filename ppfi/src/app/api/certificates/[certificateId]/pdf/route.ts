import { getCertificateByPublicId } from "@/features/certificates/data";
import { buildCertificatePdf } from "@/lib/certificates/pdf";

/**
 * Public certificate PDF download by verifiable ID. Revoked certificates are
 * not downloadable.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ certificateId: string }> },
) {
  const { certificateId } = await params;
  const cert = await getCertificateByPublicId(certificateId);

  if (!cert || cert.revoked) {
    return new Response("Certificate not found", { status: 404 });
  }

  const bytes = await buildCertificatePdf(cert);
  const body = new Uint8Array(bytes);

  return new Response(body, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="PPFI-${cert.certificateId}.pdf"`,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
