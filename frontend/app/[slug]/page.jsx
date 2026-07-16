import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
} from "../../src/services/categoryService";
import CategoryPageView from "../../src/components/catalog/CategoryPageView";
import { CategoryPageSkeleton } from "../../src/components/ui/CatalogSkeletons";
import { stripHtml, categoryHref } from "../../src/lib/seo-routes";

// This route owns every "/{category-slug}.html" URL — the same pattern
// used on the live site. The slug itself is never hardcoded: it's read
// straight from each category's `slug` field in MongoDB via the existing
// public categories API, so any category created from the Admin Dashboard
// automatically gets a matching page here with zero code changes.

export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params;

  if (!rawSlug.endsWith(".html")) return {};
  const slug = stripHtml(rawSlug);

  try {
    const data = await getCategoryBySlug(slug, { page: 1, limit: 1 });
    const category = data.category;

    return {
      title: category.metaTitle || category.name,
      description: category.metaDescription || category.description,
      keywords: category.metaKeywords?.split(",").map((item) => item.trim()),
      alternates: {
        canonical: categoryHref(category.slug),
      },
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function SeoCategoryPage({ params, searchParams }) {
  const { slug: rawSlug } = await params;

  // Only handle "*.html" segments here — anything else genuinely isn't a
  // page this route owns, so it 404s like normal instead of swallowing
  // unrelated single-segment paths.
  if (!rawSlug.endsWith(".html")) notFound();

  const slug = stripHtml(rawSlug);
  const query = await searchParams;
  const page = Number(query.page || 1);
  const search = typeof query.search === "string" ? query.search : "";

  let categories = [];
  let data;

  try {
    [categories, data] = await Promise.all([
      getCategories(),
      getCategoryBySlug(slug, { page, limit: 12, search }),
    ]);
  } catch {
    notFound();
  }

  const featuredProducts = (data.products ?? [])
    .filter((product) => product.featured)
    .slice(0, 4);

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageView
        category={data.category}
        products={data.products ?? []}
        pagination={data.pagination}
        categories={categories}
        featuredProducts={featuredProducts}
        searchQuery={search}
      />
    </Suspense>
  );
}
