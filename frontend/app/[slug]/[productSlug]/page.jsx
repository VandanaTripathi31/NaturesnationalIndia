import { notFound, redirect } from "next/navigation";
import ProductPageView from "../../../src/components/catalog/ProductPageView.jsx";
import {
  getCategories,
  getCategoryBySlug,
} from "../../../src/services/categoryService.js";
import {
  getProductBySlug,
  getRelatedProducts,
} from "../../../src/services/productService";
import { stripHtml, productHref } from "../../../src/lib/seo-routes";

// Owns every "/{category-slug}/{product-slug}.html" URL — matching the
// live site pattern. Both slugs are read live from MongoDB via the
// existing public product/category APIs; nothing here is a hardcoded
// per-product route, so new products created from the Admin Dashboard
// appear automatically at the correct URL.

export async function generateMetadata({ params }) {
  const { productSlug: rawProductSlug } = await params;
  if (!rawProductSlug.endsWith(".html")) return {};
  const productSlug = stripHtml(rawProductSlug);

  try {
    const product = await getProductBySlug(productSlug);

    return {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description,
      keywords: product.metaKeywords?.split(",").map((item) => item.trim()),
      alternates: {
        canonical: productHref(product.category?.slug, product.slug),
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function SeoProductPage({ params }) {
  const { slug: categorySlug, productSlug: rawProductSlug } = await params;

  if (!rawProductSlug.endsWith(".html")) notFound();
  const productSlug = stripHtml(rawProductSlug);

  let product;
  let relatedProducts = [];
  let categories = [];
  let featuredProducts = [];

  try {
    [product, relatedProducts, categories] = await Promise.all([
      getProductBySlug(productSlug),
      getRelatedProducts(productSlug),
      getCategories(),
    ]);

    if (product.category?.slug) {
      const categoryData = await getCategoryBySlug(product.category.slug, {
        page: 1,
        limit: 20,
      });
      featuredProducts = (categoryData.products ?? [])
        .filter((item) => item.featured && item.id !== product.id)
        .slice(0, 4);
    }
  } catch {
    notFound();
  }

  // Keep one canonical URL per product for SEO: if the product's category
  // was changed in the admin dashboard and no longer matches the category
  // segment in the requested URL, redirect to the correct current URL
  // instead of serving the same product under two different addresses.
  if (product.category?.slug && product.category.slug !== categorySlug) {
    redirect(productHref(product.category.slug, product.slug));
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
