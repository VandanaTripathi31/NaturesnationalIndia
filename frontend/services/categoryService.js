import apiClient from "@/lib/api-client";

export async function getCategories() {
  const { data } = await apiClient.get("/api/public/categories");
  return data.categories ?? [];
}

export async function getCategoryBySlug(slug, { page = 1, limit = 12, search = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const { data } = await apiClient.get(
    `/api/public/categories/${slug}?${params.toString()}`,
  );

  return data;
}
