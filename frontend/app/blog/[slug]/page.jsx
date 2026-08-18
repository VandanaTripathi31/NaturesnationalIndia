import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getBlogBySlug, getRelatedBlogs } from "../../../src/services/blogService";
import BlogDetailView from "../../../src/components/blog/BlogDetailView";
import { CategoryPageSkeleton } from "../../../src/components/ui/CatalogSkeletons";

async function resolveBlog(slug) {
  try {
    return await getBlogBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const blog = await resolveBlog(slug);
  if (!blog) return { title: "Article Not Found | Natures Natural India" };

  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    keywords: blog.metaKeywords
      ? blog.metaKeywords.split(",").map((k) => k.trim())
      : undefined,
    alternates: { canonical: `/blog/${blog.slug}` },
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt,
      type: "article",
      url: `/blog/${blog.slug}`,
      images: blog.image ? [blog.image] : undefined,
      publishedTime: blog.publishedAt,
    },
  };
}

export default async function BlogDetailPage({ params }) {
  const { slug } = await params;
  const blog = await resolveBlog(slug);
  if (!blog) notFound();

  const related = await getRelatedBlogs(slug).catch(() => []);

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <BlogDetailView blog={blog} related={related} />
    </Suspense>
  );
}
