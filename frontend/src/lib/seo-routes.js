export function categoryHref(slug) {
  if (!slug) return "/";
  return `/${slug}.html`;
}

export function productHref(categorySlug, productSlug) {
  if (categorySlug && productSlug) {
    return `/${categorySlug}/${productSlug}.html`;
  }
  const only = productSlug ?? categorySlug;
  return only ? `/${only}.html` : "/";
}

export function stripHtml(segment = "") {
  return segment.endsWith(".html")
    ? segment.slice(0, -".html".length)
    : segment;
}
