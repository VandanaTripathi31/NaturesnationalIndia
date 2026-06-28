import { getCategories, getCategoryBySlug } from "@/services/categoryService";
import { getProductBySlug, getRelatedProducts } from "@/services/productService";

export const publicApi = {
  getCategories,
  getCategoryBySlug,
  getProductBySlug: async (slug) => ({ product: await getProductBySlug(slug) }),
  getRelatedProducts: async (slug, limit = 8) => ({
    products: await getRelatedProducts(slug, limit),
  }),
};

export { getCategories, getCategoryBySlug, getProductBySlug, getRelatedProducts };
