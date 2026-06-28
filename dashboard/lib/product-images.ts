import type { ProductImage } from "@/types/product";

export function normalizeProductImages(
  images: Array<{ public_id?: string; url?: string; secure_url?: string }> = [],
): ProductImage[] {
  return images
    .map((image) => ({
      public_id: image.public_id ?? "",
      url: image.url ?? image.secure_url ?? "",
    }))
    .filter((image) => image.public_id && image.url);
}
