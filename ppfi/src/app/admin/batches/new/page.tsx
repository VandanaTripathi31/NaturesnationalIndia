import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveBatch } from "@/features/admin/actions";
import { buildBatchFields } from "@/features/admin/form-fields";
import { getOrganizationOptions } from "@/features/admin/data";
import { getCourses, getMentors } from "@/features/content";

export default async function NewBatchPage() {
  const [courses, mentors, orgs] = await Promise.all([
    getCourses(),
    getMentors(),
    getOrganizationOptions(),
  ]);

  const fields = buildBatchFields(
    courses.map((c) => ({ value: c.slug, label: c.title })),
    orgs.map((o) => ({ value: o.id, label: o.name })),
    mentors.map((m) => ({ value: m.slug, label: m.name })),
  );

  return (
    <div>
      <PageHeader title="New batch" description="Group students into a cohort." />
      <AdminForm
        action={saveBatch}
        fields={fields}
        initial={{ type: "b2c", status: "upcoming" }}
        submitLabel="Create batch"
      />
    </div>
  );
}
