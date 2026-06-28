import { notFound } from "next/navigation";
import ProductPageView from "@/components/catalog/ProductPageView";
import { getCategories, getCategoryBySlug } from "@/services/categoryService";
import { getProductBySlug, getRelatedProducts } from "@/services/productService";

export async function generateMetadata({ params }) {
  const { slug } = await params;

  try {
    const product = await getProductBySlug(slug);

    return {
      title: product.metaTitle || product.name,
      description: product.metaDescription || product.description,
      keywords: product.metaKeywords?.split(",").map((item) => item.trim()),
    };
  } catch {
    return { title: "Product" };
  }
}

export default async function ProductPage({ params }) {
  const { slug } = await params;

  let product;
  let relatedProducts = [];
  let categories = [];
  let featuredProducts = [];

  try {
    [product, relatedProducts, categories] = await Promise.all([
      getProductBySlug(slug),
      getRelatedProducts(slug),
      getCategories(),
    ]);

    if (product.category?.slug) {
      const categoryData = await getCategoryBySlug(product.category.slug, {
        page: 1,
        limit: 20,
      });
      featuredProducts = (categoryData.products ?? [])
        .filter((item) => item.featured && item.id !== product.id)
        .slice(0, 4);
    }
  } catch {
    notFound();
  }

  return (
    <ProductPageView
      product={product}
      relatedProducts={relatedProducts}
      categories={categories}
      featuredProducts={featuredProducts}
    />
  );
}
