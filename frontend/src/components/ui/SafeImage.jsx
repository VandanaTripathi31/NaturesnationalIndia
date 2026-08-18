"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isLegacyMediaUrl } from "../../lib/image-url";

// Site-wide default product image. Used whenever a product has no usable
// image at all — no image on record, a Magento `no_selection` placeholder,
// or a stored URL that fails to actually load (dead legacy-media path,
// deleted Cloudinary asset, etc.) — so the storefront never shows a bare
// broken-image icon.
export const DEFAULT_FALLBACK_IMAGE = "/images/fragrances_oil_1_18.webp";

/**
 * `next/image` with a graceful failure path.
 *
 * ROOT CAUSE this addresses: resolveImageUrl (lib/image-url.js) fixes the
 * *known* broken-URL shapes (a bare relative path left over from a
 * MAGENTO_MEDIA_BASE-less migration, and the Magento `no_selection`
 * placeholder). But some URLs only reveal themselves as broken at fetch
 * time in the browser — e.g. a Cloudinary URL pointing at an asset that
 * was never actually uploaded/was since deleted, or a legacy path whose
 * *directory structure* (not just its host) doesn't match what
 * resolveImageUrl assumes. No amount of URL-string inspection catches
 * those ahead of time.
 *
 * Rather than guess, this component listens for the actual load failure
 * and swaps to the site's default product image — the same one used when
 * there's no image URL at all — so a real fetch failure degrades to a real
 * picture instead of the browser's broken-image icon.
 *
 * FIX (legacy-host images silently falling back even when the URL is
 * correct): next/image's optimizer fetches the source *server-side* (via
 * /_next/image). The legacy site's bot/hotlink protection 403s that
 * server-side request specifically — confirmed by the same URL loading
 * fine when opened directly in a browser tab — which onError below then
 * quietly swaps for the fallback, masking a real infrastructure block as
 * "no image". Legacy-host images now render `unoptimized`, so the
 * *browser* fetches them directly (the request that already works)
 * instead of routing through the blocked server-side proxy. This affects
 * every legacy-host image (blog, product, category), not just blog.
 */
export default function SafeImage({
  src,
  alt,
  // Accepted for backward compatibility with existing call sites (the old
  // icon-based fallback used these); no longer meaningful now that the
  // fallback is a real image, so they're intentionally not forwarded.
  fallbackIconSize: _fallbackIconSize,
  fallbackClassName: _fallbackClassName,
  ...imageProps
}) {
  const [failed, setFailed] = useState(false);

  // A card can be reused for a different product's src without unmounting
  // (list re-renders); reset the failure flag so a new src gets its own
  // chance to load instead of being stuck showing the fallback forever.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  const resolvedSrc = !src || failed ? DEFAULT_FALLBACK_IMAGE : src;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      onError={() => setFailed(true)}
      unoptimized={isLegacyMediaUrl(resolvedSrc)}
      {...imageProps}
    />
  );
}
