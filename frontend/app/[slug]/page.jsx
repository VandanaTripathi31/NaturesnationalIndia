import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
} from "../../src/services/categoryService";
import { getProductBySlug } from "../../src/services/productService";
import CategoryPageView from "../../src/components/catalog/CategoryPageView";
import { CategoryPageSkeleton } from "../../src/components/ui/CatalogSkeletons";
import { stripHtml, categoryHref, productHref } from "../../src/lib/seo-routes";

// This route owns every flat "/{slug}.html" URL — the exact structure used on
// the live site (see sitemap.xml), where BOTH categories and products live at
// the top level. A slug is resolved as a category first; if none matches, it
// is resolved as a product. Slugs come straight from MongoDB, so anything
// created in the Admin Dashboard appears here automatically.

async function resolveCategory(slug) {
  try {
    return await getCategoryBySlug(slug, { page: 1, limit: 1 });
  } catch {
    return null;
  }
}

async function resolveProduct(slug) {
  try {
    return await getProductBySlug(slug);
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug: rawSlug } = await params;
  if (!rawSlug.endsWith(".html")) return {};
  const slug = stripHtml(rawSlug);

  const categoryData = await resolveCategory(slug);
  if (categoryData?.category) {
    const category = categoryData.category;
    return {
      title: category.metaTitle || category.name,
      description: category.metaDescription || category.description,
      keywords: category.metaKeywords?.split(",").map((item) => item.trim()),
      alternates: { canonical: categoryHref(category.slug) },
    };
  }

  const product = await resolveProduct(slug);
  if (product) {
    return {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description,
      keywords: product.metaKeywords?.split(",").map((item) => item.trim()),
      alternates: {
        canonical: productHref(product.category?.slug, product.slug),
      },
    };
  }

  return { title: "Natures Natural India" };
}

export default async function SeoSlugPage({ params, searchParams }) {
  const { slug: rawSlug } = await params;

  // Only flat "*.html" slugs belong to this route.
  if (!rawSlug.endsWith(".html")) notFound();
  const slug = stripHtml(rawSlug);

  // ── 1. Try to resolve the slug as a category ──────────────────────
  const query = await searchParams;
  const page = Number(query.page || 1);
  const search = typeof query.search === "string" ? query.search : "";
  // "Show" page-size dropdown (CategoryPageView) — mirrors the backend's
  // own clamp (getPublicCategoryBySlug caps at 50) so an invalid/tampered
  // value can't request something the API would silently clamp anyway.
  const requestedLimit = Number(query.limit);
  const limit =
    Number.isFinite(requestedLimit) && requestedLimit > 0
      ? Math.min(requestedLimit, 50)
      : 15;

  // Fetch the FULL first page of products (bug fix: previously this route
  // only fetched a single product, so category pages showed just one item).
  let categoryData = null;
  try {
    categoryData = await getCategoryBySlug(slug, { page, limit, search });
  } catch {
    categoryData = null;
  }

  if (categoryData?.category) {
    // Old (indexed) slug → 301 to the canonical category URL.
    if (categoryData.category.slug !== slug) {
      redirect(categoryHref(categoryData.category.slug));
    }

    const categories = await getCategories().catch(() => []);
    const featuredProducts = (categoryData.products ?? [])
      .filter((product) => product.featured)
      .slice(0, 4);

    return (
      <Suspense fallback={<CategoryPageSkeleton />}>
        <CategoryPageView
          category={categoryData.category}
          products={categoryData.products ?? []}
          pagination={categoryData.pagination}
          categories={categories}
          featuredProducts={featuredProducts}
          searchQuery={search}
        />
      </Suspense>
    );
  }

  // ── 2. Flat product slug → 301 to the canonical NESTED product URL ──
  // Products live at /{category-slug}/{product-slug}.html; if someone hits a
  // flat "/{product-slug}.html" (e.g. an old sitemap URL) send them there.
  const product = await resolveProduct(slug);
  if (!product) notFound();
  redirect(productHref(product.category?.slug, product.slug));
}
