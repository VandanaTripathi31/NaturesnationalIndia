import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DataTable, Td } from "@/components/admin/data-table";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { deleteMentor } from "@/features/admin/actions";
import { getMentors } from "@/features/content";

export default async function AdminMentorsPage() {
  const mentors = await getMentors();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Mentors" />
        <Button asChild>
          <Link href="/admin/mentors/new">
            <Plus className="size-4" />
            New mentor
          </Link>
        </Button>
      </div>

      {mentors.length === 0 ? (
        <EmptyState title="No mentors" description="Add your first mentor profile." />
      ) : (
        <DataTable headers={["Name", "Role", "Expertise", ""]}>
          {mentors.map((m) => (
            <tr key={m.slug}>
              <Td className="font-medium">{m.name}</Td>
              <Td>{m.role}</Td>
              <Td className="text-muted-foreground">{m.expertise.join(", ")}</Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon" aria-label="Edit">
                    <Link href={`/admin/mentors/${m.slug}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <form action={deleteMentor}>
                    <input type="hidden" name="slug" value={m.slug} />
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
