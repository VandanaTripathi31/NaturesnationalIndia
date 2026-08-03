import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { savePost } from "@/features/admin/actions";
import { postFields } from "@/features/admin/form-fields";

export default function NewPostPage() {
  return (
    <div>
      <PageHeader title="New post" description="Publish a blog article." />
      <AdminForm action={savePost} fields={postFields} submitLabel="Publish post" />
    </div>
  );
}
