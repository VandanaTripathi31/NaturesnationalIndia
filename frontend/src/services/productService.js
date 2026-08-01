import apiClient from "../lib/api-client";

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

export async function searchProducts(query, { limit = 8, signal } = {}) {
  const params = new URLSearchParams();
  params.set("q", query);
  params.set("limit", String(limit));

  const { data } = await apiClient.get(
    `/api/public/search?${params.toString()}`,
    { signal },
  );
  return data.products ?? [];
}

export async function getProductsByCategorySlug(slug, options = {}) {
  const result = await import("../services/categoryService").then((mod) =>
    mod.getCategoryBySlug(slug, options),
  );
  return result;
}
