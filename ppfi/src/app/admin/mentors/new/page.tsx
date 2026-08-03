import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveMentor } from "@/features/admin/actions";
import { mentorFields } from "@/features/admin/form-fields";

export default function NewMentorPage() {
  return (
    <div>
      <PageHeader title="New mentor" description="Add a mentor profile." />
      <AdminForm action={saveMentor} fields={mentorFields} submitLabel="Create mentor" />
    </div>
  );
}
