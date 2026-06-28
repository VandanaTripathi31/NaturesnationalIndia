export type ProductImage = {
  public_id: string;
  url: string;
};

export type ProductCategoryRef = {
  id: string;
  name: string;
  slug: string;
  image?: ProductImage | null;
  isActive?: boolean;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  botanicalName: string;
  origin: string;
  extractionMethod: string;
  benefits: string[];
  uses: string[];
  featured: boolean;
  category: ProductCategoryRef | null;
  images: ProductImage[];
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProductPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type ProductListResponse = {
  products: Product[];
  pagination: ProductPagination;
};

export type ProductFormValues = {
  name: string;
  description: string;
  botanicalName: string;
  origin: string;
  extractionMethod: string;
  benefits: string;
  uses: string;
  featured: boolean;
  category: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
};

export type ProductQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
  category?: string;
};

export const defaultProductFormValues: ProductFormValues = {
  name: "",
  description: "",
  botanicalName: "",
  origin: "",
  extractionMethod: "",
  benefits: "",
  uses: "",
  featured: false,
  category: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  isActive: true,
};
