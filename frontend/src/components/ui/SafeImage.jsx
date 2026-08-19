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

  const resolvedSrc = !src || failed ? DEFAULT_FALLBACK_IMAGE : src;

  return (
    <Image
      src={resolvedSrc}
      alt={alt}
      onError={() => setFailed(true)}
      {...imageProps}
    />
  );
}
