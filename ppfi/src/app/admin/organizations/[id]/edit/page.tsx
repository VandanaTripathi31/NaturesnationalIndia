import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveOrganization } from "@/features/admin/actions";
import { organizationFields } from "@/features/admin/form-fields";
import { getOrganizationById } from "@/features/admin/data";

export default async function EditOrganizationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const org = await getOrganizationById(id);
  if (!org) notFound();

  return (
    <div>
      <PageHeader title="Edit organization" description={org.name} />
      <AdminForm
        action={saveOrganization}
        fields={organizationFields}
        initial={org as unknown as Record<string, unknown>}
        hidden={{ id: org.id }}
        submitLabel="Save changes"
      />
    </div>
  );
}
