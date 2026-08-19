
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

export function isLegacyMediaUrl(url) {
  if (typeof url !== "string") return false;
  try {
    const hostname = new URL(url).hostname;
    return (
      hostname === "naturesnaturalindia.com" ||
      hostname.endsWith(".naturesnaturalindia.com")
    );
  } catch {
    return false;
  }
}

export function resolveImageObject(image, label) {
  if (!image) return null;
  const url = resolveImageUrl(image.url, label);
  return url ? { ...image, url } : null;
}
