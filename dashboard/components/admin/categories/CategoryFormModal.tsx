"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { Loader2, Tag, FileText, ImageIcon, Search, ToggleLeft } from "lucide-react";
import AdminModal from "@/components/admin/ui/AdminModal";
import type { Category, CategoryFormValues } from "@/types/category";
import { defaultCategoryFormValues } from "@/types/category";
import ImageUploadPreview from "./ImageUploadPreview";
import StatusToggle from "./StatusToggle";

type CategoryFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  category?: Category | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues, image: File | null) => Promise<void>;
};

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-primary)]";

const sectionHeadingClass =
  "mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]";

export default function CategoryFormModal({
  open,
  mode,
  category,
  isSubmitting = false,
  onClose,
  onSubmit,
}: CategoryFormModalProps) {
  const imageFileRef = useRef<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CategoryFormValues>({
    defaultValues: defaultCategoryFormValues,
  });

  const isActive = watch("isActive");

  useEffect(() => {
    if (!open) return;

    if (mode === "edit" && category) {
      reset({
        name: category.name,
        description: category.description,
        content: category.content ?? "",
        metaTitle: category.metaTitle,
        metaDescription: category.metaDescription,
        metaKeywords: category.metaKeywords,
        isActive: category.isActive,
      });
    } else {
      reset(defaultCategoryFormValues);
    }

    imageFileRef.current = null;
  }, [open, mode, category, reset]);

  return (
    <AdminModal
      open={open}
      title={mode === "create" ? "Add category" : "Edit category"}
      description={
        mode === "create"
          ? "Create a new product category with SEO details."
          : "Update category information and image."
      }
      onClose={onClose}
      size="lg"
    >
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values, imageFileRef.current);
        })}
        className="space-y-6"
      >
        {/* ── Basic info ── */}
        <div>
          <p className={sectionHeadingClass}>
            <Tag className="h-3.5 w-3.5" aria-hidden="true" />
            Basic info
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className={labelClass}>
                Category name
                <span className="ml-auto text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                type="text"
                placeholder="e.g. Cold-pressed Oils"
                className="admin-input"
                {...register("name", {
                  required: "Category name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <svg
                    className="h-3.5 w-3.5 shrink-0"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    aria-hidden="true"
                  >
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 5v3.5M8 10.5v.5" strokeLinecap="round" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                Description
                <span className="ml-auto text-[11px] font-normal text-[var(--text-muted)]">
                  Optional
                </span>
              </label>
              <textarea
                id="description"
                rows={3}
                placeholder="Briefly describe this category…"
                className="admin-input resize-none"
                {...register("description")}
              />
            </div>

            <div>
              <label htmlFor="content" className={labelClass}>
                <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                Page content (HTML)
                <span className="ml-auto text-[11px] font-normal text-[var(--text-muted)]">
                  Shown below the products
                </span>
              </label>
              <textarea
                id="content"
                rows={10}
                placeholder="Long-form SEO content for this category. Basic HTML is supported: <h2>, <h3>, <p>, <ul><li>, <a>…"
                className="admin-input resize-y font-mono text-[13px]"
                {...register("content")}
              />
            </div>
          </div>
        </div>

        {/* ── Image ── */}
        <div>
          <p className={sectionHeadingClass}>
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Category image
          </p>
          <ImageUploadPreview
            key={open ? (category?.id ?? "create") : "closed"}
            currentImageUrl={category?.image?.url}
            onChange={(file) => {
              imageFileRef.current = file;
            }}
            disabled={isSubmitting}
          />
        </div>

        {/* ── SEO ── */}
        <div>
          <p className={sectionHeadingClass}>
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            SEO metadata
          </p>

          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="metaTitle" className={labelClass}>
                  Meta title
                  <span className="ml-auto text-[11px] font-normal text-[var(--text-muted)]">
                    Optional
                  </span>
                </label>
                <input
                  id="metaTitle"
                  type="text"
                  placeholder="SEO page title"
                  className="admin-input"
                  {...register("metaTitle")}
                />
              </div>
              <div>
                <label htmlFor="metaKeywords" className={labelClass}>
                  Meta keywords
                  <span className="ml-auto text-[11px] font-normal text-[var(--text-muted)]">
                    Optional
                  </span>
                </label>
                <input
                  id="metaKeywords"
                  type="text"
                  placeholder="keyword1, keyword2"
                  className="admin-input"
                  {...register("metaKeywords")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="metaDescription" className={labelClass}>
                Meta description
                <span className="ml-auto text-[11px] font-normal text-[var(--text-muted)]">
                  Optional
                </span>
              </label>
              <textarea
                id="metaDescription"
                rows={2}
                placeholder="A short description for search results…"
                className="admin-input resize-none"
                {...register("metaDescription")}
              />
            </div>
          </div>
        </div>

        {/* ── Status ── */}
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <ToggleLeft className="h-4 w-4 shrink-0 text-[var(--text-muted)]" aria-hidden="true" />
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">
                  Active status
                </p>
                <p className="text-xs text-[var(--text-muted)]">
                  Inactive categories are hidden from the storefront.
                </p>
              </div>
            </div>
            <StatusToggle
              isActive={isActive}
              disabled={isSubmitting}
              onChange={(value) => setValue("isActive", value, { shouldDirty: true })}
            />
          </div>
        </div>

        {/* ── Footer actions ── */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="admin-btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary inline-flex min-w-[130px] items-center justify-center gap-2"
          >
            {isSubmitting && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {mode === "create" ? "Create category" : "Save changes"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
