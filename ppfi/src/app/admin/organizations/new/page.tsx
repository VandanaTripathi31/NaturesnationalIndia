import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveOrganization } from "@/features/admin/actions";
import { organizationFields } from "@/features/admin/form-fields";

export default function NewOrganizationPage() {
  return (
    <div>
      <PageHeader title="New organization" description="Add a partner institute." />
      <AdminForm
        action={saveOrganization}
        fields={organizationFields}
        initial={{ status: "active" }}
        submitLabel="Create organization"
      />
    </div>
  );
}
