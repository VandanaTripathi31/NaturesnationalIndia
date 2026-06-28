import apiClient from "@/lib/api-client";

export async function getProductBySlug(slug) {
  const { data } = await apiClient.get(`/api/public/products/${slug}`);
  return data.product;
}

export async function getRelatedProducts(slug, limit = 8) {
  const { data } = await apiClient.get(
    `/api/public/products/${slug}/related?limit=${limit}`,
  );
  return data.products ?? [];
}

export async function getProductsByCategorySlug(slug, options = {}) {
  const result = await import("@/services/categoryService").then((mod) =>
    mod.getCategoryBySlug(slug, options),
  );
  return result;
}
