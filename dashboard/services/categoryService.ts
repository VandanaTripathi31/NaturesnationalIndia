import type {
  Category,
  CategoryFormValues,
  CategoryListResponse,
  CategoryQueryParams,
} from "@/types/category";

function buildQueryString(params: CategoryQueryParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildCategoryFormData(values: CategoryFormValues, image?: File | null) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("content", values.content ?? "");
  formData.append("metaTitle", values.metaTitle);
  formData.append("metaDescription", values.metaDescription);
  formData.append("metaKeywords", values.metaKeywords);
  formData.append("isActive", String(values.isActive));

  if (image) {
    formData.append("image", image);
  }

  return formData;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof data.message === "string"
        ? data.message
        : "Something went wrong",
    );
  }

  return data as T;
}

export const categoryService = {
  async list(params: CategoryQueryParams = {}) {
    const response = await fetch(
      `/api/categories${buildQueryString(params)}`,
      { method: "GET" },
    );

    return handleResponse<CategoryListResponse>(response);
  },

  async getById(id: string) {
    const response = await fetch(`/api/categories/${id}`, {
      method: "GET",
    });

    return handleResponse<{ category: Category }>(response);
  },

  async create(values: CategoryFormValues, image?: File | null) {
    const response = await fetch("/api/categories", {
      method: "POST",
      body: buildCategoryFormData(values, image),
    });

    return handleResponse<{ message: string; category: Category }>(response);
  },

  async update(
    id: string,
    values: CategoryFormValues,
    image?: File | null,
  ) {
    const response = await fetch(`/api/categories/${id}`, {
      method: "PUT",
      body: buildCategoryFormData(values, image),
    });

    return handleResponse<{ message: string; category: Category }>(response);
  },

  async updateStatus(id: string, isActive: boolean) {
    const response = await fetch(`/api/categories/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    return handleResponse<{ message: string; category: Category }>(response);
  },

  async remove(id: string) {
    const response = await fetch(`/api/categories/${id}`, {
      method: "DELETE",
    });

    return handleResponse<{ message: string }>(response);
  },
};
