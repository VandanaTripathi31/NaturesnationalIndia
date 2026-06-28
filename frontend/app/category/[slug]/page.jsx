import { Suspense } from "react";
import { notFound } from "next/navigation";
import CategoryPageView from "@/components/catalog/CategoryPageView";
import { CategoryPageSkeleton } from "@/components/ui/CatalogSkeletons";
import { getCategories, getCategoryBySlug } from "@/services/categoryService";

export async function generateMetadata({ params, searchParams }) {
  const { slug } = await params;

  try {
    const data = await getCategoryBySlug(slug, { page: 1, limit: 1 });
    const category = data.category;

    return {
      title: category.metaTitle || category.name,
      description: category.metaDescription || category.description,
      keywords: category.metaKeywords?.split(",").map((item) => item.trim()),
    };
  } catch {
    return { title: "Category" };
  }
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const query = await searchParams;
  const page = Number(query.page || 1);
  const search = typeof query.search === "string" ? query.search : "";

  let categories = [];
  let data;

  try {
    [categories, data] = await Promise.all([
      getCategories(),
      getCategoryBySlug(slug, { page, limit: 12, search }),
    ]);
  } catch {
    notFound();
  }

  const featuredProducts = (data.products ?? []).filter((product) => product.featured).slice(0, 4);

  return (
    <Suspense fallback={<CategoryPageSkeleton />}>
      <CategoryPageView
        category={data.category}
        products={data.products ?? []}
        pagination={data.pagination}
        categories={categories}
        featuredProducts={featuredProducts}
        searchQuery={search}
      />
    </Suspense>
  );
}
