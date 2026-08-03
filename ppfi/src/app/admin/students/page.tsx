import Link from "next/link";
import { UserPlus } from "lucide-react";

import { DataTable, Td } from "@/components/admin/data-table";
import { EmptyState, PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { listStudents } from "@/features/admin/data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminStudentsPage() {
  const students = await listStudents();

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <PageHeader title="Students" description="Registered learners and their enrollments." />
        <Button asChild>
          <Link href="/admin/students/enroll">
            <UserPlus className="size-4" />
            Enroll a student
          </Link>
        </Button>
      </div>

      {students.length === 0 ? (
        <EmptyState title="No students yet" description="Students appear here once they register." />
      ) : (
        <DataTable headers={["Name", "Email", "Phone", "Enrollments", "Joined"]}>
          {students.map((s) => (
            <tr key={s.id}>
              <Td className="font-medium">{s.name}</Td>
              <Td className="text-muted-foreground">{s.email}</Td>
              <Td>{s.phone || "—"}</Td>
              <Td>{s.enrollments}</Td>
              <Td className="text-muted-foreground">{formatDate(s.createdAt)}</Td>
            </tr>
          ))}
        </DataTable>
      )}
    </div>
  );
}
