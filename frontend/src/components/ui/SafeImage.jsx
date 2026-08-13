"use client";

import { useState } from "react";
import Image from "next/image";
import { Leaf } from "lucide-react";

/**
 * `next/image` with a graceful failure path.
 *
 * ROOT CAUSE this addresses: resolveImageUrl (lib/image-url.js) fixes the
 * *known* broken-URL shape (a bare relative path left over from a
 * MAGENTO_MEDIA_BASE-less migration). But the screenshots show broken
 * image icons for products where the resolver has no way to know it's
 * wrong from the string alone — e.g. a Cloudinary URL pointing at an
 * asset that was never actually uploaded/was since deleted, or a legacy
 * path whose *directory structure* (not just its host) doesn't match what
 * resolveImageUrl assumes. Those only reveal themselves as a real 404 at
 * fetch time in the browser — no amount of URL-string inspection catches
 * them, and this sandbox has no network access to the real backend/
 * Cloudinary account to enumerate which specific URLs are actually dead.
 *
 * Rather than guess, this component listens for the actual load failure
 * and swaps to the site's placeholder — the same one already used when
 * there's no image URL at all — so a real fetch failure degrades to the
 * existing "no image" placeholder instead of the browser's broken-image
 * icon. This is universal: every image call site can use it and get the
 * same graceful behavior regardless of *why* a given URL fails.
 */
export default function SafeImage({
  src,
  alt,
  fallbackIconSize = 32,
  fallbackClassName = "flex h-full w-full items-center justify-center",
  ...imageProps
}) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className={fallbackClassName}>
        <Leaf size={fallbackIconSize} style={{ color: "var(--color-brown-muted)" }} />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      {...imageProps}
    />
  );
}
