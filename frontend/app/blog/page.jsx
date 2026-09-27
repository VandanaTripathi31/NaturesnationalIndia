import { Suspense } from "react";
import { getBlogs } from "../../src/services/blogService";
import BlogListView from "../../src/components/blog/BlogListView";
import { CategoryPageSkeleton } from "../../src/components/ui/CatalogSkeletons";

export const metadata = {
  title: "Blog | Natures Natural India",
  description:
    "Read about essential oils, carrier oils, hydrosols and natural ingredient sourcing — insights for B2B buyers, formulators and wellness brands from Natures Natural India.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Natures Natural India Blog",
    description:
      "Read about essential oils, carrier oils, hydrosols and natural ingredient sourcing.",
    type: "website",
    url: "/blog",
  },
};

export default async function BlogPage({ searchParams }) {
  const query = await searchParams;
  const page = Number(query.page || 1);
  const search = typeof query.search === "string" ? query.search : "";

  let data = { blogs: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
  try {
    data = await getBlogs({ page, search });
  } catch {
    data = { blogs: [], pagination: { page: 1, limit: 10, total: 0, pages: 1 } };
  }

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <BlogListView
        blogs={data.blogs}
        pagination={data.pagination}
        searchQuery={search}
      />
    </Suspense>
  );
}
