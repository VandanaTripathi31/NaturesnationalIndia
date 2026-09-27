import apiClient from "../lib/api-client";

export async function getBlogs({ page = 1, limit = 10, search = "", category = "", tag = "" } = {}) {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(limit));
  if (search) params.set("search", search);
  if (category) params.set("category", category);
  if (tag) params.set("tag", tag);

  const { data } = await apiClient.get(`/api/public/blogs?${params.toString()}`);
  return {
    blogs: data.blogs ?? [],
    pagination: data.pagination ?? { page, limit, total: 0, pages: 1 },
  };
}

export async function getBlogBySlug(slug) {
  const { data } = await apiClient.get(
    `/api/public/blogs/${encodeURIComponent(slug)}`,
  );
  return data.blog;
}

export async function getRelatedBlogs(slug, limit = 3) {
  const { data } = await apiClient.get(
    `/api/public/blogs/${encodeURIComponent(slug)}/related?limit=${limit}`,
  );
  return data.blogs ?? [];
}
