import Link from "next/link";
import { Plus } from "lucide-react";

import { DataTable, Td } from "@/components/admin/data-table";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { revokeCertificate } from "@/features/admin/actions";
import { listCertificates } from "@/features/admin/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminCertificatesPage() {
  const certificates = await listCertificates();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Certificates" description="Issue and manage completion certificates." />
        <Button asChild>
          <Link href="/admin/certificates/issue">
            <Plus className="size-4" />
            Issue certificate
          </Link>
        </Button>
      </div>

      {certificates.length === 0 ? (
        <EmptyState title="No certificates" description="Issue a certificate to a student who has completed a course." />
      ) : (
        <DataTable headers={["Certificate ID", "Student", "Course", "Type", "Issued", ""]}>
          {certificates.map((c) => (
            <tr key={c.id} className={c.revoked ? "opacity-50" : undefined}>
              <Td className="font-mono text-xs">{c.certificateId}</Td>
              <Td className="font-medium">{c.studentName}</Td>
              <Td>{c.courseTitle}</Td>
              <Td>
                <Badge variant={c.type === "b2b" ? "secondary" : "muted"}>
                  {c.type.toUpperCase()}
                </Badge>
              </Td>
              <Td className="text-muted-foreground">{formatDate(c.issuedAt)}</Td>
              <Td>
                <div className="flex justify-end">
                  {c.revoked ? (
                    <Badge variant="muted">Revoked</Badge>
                  ) : (
                    <form action={revokeCertificate}>
                      <input type="hidden" name="id" value={c.id} />
                      <Button variant="ghost" size="sm" type="submit" className="text-destructive">
                        Revoke
                      </Button>
                    </form>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
