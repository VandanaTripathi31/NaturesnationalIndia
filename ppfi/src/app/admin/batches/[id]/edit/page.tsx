import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveBatch } from "@/features/admin/actions";
import { buildBatchFields } from "@/features/admin/form-fields";
import { getBatchById, getOrganizationOptions } from "@/features/admin/data";
import { getCourses, getMentors } from "@/features/content";

export default async function EditBatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [batch, courses, mentors, orgs] = await Promise.all([
    getBatchById(id),
    getCourses(),
    getMentors(),
    getOrganizationOptions(),
  ]);
  if (!batch) notFound();

  const fields = buildBatchFields(
    courses.map((c) => ({ value: c.slug, label: c.title })),
    orgs.map((o) => ({ value: o.id, label: o.name })),
    mentors.map((m) => ({ value: m.slug, label: m.name })),
  );

  return (
    <div>
      <PageHeader title="Edit batch" description={batch.name} />
      <AdminForm
        action={saveBatch}
        fields={fields}
        initial={batch as unknown as Record<string, unknown>}
        hidden={{ id: batch.id }}
        submitLabel="Save changes"
      />
    </div>
  );
}
