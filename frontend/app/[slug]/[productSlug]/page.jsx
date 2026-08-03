import { redirect, notFound } from "next/navigation";
import { getProductBySlug } from "../../../src/services/productService";
import { stripHtml, productHref } from "../../../src/lib/seo-routes";

// Legacy nested "/{category-slug}/{product-slug}.html" URLs are kept working
// but permanently redirected to the canonical FLAT product URL used on the
// live site (see sitemap.xml): "/{product-slug}.html".
export default async function LegacyNestedProductRedirect({ params }) {
  const { productSlug: rawProductSlug } = await params;
  if (!rawProductSlug.endsWith(".html")) notFound();

  const productSlug = stripHtml(rawProductSlug);

  let product;
  try {
    product = await getProductBySlug(productSlug);
  } catch {
    notFound();
  }

  redirect(productHref(product.slug));
}
