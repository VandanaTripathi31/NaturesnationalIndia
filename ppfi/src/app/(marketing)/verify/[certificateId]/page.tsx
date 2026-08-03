import Link from "next/link";
import type { Metadata } from "next";
import { BadgeCheck, Download, ShieldX } from "lucide-react";

import { Button } from "@/components/ui/button";
import { getCertificateByPublicId } from "@/features/certificates/data";

export const metadata: Metadata = {
  title: "Verify Certificate",
  description: "Verify the authenticity of a Pixel Perfect Films Institute certificate.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function VerifyCertificatePage({
  params,
}: {
  params: Promise<{ certificateId: string }>;
}) {
  const { certificateId } = await params;
  const cert = await getCertificateByPublicId(certificateId);

  const notValid = !cert || cert.revoked;

  return (
    <div className="container flex min-h-[70vh] items-center justify-center py-16">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-8 text-center">
        {notValid ? (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-destructive/10">
              <ShieldX className="size-7 text-destructive" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold">
              {cert?.revoked ? "Certificate revoked" : "Certificate not found"}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {cert?.revoked
                ? "This certificate has been revoked and is no longer valid."
                : "We couldn't find a certificate with this ID. Please check and try again."}
            </p>
            <p className="mt-4 font-mono text-xs text-muted-foreground">{certificateId}</p>
          </>
        ) : (
          <>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10">
              <BadgeCheck className="size-7 text-primary" />
            </div>
            <h1 className="mt-5 font-display text-2xl font-semibold">Certificate verified</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This is a genuine certificate issued by Pixel Perfect Films Institute.
            </p>

            <dl className="mt-8 space-y-4 text-left">
              <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                <dt className="text-sm text-muted-foreground">Awarded to</dt>
                <dd className="text-sm font-medium">{cert.studentName}</dd>
              </div>
              <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                <dt className="text-sm text-muted-foreground">Course</dt>
                <dd className="text-sm font-medium">{cert.courseTitle}</dd>
              </div>
              {cert.organizationName ? (
                <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                  <dt className="text-sm text-muted-foreground">In partnership with</dt>
                  <dd className="text-sm font-medium">{cert.organizationName}</dd>
                </div>
              ) : null}
              <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
                <dt className="text-sm text-muted-foreground">Issued on</dt>
                <dd className="text-sm font-medium">{formatDate(cert.issuedAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-sm text-muted-foreground">Certificate ID</dt>
                <dd className="font-mono text-xs">{cert.certificateId}</dd>
              </div>
            </dl>

            <Button asChild className="mt-8 w-full">
              <a href={`/api/certificates/${cert.certificateId}/pdf`} target="_blank" rel="noopener">
                <Download className="size-4" />
                Download PDF
              </a>
            </Button>
          </>
        )}

        <div className="mt-6">
          <Link href="/verify" className="text-sm text-muted-foreground hover:text-foreground">
            Verify another certificate
          </Link>
        </div>
      </div>
    </div>
  );
}
