import Link from "next/link";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { DataTable, Td } from "@/components/admin/data-table";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteCourse } from "@/features/admin/actions";
import { getCourses } from "@/features/content";
import { formatINR } from "@/lib/utils";

export default async function AdminCoursesPage() {
  const courses = await getCourses();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Courses" />
        <Button asChild>
          <Link href="/admin/courses/new">
            <Plus className="size-4" />
            New course
          </Link>
        </Button>
      </div>

      {courses.length === 0 ? (
        <EmptyState title="No courses" description="Create your first course to populate the catalogue." />
      ) : (
        <DataTable headers={["Title", "Category", "Price", "Status", ""]}>
          {courses.map((c) => (
            <tr key={c.slug}>
              <Td className="font-medium">{c.title}</Td>
              <Td>{c.category}</Td>
              <Td>{c.comingSoon ? "—" : formatINR(c.price)}</Td>
              <Td>
                {c.comingSoon ? (
                  <Badge variant="secondary">Coming soon</Badge>
                ) : c.featured ? (
                  <Badge>Featured</Badge>
                ) : (
                  <Badge variant="muted">Published</Badge>
                )}
              </Td>
              <Td>
                <div className="flex justify-end gap-2">
                  <Button asChild variant="ghost" size="icon" aria-label="Edit">
                    <Link href={`/admin/courses/${c.slug}/edit`}>
                      <Pencil className="size-4" />
                    </Link>
                  </Button>
                  <form action={deleteCourse}>
                    <input type="hidden" name="slug" value={c.slug} />
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
