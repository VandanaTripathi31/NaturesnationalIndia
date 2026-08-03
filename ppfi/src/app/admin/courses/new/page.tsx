import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveCourse } from "@/features/admin/actions";
import { courseFields } from "@/features/admin/form-fields";

export default function NewCoursePage() {
  return (
    <div>
      <PageHeader title="New course" description="Add a course to the catalogue." />
      <AdminForm action={saveCourse} fields={courseFields} submitLabel="Create course" />
    </div>
  );
}
