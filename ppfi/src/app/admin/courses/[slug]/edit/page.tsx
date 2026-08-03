import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { saveCourse } from "@/features/admin/actions";
import { courseFields } from "@/features/admin/form-fields";
import { getCourseBySlug } from "@/features/content";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);
  if (!course) notFound();

  return (
    <div>
      <PageHeader title="Edit course" description={course.title} />
      <AdminForm
        action={saveCourse}
        fields={courseFields}
        initial={course as unknown as Record<string, unknown>}
        submitLabel="Save changes"
      />
    </div>
  );
}
