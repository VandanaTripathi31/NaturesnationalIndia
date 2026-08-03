import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import type { PublicCertificate } from "@/features/certificates/data";
import { siteConfig } from "@/config/site";

/** Render a certificate as a landscape A4 PDF and return its bytes. */
export async function buildCertificatePdf(cert: PublicCertificate): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([842, 595]); // A4 landscape (pt)
  const { width, height } = page.getSize();

  const serif = await pdf.embedFont(StandardFonts.TimesRoman);
  const serifBold = await pdf.embedFont(StandardFonts.TimesRomanBold);
  const sans = await pdf.embedFont(StandardFonts.Helvetica);

  const ink = rgb(0.04, 0.04, 0.06);
  const muted = rgb(0.42, 0.42, 0.46);
  const gold = rgb(0.66, 0.52, 0.24);

  // Outer + inner border
  page.drawRectangle({
    x: 28,
    y: 28,
    width: width - 56,
    height: height - 56,
    borderColor: ink,
    borderWidth: 2,
  });
  page.drawRectangle({
    x: 40,
    y: 40,
    width: width - 80,
    height: height - 80,
    borderColor: gold,
    borderWidth: 1,
  });

  const center = (text: string, y: number, font = serif, size = 16, color = ink) => {
    const w = font.widthOfTextAtSize(text, size);
    page.drawText(text, { x: (width - w) / 2, y, size, font, color });
  };

  center(siteConfig.name.toUpperCase(), height - 100, sans, 12, muted);
  center("Certificate of Completion", height - 155, serifBold, 34, ink);
  center("This is proudly presented to", height - 205, serif, 14, muted);
  center(cert.studentName, height - 255, serifBold, 30, ink);

  center("for successfully completing the course", height - 300, serif, 14, muted);
  center(cert.courseTitle, height - 340, serifBold, 22, ink);

  if (cert.type === "b2b" && cert.organizationName) {
    center(`in partnership with ${cert.organizationName}`, height - 372, serif, 13, muted);
  }

  const issued = new Date(cert.issuedAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Footer line: date (left) and signature label (right)
  page.drawText(`Issued: ${issued}`, { x: 90, y: 120, size: 11, font: sans, color: muted });
  page.drawLine({
    start: { x: width - 250, y: 135 },
    end: { x: width - 90, y: 135 },
    thickness: 1,
    color: ink,
  });
  page.drawText("Authorised Signatory", {
    x: width - 250,
    y: 118,
    size: 10,
    font: sans,
    color: muted,
  });

  center(`Certificate ID: ${cert.certificateId}`, 78, sans, 10, muted);
  center(`Verify at ${siteConfig.url}/verify/${cert.certificateId}`, 62, sans, 9, muted);

  return pdf.save();
}
