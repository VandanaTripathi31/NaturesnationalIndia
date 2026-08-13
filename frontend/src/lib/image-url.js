/**
 * Resolves a stored product/category image value into a URL `next/image`
 * can actually load.
 *
 * ROOT CAUSE (see migration/lib/images.js `magentoImageUrl`): products
 * migrated from the old Magento store default to `IMAGE_MODE=reference`,
 * which stores the image exactly as `${MAGENTO_MEDIA_BASE}${path}`. If
 * `MAGENTO_MEDIA_BASE` was ever unset/blank when a batch was migrated, that
 * concatenation collapses to just the bare relative path (e.g.
 * `/f/e/fenugreek-carrier-oil.jpg`) with no scheme or host at all. A bare
 * path like that isn't a broken *remote* URL — `next/image` treats anything
 * not starting with `http(s)://` as a *local* asset under `/public`, so it
 * 404s against the Next.js app's own file tree, which never had these files.
 * That explains why only *some* images are missing (whichever migration
 * batches ran with the env var set vs not) while Cloudinary-hosted and
 * dashboard-uploaded images are unaffected.
 *
 * This resolves any such bare path against the same legacy media host the
 * migration script targets by default, so already-migrated data keeps
 * working without a data rewrite. It's a no-op for already-absolute URLs
 * (Cloudinary, the live site, anything else).
 */
const LEGACY_MEDIA_BASE = "https://www.naturesnaturalindia.com";

// Magento product image filenames frequently contain raw spaces/parens
// (e.g. "/f/e/Fenugreek Carrier Oil (100ml).jpg") — valid on a filesystem,
// invalid inside a URL. `encodeURI` escapes exactly those characters while
// leaving already-percent-encoded sequences and normal URL syntax (`/`,
// `:`, `?`, `%`, ...) untouched, so it's safe to apply unconditionally
// without double-encoding already-clean URLs. Without this, any such image
// fails to fetch (400) even once the host/protocol is otherwise correct —
// which, depending on which page of results happens to contain
// space-in-filename products, can look exactly like "page 1 fine, page 2
// broken" even though every page runs through the same code path.
function safeEncode(url) {
  try {
    return encodeURI(url);
  } catch {
    return url;
  }
}

export function resolveImageUrl(value) {
  const url = typeof value === "string" ? value.trim() : "";
  if (!url) return null;

  // Already absolute (Cloudinary, unsplash, the legacy site directly, or
  // any other fully-qualified URL) — nothing to do but encode.
  if (/^https?:\/\//i.test(url)) return safeEncode(url);

  // Protocol-relative ("//host/path") — just needs a scheme.
  if (url.startsWith("//")) return safeEncode(`https:${url}`);

  // Bare relative path left over from a MAGENTO_MEDIA_BASE-less migration —
  // resolve it against the legacy media host so it actually loads.
  const path = url.startsWith("/") ? url : `/${url}`;
  return safeEncode(`${LEGACY_MEDIA_BASE}${path}`);
}

/** Same resolution, applied to a Cloudinary-style `{ url, public_id }` object. */
export function resolveImageObject(image) {
  if (!image) return null;
  const url = resolveImageUrl(image.url);
  return url ? { ...image, url } : null;
}
