import { Building2 } from "lucide-react";

import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { convertInquiryToOrganization, updateInquiryStatus } from "@/features/admin/actions";
import { listInquiries } from "@/features/admin/data";

const STATUSES = ["new", "contacted", "converted", "closed"];

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminInquiriesPage() {
  const inquiries = await listInquiries();

  return (
    <div>
      <PageHeader
        title="Inquiries"
        description="B2B partnership inquiries. Update status or convert into an organization."
      />

      {inquiries.length === 0 ? (
        <EmptyState
          title="No inquiries yet"
          description="Partnership inquiries submitted from the Admissions page appear here."
        />
      ) : (
        <div className="space-y-4">
          {inquiries.map((i) => (
            <div key={i.id} className="rounded-xl border bg-card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-display text-lg font-semibold">{i.instituteName}</h3>
                    <Badge variant={i.status === "new" ? "default" : "muted"}>{i.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {i.contactPerson} · {i.email} · {i.phone}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{formatDate(i.createdAt)}</p>
              </div>

              <div className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
                <p>
                  <span className="text-muted-foreground">Students: </span>
                  {i.studentStrength}
                </p>
                <p>
                  <span className="text-muted-foreground">Time slots: </span>
                  {i.timeSlots || "—"}
                </p>
                {i.interestAreas.length > 0 ? (
                  <p className="sm:col-span-2">
                    <span className="text-muted-foreground">Interested in: </span>
                    {i.interestAreas.join(", ")}
                  </p>
                ) : null}
                {i.message ? (
                  <p className="sm:col-span-2 text-muted-foreground">“{i.message}”</p>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-border/60 pt-4">
                <form action={updateInquiryStatus} className="flex items-center gap-2">
                  <input type="hidden" name="id" value={i.id} />
                  <select
                    name="status"
                    defaultValue={i.status}
                    className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" variant="outline" size="sm">
                    Update status
                  </Button>
                </form>

                {i.status !== "converted" ? (
                  <form action={convertInquiryToOrganization}>
                    <input type="hidden" name="id" value={i.id} />
                    <Button type="submit" size="sm">
                      <Building2 className="size-4" />
                      Convert to organization
                    </Button>
                  </form>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
