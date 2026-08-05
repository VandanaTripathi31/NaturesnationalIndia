/**
 * Single source of truth for the site's public-facing (SEO) URL structure.
 *
 * The live reference site (naturesnaturalindia.com) uses:
 *   Category page :  /{category-slug}.html
 *   Product page  :  /{category-slug}/{product-slug}.html
 *
 * Every category/product slug comes straight from the existing admin
 * dashboard → MongoDB → API — nothing here is hardcoded per-category. To
 * make an existing category's URL match the live site exactly, update that
 * category's `slug` field from the Admin Dashboard to the desired SEO slug
 * (e.g. "pure-and-natural-essential-oils"); this file will automatically
 * turn that into "/pure-and-natural-essential-oils.html" everywhere on the
 * frontend, with no code changes required.
 */

/** Build the public URL for a category page from its slug. */
export function categoryHref(slug) {
  if (!slug) return "/";
  return `/${slug}.html`;
}

/**
 * Build the public URL for a product page.
 *
 * The live site nests products under their category:
 *   /{category-slug}/{product-slug}.html
 * (e.g. /pure-and-natural-essential-oils/agarwood-essential-oil.html).
 */
export function productHref(categorySlug, productSlug) {
  // Products live UNDER their category on the live site:
  //   /{category-slug}/{product-slug}.html
  if (categorySlug && productSlug) {
    return `/${categorySlug}/${productSlug}.html`;
  }
  // Fallback if only one segment is known (e.g. a flat legacy link):
  const only = productSlug ?? categorySlug;
  return only ? `/${only}.html` : "/";
}

/** Strip a trailing ".html" from a route segment, e.g. "foo.html" -> "foo". */
export function stripHtml(segment = "") {
  return segment.endsWith(".html") ? segment.slice(0, -".html".length) : segment;
}
