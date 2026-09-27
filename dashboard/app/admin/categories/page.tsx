"use client";

import { useCallback, useEffect, useState } from "react";
import { Plus, Tag, LayoutGrid } from "lucide-react";
import toast from "react-hot-toast";
import CategorySearch from "@/components/admin/categories/CategorySearch";
import CategoryTable from "@/components/admin/categories/CategoryTable";
import CategoryFormModal from "@/components/admin/categories/CategoryFormModal";
import DeleteCategoryModal from "@/components/admin/categories/DeleteCategoryModal";
import AdminPagination from "@/components/admin/ui/AdminPagination";
import { categoryService } from "@/services/categoryService";
import type {
  Category,
  CategoryFormValues,
  CategoryPagination,
} from "@/types/category";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [pagination, setPagination] = useState<CategoryPagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await categoryService.list({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery,
        status: statusFilter,
      });

      setCategories(data.categories);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to load categories",
      );
    } finally {
      setIsLoading(false);
    }
  }, [pagination.page, pagination.limit, searchQuery, statusFilter]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  function openCreateModal() {
    setFormMode("create");
    setSelectedCategory(null);
    setIsFormOpen(true);
  }

  function openEditModal(category: Category) {
    setFormMode("edit");
    setSelectedCategory(category);
    setIsFormOpen(true);
  }

  function openDeleteModal(category: Category) {
    setSelectedCategory(category);
    setIsDeleteOpen(true);
  }

  async function handleFormSubmit(values: CategoryFormValues, image: File | null) {
    setIsSubmitting(true);

    try {
      if (formMode === "create") {
        await categoryService.create(values, image);
        toast.success("Category created successfully");
      } else if (selectedCategory) {
        await categoryService.update(selectedCategory.id, values, image);
        toast.success("Category updated successfully");
      }

      setIsFormOpen(false);
      setSelectedCategory(null);

      if (formMode === "create" && pagination.page !== 1) {
        setPagination((current) => ({ ...current, page: 1 }));
      } else {
        await fetchCategories();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to save category",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!selectedCategory) return;

    setIsDeleting(true);

    try {
      await categoryService.remove(selectedCategory.id);
      toast.success("Category deleted successfully");
      setIsDeleteOpen(false);
      setSelectedCategory(null);

      if (categories.length === 1 && pagination.page > 1) {
        setPagination((current) => ({
          ...current,
          page: current.page - 1,
        }));
      } else {
        await fetchCategories();
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete category",
      );
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleToggleStatus(category: Category, isActive: boolean) {
    setTogglingId(category.id);

    try {
      await categoryService.updateStatus(category.id, isActive);
      toast.success(
        `Category ${isActive ? "activated" : "deactivated"} successfully`,
      );
      await fetchCategories();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setTogglingId(null);
    }
  }

  function handleSearchSubmit() {
    setSearchQuery(searchInput.trim());
    setPagination((current) => ({ ...current, page: 1 }));
  }

  return (
    <div className="space-y-6 px-1 pb-8 pt-1">
      {/* ── Page header ── */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3.5">
          {/* Icon mark */}
          <div
            className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl"
            style={{ background: "var(--gradient-primary)" }}
            aria-hidden="true"
          >
            <LayoutGrid className="h-5 w-5 text-white" />
          </div>

          <div>
            <h2 className="font-display text-2xl font-semibold text-[var(--text-primary)]">
              Categories
            </h2>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              Manage product categories, SEO metadata, and visibility.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="admin-btn-primary inline-flex shrink-0 items-center gap-2"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add category
        </button>
      </section>

      {/* ── Stats strip ── */}
      {!isLoading && pagination.total > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
            <Tag className="h-3.5 w-3.5 text-[var(--brand-leaf)]" aria-hidden="true" />
            {pagination.total} {pagination.total === 1 ? "category" : "categories"} total
          </span>
          {statusFilter !== "all" && (
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)]">
              Filtered:{" "}
              <span className="font-semibold text-[var(--text-primary)]">
                {statusFilter}
              </span>
            </span>
          )}
        </div>
      )}

      {/* ── Search / filter bar ── */}
      <section className="admin-card rounded-[1.25rem] px-5 py-4">
        <CategorySearch
          value={searchInput}
          status={statusFilter}
          onSearchChange={setSearchInput}
          onStatusChange={(status) => {
            setStatusFilter(status);
            setPagination((current) => ({ ...current, page: 1 }));
          }}
          onSubmit={handleSearchSubmit}
          isLoading={isLoading}
        />
      </section>

      {/* ── Table ── */}
      <CategoryTable
        categories={categories}
        isLoading={isLoading}
        togglingId={togglingId}
        onEdit={openEditModal}
        onDelete={openDeleteModal}
        onToggleStatus={handleToggleStatus}
      />

      {/* ── Pagination ── */}
      <AdminPagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        total={pagination.total}
        label="categories"
        isLoading={isLoading}
        onPrevious={() =>
          setPagination((current) => ({
            ...current,
            page: current.page - 1,
          }))
        }
        onNext={() =>
          setPagination((current) => ({
            ...current,
            page: current.page + 1,
          }))
        }
      />

      {/* ── Modals ── */}
      <CategoryFormModal
        open={isFormOpen}
        mode={formMode}
        category={selectedCategory}
        isSubmitting={isSubmitting}
        onClose={() => {
          setIsFormOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleFormSubmit}
      />

      <DeleteCategoryModal
        open={isDeleteOpen}
        category={selectedCategory}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedCategory(null);
        }}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
