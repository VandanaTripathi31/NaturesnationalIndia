import Link from "next/link";
import type { Metadata } from "next";
import { Award, Download, ExternalLink } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/session";
import { getStudentCertificates } from "@/features/dashboard/data";

export const metadata: Metadata = { title: "Certificates" };

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function CertificatesPage() {
  const user = await getCurrentUser();
  const certificates = await getStudentCertificates(user!.id);

  return (
    <div>
      <PageHeader
        title="Certificates"
        description="Certificates you've earned on course completion."
      />

      {certificates.length === 0 ? (
        <EmptyState
          title="No certificates yet"
          description="Certificates are issued when you complete a course. Keep going!"
          action={
            <Button asChild>
              <Link href="/dashboard/courses">View my courses</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2">
          {certificates.map((c) => (
            <div key={c.id} className="rounded-xl border bg-card p-6">
              <div className="flex items-start justify-between">
                <div className="inline-flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Award className="size-5" />
                </div>
                {c.type === "b2b" ? <Badge variant="secondary">Co-branded</Badge> : null}
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold">{c.courseTitle}</h3>
              {c.organizationName ? (
                <p className="text-sm text-muted-foreground">with {c.organizationName}</p>
              ) : null}
              <p className="mt-1 text-xs text-muted-foreground">
                Issued {formatDate(c.issuedAt)} · ID {c.certificateId}
              </p>
              <div className="mt-5 flex gap-2">
                <Button asChild size="sm">
                  <a
                    href={`/api/certificates/${c.certificateId}/pdf`}
                    target="_blank"
                    rel="noopener"
                  >
                    <Download className="size-3.5" />
                    Download
                  </a>
                </Button>
                <Button asChild size="sm" variant="outline">
                  <Link href={`/verify/${c.certificateId}`}>
                    Verify
                    <ExternalLink className="size-3.5" />
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
