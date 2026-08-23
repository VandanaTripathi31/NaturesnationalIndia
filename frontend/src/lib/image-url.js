const LEGACY_MEDIA_BASE = "https://www.naturesnaturalindia.com";
function safeEncode(url) {
  try {
    return encodeURI(url);
  } catch {
    return url;
  }
}

function logResolution(raw, resolved, label) {
  if (process.env.NODE_ENV === "production") return;
  if (typeof window === "undefined") return;
  console.debug(
    `[image-url]${label ? ` ${label}:` : ""} "${raw}" -> "${resolved}"`,
  );
}

const NO_SELECTION_RE = /(^|\/)no_selection\/?$/i;

// True for URLs on the old Magento media host. These must NOT go through
// the Vercel image optimizer: the optimizer fetches them server-side and
// hangs until "upstream image response timed out" (several seconds) when
// the legacy server is slow or the file is gone — only then can the client
// fall back. Rendering them unoptimized lets the browser fetch directly,
// which loads fast when the file exists and fails fast when it doesn't.
export function isLegacyMediaUrl(value) {
  if (typeof value !== "string") return false;
  try {
    const { hostname } = new URL(value);
    return (
      hostname === "naturesnaturalindia.com" ||
      hostname.endsWith(".naturesnaturalindia.com")
    );
  } catch {
    return false;
  }
}

export function resolveImageUrl(value, label) {
  const url = typeof value === "string" ? value.trim() : "";
  if (!url || NO_SELECTION_RE.test(url)) return null;

  let resolved;

  if (/^https?:\/\//i.test(url)) {
    resolved = safeEncode(url);
  } else if (url.startsWith("//")) {
    resolved = safeEncode(`https:${url}`);
  } else {
    const path = url.startsWith("/") ? url : `/${url}`;

    const hostname = new URL(LEGACY_MEDIA_BASE).hostname;
    const dedupedPath = path.startsWith(`/${hostname}`)
      ? path.slice(hostname.length + 1)
      : path;

    resolved = safeEncode(`${LEGACY_MEDIA_BASE}${dedupedPath}`);
  }

  logResolution(value, resolved, label);
  return resolved;
}

export function resolveImageObject(image, label) {
  if (!image) return null;
  const url = resolveImageUrl(image.url, label);
  return url ? { ...image, url } : null;
}
