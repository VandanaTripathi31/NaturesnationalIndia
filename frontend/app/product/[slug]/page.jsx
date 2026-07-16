import { redirect, notFound } from "next/navigation";
import { getProductBySlug } from "../../../src/services/productService";
import { productHref } from "../../../src/lib/seo-routes";

// Legacy path kept working (nothing removed) but permanently redirected to
// the canonical SEO URL used across the rest of the site:
// /{category-slug}/{product-slug}.html — matching the live reference site.
export default async function LegacyProductRedirect({ params }) {
  const { slug } = await params;
  let target = null;

  try {
    const product = await getProductBySlug(slug);
    target = productHref(product.category?.slug, product.slug);
  } catch {
    notFound();
  }

  redirect(target);
}
