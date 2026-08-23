"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      // The fallback is a small pre-compressed webp shipped in /public.
      // Serve it directly from the static CDN instead of routing it through
      // the Vercel image optimizer (/_next/image): the optimizer adds a
      // cold on-demand transform per rendered size, which is why the
      // fallback appeared late in production after a broken src had
      // already spent its own optimizer round trip failing.
      unoptimized={usingFallback}
      onError={() => setFailed(true)}
      {...imageProps}
    />
  );
}
