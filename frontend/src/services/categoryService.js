import { cache } from "react";
import apiClient from "../lib/api-client";

// Wrapped in React's request-scoped cache so the layout (Navbar/Footer) and
// the page (CategorySidebar) share a single "/api/public/categories" call per
// server render instead of duplicating the request. No behavior change.
export const getCategories = cache(async function getCategories() {
  const { data } = await apiClient.get("/api/public/categories");
  return data.categories ?? [];
});

export async function getCategoryBySlug(
  slug,
  { page = 1, limit = 12, search = "" } = {},
) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);

  const { data } = await apiClient.get(
    `/api/public/categories/${slug}?${params.toString()}`,
  );

  return data;
}
