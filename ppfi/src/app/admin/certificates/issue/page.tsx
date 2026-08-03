import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { issueCertificate } from "@/features/admin/actions";
import { getStudentOptions } from "@/features/admin/data";
import { getCourses } from "@/features/content";

export default async function IssueCertificatePage() {
  const [students, courses] = await Promise.all([getStudentOptions(), getCourses()]);

  return (
    <div>
      <PageHeader
        title="Issue certificate"
        description="Issuing marks the student's enrollment as completed and creates a verifiable certificate."
      />
      <AdminForm
        action={issueCertificate}
        fields={[
          {
            name: "student",
            label: "Student",
            type: "select",
            options: students.map((s) => ({ value: s.id, label: `${s.name} (${s.email})` })),
          },
          {
            name: "courseSlug",
            label: "Course",
            type: "select",
            options: courses.map((c) => ({ value: c.slug, label: c.title })),
          },
          {
            name: "type",
            label: "Type",
            type: "select",
            options: [
              { value: "b2c", label: "B2C (PPFI-branded)" },
              { value: "b2b", label: "B2B (co-branded)" },
            ],
          },
          {
            name: "organizationName",
            label: "Partner institute name (B2B only)",
            placeholder: "e.g. St. Xavier's College",
          },
        ]}
        submitLabel="Issue certificate"
      />
    </div>
  );
}
