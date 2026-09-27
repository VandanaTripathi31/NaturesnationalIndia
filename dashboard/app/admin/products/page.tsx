"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Package } from "lucide-react";
import toast from "react-hot-toast";
import ProductSearch from "@/components/admin/products/ProductSearch";
import ProductTable from "@/components/admin/products/ProductTable";
import ProductFormModal from "@/components/admin/products/ProductFormModal";
import DeleteProductModal from "@/components/admin/products/DeleteProductModal";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import { categoryService } from "@/services/categoryService";
import { productService } from "@/services/productService";
import type { Category } from "@/types/category";
import type { Product, ProductFormValues, ProductPagination } from "@/types/product";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<ProductPagination>({
    page: 1, limit: 10, total: 0, totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [featuringId, setFeaturingId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    categoryService
      .list({ limit: 100, status: "all" })
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, []);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await productService.list({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: statusFilter,
        category: categoryFilter || undefined,
      });
      setProducts(data.products);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, categoryFilter]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  async function handleFormSubmit(values: ProductFormValues, images: File[], removedImageIds: string[]) {
    setIsSubmitting(true);
    try {
      if (formMode === "create") {
        await productService.create(values, images);
        toast.success("Product created successfully");
      } else if (selectedProduct) {
        await productService.update(selectedProduct.id, values, images, removedImageIds);
        toast.success("Product updated successfully");
      }
      setIsFormOpen(false);
      setSelectedProduct(null);
      if (formMode === "create" && pagination.page !== 1) {
        setPagination((c) => ({ ...c, page: 1 }));
      } else {
        await fetchProducts();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!selectedProduct) return;
    setIsDeleting(true);
    try {
      await productService.remove(selectedProduct.id);
      toast.success("Product deleted successfully");
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      if (products.length === 1 && pagination.page > 1) {
        setPagination((c) => ({ ...c, page: c.page - 1 }));
      } else {
        await fetchProducts();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleStatus(product: Product, isActive: boolean) {
    setTogglingId(product.id);
    try {
      await productService.updateStatus(product.id, isActive);
      toast.success(`Product ${isActive ? "activated" : "deactivated"}`);
      await fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  }

  async function handleToggleFeatured(product: Product, featured: boolean) {
    setFeaturingId(product.id);
    try {
      await productService.updateFeatured(product.id, featured);
      toast.success(featured ? "Product marked as featured" : "Product unfeatured");
      await fetchProducts();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update featured status");
    } finally {
      setFeaturingId(null);
    }
  }

  return (
    <div className="space-y-6 px-1 pb-8 pt-1">
      {/* ── Page header ── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "var(--gradient-primary)" }}
            aria-hidden="true"
          >
            <Package className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Products
            </h2>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Manage catalog products linked to categories.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setFormMode("create"); setSelectedProduct(null); setIsFormOpen(true); }}
          className="admin-btn-primary inline-flex shrink-0 items-center gap-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add product
        </button>
      </section>

      {/* ── Stats strip ── */}
      {!isLoading && pagination.total > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Package className="h-3.5 w-3.5 text-[var(--brand-leaf)]" aria-hidden="true" />
            {pagination.total} {pagination.total === 1 ? "product" : "products"} total
          </span>
          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
              Filtered: <span className="font-semibold text-[var(--text-primary)]">{statusFilter}</span>
            </span>
          )}
          {categoryFilter && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
              Category: <span className="font-semibold text-[var(--text-primary)]">{categories.find((c) => c.id === categoryFilter)?.name ?? categoryFilter}</span>
            </span>
          )}
        </div>
      )}

      {/* ── Search / filter bar ── */}
      <section className="admin-card rounded-[1.25rem] px-5 py-4">
        <ProductSearch
          value={searchInput}
          status={statusFilter}
          categoryId={categoryFilter}
          categories={categories}
          onSearchChange={setSearchInput}
          onStatusChange={(status) => { setStatusFilter(status); setPagination((c) => ({ ...c, page: 1 })); }}
          onCategoryChange={(categoryId) => { setCategoryFilter(categoryId); setPagination((c) => ({ ...c, page: 1 })); }}
          onSubmit={() => { setSearchQuery(searchInput.trim()); setPagination((c) => ({ ...c, page: 1 })); }}
          isLoading={isLoading}
        />
      </section>

      {/* ── Table ── */}
      <ProductTable
        products={products}
        isLoading={isLoading}
        togglingId={togglingId}
        featuringId={featuringId}
        onEdit={(product) => { setFormMode("edit"); setSelectedProduct(product); setIsFormOpen(true); }}
        onDelete={(product) => { setSelectedProduct(product); setIsDeleteOpen(true); }}
        onToggleStatus={handleToggleStatus}
        onToggleFeatured={handleToggleFeatured}
      />

      <AdminPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        label="products"
        isLoading={isLoading}
        onPrevious={() => setPagination((c) => ({ ...c, page: c.page - 1 }))}
        onNext={() => setPagination((c) => ({ ...c, page: c.page + 1 }))}
      />

      <ProductFormModal
        open={isFormOpen}
        mode={formMode}
        product={selectedProduct}
        isSubmitting={isSubmitting}
        onClose={() => { setIsFormOpen(false); setSelectedProduct(null); }}
        onSubmit={handleFormSubmit}
      />

      <DeleteProductModal
        open={isDeleteOpen}
        product={selectedProduct}
        isDeleting={isDeleting}
        onClose={() => { setIsDeleteOpen(false); setSelectedProduct(null); }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
