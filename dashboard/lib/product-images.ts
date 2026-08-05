import type { ProductImage } from "@/types/product";

export function normalizeProductImages(
  images: Array<{ public_id?: string; url?: string; secure_url?: string }> = [],
): ProductImage[] {
  return images
    .map((image) => ({
      public_id: image.public_id ?? "",
      url: image.url ?? image.secure_url ?? "",
    }))
    // Keep any image that has a URL. `public_id` is empty for images imported
    // in reference mode (they point straight at the source URL), so requiring
    // it here previously dropped EVERY migrated product image.
    .filter((image) => image.url);
}
