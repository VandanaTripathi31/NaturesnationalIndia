import { normalizeProductImages } from "@/lib/product-images";
import type {
  Product,
  ProductFormValues,
  ProductListResponse,
  ProductQueryParams,
} from "@/types/product";

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    images: normalizeProductImages(product.images),
  };
}

function buildQueryString(params: ProductQueryParams = {}) {
  const searchParams = new URLSearchParams();

  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.search) searchParams.set("search", params.search);
  if (params.status) searchParams.set("status", params.status);
  if (params.category) searchParams.set("category", params.category);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function buildProductFormData(
  values: ProductFormValues,
  images: File[] = [],
  removedImageIds: string[] = [],
) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("description", values.description);
  formData.append("botanicalName", values.botanicalName);
  formData.append("origin", values.origin);
  formData.append("extractionMethod", values.extractionMethod);
  formData.append("benefits", values.benefits);
  formData.append("uses", values.uses);
  formData.append("featured", String(values.featured));
  formData.append("category", values.category);
  formData.append("metaTitle", values.metaTitle);
  formData.append("metaDescription", values.metaDescription);
  formData.append("metaKeywords", values.metaKeywords);
  formData.append("isActive", String(values.isActive));

  if (removedImageIds.length) {
    formData.append("removedImageIds", JSON.stringify(removedImageIds));
  }

  images.forEach((image) => {
    formData.append("images", image);
  });

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

export const productService = {
  async list(params: ProductQueryParams = {}) {
    const response = await fetch(`/api/products${buildQueryString(params)}`);
    const data = await handleResponse<ProductListResponse>(response);
    return {
      ...data,
      products: data.products.map(normalizeProduct),
    };
  },

  async getById(id: string) {
    const response = await fetch(`/api/products/${id}`);
    const data = await handleResponse<{ product: Product }>(response);
    return { product: normalizeProduct(data.product) };
  },

  async getRelated(id: string, limit = 8) {
    const response = await fetch(`/api/products/${id}/related?limit=${limit}`);
    const data = await handleResponse<{ products: Product[] }>(response);
    return { products: data.products.map(normalizeProduct) };
  },

  async create(values: ProductFormValues, images: File[] = []) {
    const response = await fetch("/api/products", {
      method: "POST",
      body: buildProductFormData(values, images),
    });

    return handleResponse<{ message: string; product: Product }>(response);
  },

  async update(
    id: string,
    values: ProductFormValues,
    images: File[] = [],
    removedImageIds: string[] = [],
  ) {
    const response = await fetch(`/api/products/${id}`, {
      method: "PUT",
      body: buildProductFormData(values, images, removedImageIds),
    });

    return handleResponse<{ message: string; product: Product }>(response);
  },

  async updateStatus(id: string, isActive: boolean) {
    const response = await fetch(`/api/products/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive }),
    });

    return handleResponse<{ message: string; product: Product }>(response);
  },

  async updateFeatured(id: string, featured: boolean) {
    const response = await fetch(`/api/products/${id}/featured`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured }),
    });

    return handleResponse<{ message: string; product: Product }>(response);
  },

  async remove(id: string) {
    const response = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    });

    return handleResponse<{ message: string }>(response);
  },
};
