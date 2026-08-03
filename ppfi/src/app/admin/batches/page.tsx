import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DataTable, Td } from "@/components/admin/data-table";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteBatch } from "@/features/admin/actions";
import { listBatches } from "@/features/admin/data";

export default async function AdminBatchesPage() {
  const batches = await listBatches();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Batches" description="B2C cohorts and B2B on-campus groups." />
        <Button asChild>
          <Link href="/admin/batches/new">
            <Plus className="size-4" />
            New batch
          </Link>
        </Button>
      </div>

      {batches.length === 0 ? (
        <EmptyState title="No batches" description="Create a batch to group students." />
      ) : (
        <DataTable headers={["Name", "Course", "Type", "Organization", "Status", ""]}>
          {batches.map((b) => (
            <tr key={b.id}>
              <Td className="font-medium">{b.name}</Td>
              <Td>{b.courseSlug}</Td>
              <Td>
                <Badge variant={b.type === "b2b" ? "secondary" : "muted"}>
                  {b.type.toUpperCase()}
                </Badge>
              </Td>
              <Td className="text-muted-foreground">{b.organizationName ?? "—"}</Td>
              <Td>
                <Badge variant={b.status === "running" ? "default" : "muted"}>{b.status}</Badge>
              </Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon" aria-label="Edit">
                    <Link href={`/admin/batches/${b.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <form action={deleteBatch}>
                    <input type="hidden" name="id" value={b.id} />
                    <Button variant="ghost" size="icon" aria-label="Delete" type="submit">
                      <Trash2 className="size-4 text-destructive" />
                    </Button>
                  </form>
                </div>
              </Td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
