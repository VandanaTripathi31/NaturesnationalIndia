import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DataTable, Td } from "@/components/admin/data-table";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteOrganization } from "@/features/admin/actions";
import { listOrganizations } from "@/features/admin/data";

export default async function AdminOrganizationsPage() {
  const orgs = await listOrganizations();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Organizations" description="Partnered schools and colleges." />
        <Button asChild>
          <Link href="/admin/organizations/new">
            <Plus className="size-4" />
            New organization
          </Link>
        </Button>
      </div>

      {orgs.length === 0 ? (
        <EmptyState
          title="No organizations"
          description="Convert a B2B inquiry, or add a partner institute directly."
        />
      ) : (
        <DataTable headers={["Institute", "Contact", "Email", "Status", ""]}>
          {orgs.map((o) => (
            <tr key={o.id}>
              <Td className="font-medium">{o.name}</Td>
              <Td>{o.contactPerson}</Td>
              <Td className="text-muted-foreground">{o.email}</Td>
              <Td>
                <Badge variant={o.status === "active" ? "default" : "muted"}>{o.status}</Badge>
              </Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon" aria-label="Edit">
                    <Link href={`/admin/organizations/${o.id}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <form action={deleteOrganization}>
                    <input type="hidden" name="id" value={o.id} />
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
