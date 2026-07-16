import { redirect, notFound } from "next/navigation";
import { getCategoryBySlug } from "../../../src/services/categoryService";
import { categoryHref } from "../../../src/lib/seo-routes";

// Legacy path kept working (nothing removed) but permanently redirected to
// the canonical SEO URL used across the rest of the site:
// /{category-slug}.html — matching the live reference site's structure.
export default async function LegacyCategoryRedirect({ params }) {
  const { slug } = await params;
  let target = null;

  try {
    const data = await getCategoryBySlug(slug, { page: 1, limit: 1 });
    target = categoryHref(data.category.slug);
  } catch {
    notFound();
  }

  redirect(target);
}
