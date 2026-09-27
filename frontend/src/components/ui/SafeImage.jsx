"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { isLegacyMediaUrl } from "../../lib/image-url";

export const DEFAULT_FALLBACK_IMAGE = "/images/fragrances_oil_1_18.webp";

export default function SafeImage({
  src,
  alt,

  fallbackIconSize: _fallbackIconSize,
  fallbackClassName: _fallbackClassName,
  ...imageProps
}) {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  const usingFallback = !src || failed;
  const resolvedSrc = usingFallback ? DEFAULT_FALLBACK_IMAGE : src;
  const legacySrc = !usingFallback && isLegacyMediaUrl(resolvedSrc);

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      // Two cases bypass the Vercel image optimizer (/_next/image):
      //
      // 1. Legacy Magento media URLs (see isLegacyMediaUrl): the optimizer
      //    fetches them server-side and blocks for its full upstream
      //    timeout when the old server is slow/dead, so onError — and the
      //    fallback — only fired seconds later. Fetched directly by the
      //    browser they either load or fail immediately. no-referrer is
      //    needed because the legacy host's hotlink protection 403s any
      //    request carrying a cross-origin Referer.
      //
      // 2. The fallback itself: a small pre-compressed webp in /public,
      //    served straight from the static CDN instead of paying a cold
      //    on-demand optimizer transform per rendered size.
      unoptimized={usingFallback || legacySrc}
      referrerPolicy={legacySrc ? "no-referrer" : undefined}
      onError={() => setFailed(true)}
      {...imageProps}
    />
  );
}
