export type CategoryImage = {
  public_id: string;
  url: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string;
  content: string;
  image: CategoryImage | null;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type CategoryListResponse = {
  categories: Category[];
  pagination: CategoryPagination;
};

export type CategoryFormValues = {
  name: string;
  description: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
  isActive: boolean;
};

export type CategoryQueryParams = {
  page?: number;
  limit?: number;
  search?: string;
  status?: "all" | "active" | "inactive";
};

export const defaultCategoryFormValues: CategoryFormValues = {
  name: "",
  description: "",
  content: "",
  metaTitle: "",
  metaDescription: "",
  metaKeywords: "",
  isActive: true,
};
