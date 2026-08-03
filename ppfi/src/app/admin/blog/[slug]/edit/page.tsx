import { notFound } from "next/navigation";

import { AdminForm } from "@/components/admin/admin-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { savePost } from "@/features/admin/actions";
import { postFields } from "@/features/admin/form-fields";
import { getBlogPostBySlug } from "@/features/content";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);
  if (!post) notFound();

  return (
    <div>
      <PageHeader title="Edit post" description={post.title} />
      <AdminForm
        action={savePost}
        fields={postFields}
        initial={post as unknown as Record<string, unknown>}
        submitLabel="Save changes"
      />
    </div>
  );
}
