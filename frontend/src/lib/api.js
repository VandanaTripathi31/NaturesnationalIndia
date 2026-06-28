const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://naturesnationalindia.onrender.com";

async function handleResponse(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message ?? "Request failed");
  }

  return data;
}

export const publicApi = {
  getCategories() {
    return fetch(`${API_BASE_URL}/api/public/categories`).then(handleResponse);
  },

  getCategoryBySlug(slug, params = {}) {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", String(params.page));
    if (params.limit) searchParams.set("limit", String(params.limit));
    if (params.search) searchParams.set("search", params.search);
    const query = searchParams.toString();
    const path = query
      ? `/api/public/categories/${slug}?${query}`
      : `/api/public/categories/${slug}`;
    return fetch(`${API_BASE_URL}${path}`).then(handleResponse);
  },

  getProductBySlug(slug) {
    return fetch(`${API_BASE_URL}/api/public/products/${slug}`).then(
      handleResponse,
    );
  },

  getRelatedProducts(slug, limit = 8) {
    return fetch(
      `${API_BASE_URL}/api/public/products/${slug}/related?limit=${limit}`,
    ).then(handleResponse);
  },
};
