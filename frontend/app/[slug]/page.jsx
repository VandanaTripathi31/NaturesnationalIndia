import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import {
  getCategories,
  getCategoryBySlug,
} from "../../src/services/categoryService";
import {
  getProductBySlug,
  getRelatedProducts,
} from "../../src/services/productService";
import CategoryPageView from "../../src/components/catalog/CategoryPageView";
import ProductPageView from "../../src/components/catalog/ProductPageView";
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
      alternates: { canonical: productHref(product.slug) },
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

  const categoryData = await resolveCategory(slug);
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

  // ── 2. Fall back to resolving the slug as a product ───────────────
  const product = await resolveProduct(slug);
  if (!product) notFound();

  // Old (indexed) slug → 301 to the canonical product URL.
  if (product.slug !== slug) {
    redirect(productHref(product.slug));
  }

  const [relatedProducts, categories] = await Promise.all([
    getRelatedProducts(product.slug).catch(() => []),
    getCategories().catch(() => []),
  ]);

  let featuredProducts = [];
  if (product.category?.slug) {
    const relatedCategory = await resolveCategory(product.category.slug);
    featuredProducts = (relatedCategory?.products ?? [])
      .filter((item) => item.featured && item.id !== product.id)
      .slice(0, 4);
  }

  return (
    <ProductPageView
      product={product}
      relatedProducts={relatedProducts}
      categories={categories}
      featuredProducts={featuredProducts}
    />
  );
}
