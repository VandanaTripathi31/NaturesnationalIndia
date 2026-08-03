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
 * The live site (see sitemap.xml) serves products as FLAT "/{product-slug}.html"
 * URLs — they are NOT nested under their category. This helper is kept
 * backward-compatible with the previous two-argument call style
 * `productHref(categorySlug, productSlug)` that is still used across the app:
 * when a second argument is present it is treated as the product slug and the
 * category segment is dropped. Single-argument `productHref(productSlug)` also
 * works.
 */
export function productHref(productSlugOrCategory, productSlug) {
  const slug = productSlug ?? productSlugOrCategory;
  if (!slug) return "/";
  return `/${slug}.html`;
}

/** Strip a trailing ".html" from a route segment, e.g. "foo.html" -> "foo". */
export function stripHtml(segment = "") {
  return segment.endsWith(".html") ? segment.slice(0, -".html".length) : segment;
}
