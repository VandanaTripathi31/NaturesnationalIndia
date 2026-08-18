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

// Dev-only diagnostic: prints raw stored value -> final resolved URL so a
// real broken image is provable from the browser console instead of
// guessed at. This is the one thing genuinely impossible to verify from
// this repo alone — resolveImageUrl can only be *proven* correct/incorrect
// against the actual stored value and a live fetch, neither of which this
// sandbox can reach (production DB, Cloudinary, and the legacy site are
// all unreachable from here). `label` lets the caller identify which
// image (product name + gallery index, search result, etc.) this is.
function logResolution(raw, resolved, label) {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;
  // eslint-disable-next-line no-console
  console.debug(
    `[image-url]${label ? ` ${label}:` : ""} "${raw}" -> "${resolved}"`,
  );
}

// Magento's literal placeholder for "no image was ever assigned to this
// product" — not a real filename. Building a URL from it
// (`${MAGENTO_MEDIA_BASE}/media/catalog/product/no_selection`) points at a
// path that was never a real file on the legacy host either, so every
// request for it hangs until the upstream fetch times out (see the
// `upstream image response timed out` errors in the Next.js image
// optimizer logs) instead of failing fast with a 404. Treating it as "no
// image" up front avoids that dead round-trip entirely and lets the caller
// fall straight through to the fallback image.
const NO_SELECTION_RE = /(^|\/)no_selection\/?$/i;

export function resolveImageUrl(value, label) {
  const url = typeof value === "string" ? value.trim() : "";
  if (!url || NO_SELECTION_RE.test(url)) return null;

  let resolved;

  // Already absolute (Cloudinary, unsplash, the legacy site directly, or
  // any other fully-qualified URL) — nothing to do but encode.
  if (/^https?:\/\//i.test(url)) {
    resolved = safeEncode(url);
  } else if (url.startsWith("//")) {
    // Protocol-relative ("//host/path") — just needs a scheme.
    resolved = safeEncode(`https:${url}`);
  } else {
    // Bare relative path left over from a MAGENTO_MEDIA_BASE-less
    // migration — resolve it against the legacy media host so it
    // actually loads.
    const path = url.startsWith("/") ? url : `/${url}`;

    // Defensive: if the bare path already contains the legacy host's own
    // hostname (e.g. a value like "www.naturesnaturalindia.com/f/e/x.jpg"
    // saved without a scheme — a plausible artifact of inconsistent
    // migration batches/manual edits), prefixing LEGACY_MEDIA_BASE again
    // would double it into a dead URL. Strip a duplicate occurrence
    // before prefixing rather than assuming every bare path is a clean
    // filesystem-style path.
    const hostname = new URL(LEGACY_MEDIA_BASE).hostname;
    const dedupedPath = path.startsWith(`/${hostname}`)
      ? path.slice(hostname.length + 1)
      : path;

    resolved = safeEncode(`${LEGACY_MEDIA_BASE}${dedupedPath}`);
  }

  logResolution(value, resolved, label);
  return resolved;
}

/**
 * True for any resolved URL served directly off the legacy site
 * (naturesnaturalindia.com / *.naturesnaturalindia.com), as opposed to
 * Cloudinary or a local /public asset.
 *
 * Why this matters: next/image's built-in optimizer fetches the source
 * image from *its own server* (via /_next/image), not the browser — and
 * the legacy host's bot/hotlink protection 403s that server-side fetch
 * (confirmed: opening the same URL directly in a browser tab loads fine,
 * only the Next.js-proxied request fails with "upstream image response
 * failed ... 403"). Callers use this to render those specific images with
 * next/image's `unoptimized` prop, which makes the *browser* fetch the
 * image directly — exactly the request that already works — instead of
 * routing it through the blocked server-side proxy. Cloudinary and local
 * assets are unaffected and keep using the optimizer normally.
 */
export function isLegacyMediaUrl(url) {
  if (typeof url !== "string") return false;
  try {
    const hostname = new URL(url).hostname;
    return hostname === "naturesnaturalindia.com" || hostname.endsWith(".naturesnaturalindia.com");
  } catch {
    return false;
  }
}

/** Same resolution, applied to a Cloudinary-style `{ url, public_id }` object. */
export function resolveImageObject(image, label) {
  if (!image) return null;
  const url = resolveImageUrl(image.url, label);
  return url ? { ...image, url } : null;
}
