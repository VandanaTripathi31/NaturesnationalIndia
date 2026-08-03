import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveMentor } from "@/features/admin/actions";
import { mentorFields } from "@/features/admin/form-fields";
import { getMentorBySlug } from "@/features/content";

export default async function EditMentorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const mentor = await getMentorBySlug(slug);
  if (!mentor) notFound();

  return (
    <div>
      <PageHeader title="Edit mentor" description={mentor.name} />
      <AdminForm
        action={saveMentor}
        fields={mentorFields}
        initial={{
          ...mentor,
          linkedin: mentor.socials?.linkedin ?? "",
          instagram: mentor.socials?.instagram ?? "",
        }}
        submitLabel="Save changes"
      />
    </div>
  );
}
