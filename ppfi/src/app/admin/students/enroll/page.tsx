import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { createEnrollment } from "@/features/admin/actions";
import { getStudentOptions } from "@/features/admin/data";
import { getCourses } from "@/features/content";

export default async function EnrollStudentPage() {
  const [students, courses] = await Promise.all([getStudentOptions(), getCourses()]);

  return (
    <div>
      <PageHeader
        title="Enroll a student"
        description="Manually enrol a student in a course (e.g. for B2B or offline payments)."
      />
      <AdminForm
        action={createEnrollment}
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
            name: "source",
            label: "Source",
            type: "select",
            options: [
              { value: "b2c", label: "B2C" },
              { value: "b2b", label: "B2B" },
            ],
          },
        ]}
        submitLabel="Create enrollment"
      />
    </div>
  );
}
