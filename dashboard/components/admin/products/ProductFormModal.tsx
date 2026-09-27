"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Loader2, Package, FileText, Leaf, MapPin, Droplets,
  Sparkles, Wrench, ImageIcon, Search, ToggleLeft,
} from "lucide-react";
import AdminModal from "@/components/admin/ui/AdminModal";
import { normalizeProductImages } from "@/lib/product-images";
import type { Category } from "@/types/category";
import type { Product, ProductFormValues } from "@/types/product";
import { defaultProductFormValues } from "@/types/product";
import { categoryService } from "@/services/categoryService";
import MultipleImageUpload from "./MultipleImageUpload";
import StatusToggle from "@/components/admin/categories/StatusToggle";
import FeaturedToggle from "./FeaturedToggle";

type ProductFormModalProps = {
  open: boolean;
  mode: "create" | "edit";
  product?: Product | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductFormValues, images: File[], removedImageIds: string[]) => Promise<void>;
};

const labelClass =
  "mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-[var(--text-primary)]";

const sectionHeadingClass =
  "mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]";

const optionalBadge = (
  <span className="ml-auto text-[11px] font-normal text-[var(--text-muted)]">Optional</span>
);

export default function ProductFormModal({
  open,
  mode,
  product,
  isSubmitting = false,
  onClose,
  onSubmit,
}: ProductFormModalProps) {
  const imageFilesRef = useRef<File[]>([]);
  const removedImageIdsRef = useRef<string[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormValues>({ defaultValues: defaultProductFormValues });

  const isActive = watch("isActive");
  const featured = watch("featured");

  useEffect(() => {
    if (!open) return;
    categoryService
      .list({ limit: 100, status: "active" })
      .then((data) => setCategories(data.categories))
      .catch(() => setCategories([]));
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && product) {
      reset({
        name: product.name,
        description: product.description,
        botanicalName: product.botanicalName,
        origin: product.origin,
        extractionMethod: product.extractionMethod,
        benefits: product.benefits.join("\n"),
        uses: product.uses.join("\n"),
        featured: product.featured,
        category: product.category?.id ?? "",
        metaTitle: product.metaTitle,
        metaDescription: product.metaDescription,
        metaKeywords: product.metaKeywords,
        isActive: product.isActive,
      });
    } else {
      reset(defaultProductFormValues);
    }
    imageFilesRef.current = [];
    removedImageIdsRef.current = [];
  }, [open, mode, product, reset]);

  const handleImagesChange = useCallback((files: File[], removedIds: string[]) => {
    imageFilesRef.current = files;
    removedImageIdsRef.current = removedIds;
  }, []);

  const existingImages = mode === "edit" && product ? normalizeProductImages(product.images) : [];

  return (
    <AdminModal
      open={open}
      title={mode === "create" ? "Add product" : "Edit product"}
      description="Products must belong to an active category."
      onClose={onClose}
      size="xl"
    >
      <form
        onSubmit={handleSubmit(async (values) => {
          await onSubmit(values, imageFilesRef.current, removedImageIdsRef.current);
        })}
        className="space-y-6"
      >
        {/* ── Basic info ── */}
        <div>
          <p className={sectionHeadingClass}>
            <Package className="h-3.5 w-3.5" aria-hidden="true" />
            Basic info
          </p>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>
                Product name
                <span className="ml-auto text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                placeholder="e.g. Cold-Pressed Coconut Oil"
                className="admin-input"
                {...register("name", { required: "Product name is required" })}
              />
              {errors.name && (
                <p className="mt-1.5 flex items-center gap-1 text-xs text-red-600">
                  <svg className="h-3.5 w-3.5 shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                    <circle cx="8" cy="8" r="6.5" />
                    <path d="M8 5v3.5M8 10.5v.5" strokeLinecap="round" />
                  </svg>
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={labelClass}>
                  Category
                  <span className="ml-auto text-red-500" aria-hidden="true">*</span>
                </label>
                <div className="relative">
                  <select
                    className="admin-input w-full appearance-none pr-8"
                    style={{ backgroundImage: "none" }}
                    {...register("category", { required: "Category is required" })}
                  >
                    <option value="">Select category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                  <svg className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--text-muted)]"
                    viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="M4 6l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                {errors.category && (
                  <p className="mt-1.5 text-xs text-red-600">{errors.category.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>
                  <Leaf className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                  Botanical name
                  {optionalBadge}
                </label>
                <input placeholder="e.g. Cocos nucifera" className="admin-input" {...register("botanicalName")} />
              </div>
            </div>

            <div>
              <label className={labelClass}>
                <FileText className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                Description
                {optionalBadge}
              </label>
              <textarea rows={3} placeholder="Describe the product…" className="admin-input resize-none" {...register("description")} />
            </div>
          </div>
        </div>

        {/* ── Details ── */}
        <div>
          <p className={sectionHeadingClass}>
            <Droplets className="h-3.5 w-3.5" aria-hidden="true" />
            Product details
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={labelClass}>
                <MapPin className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                Origin
                {optionalBadge}
              </label>
              <input placeholder="e.g. Kerala, India" className="admin-input" {...register("origin")} />
            </div>
            <div>
              <label className={labelClass}>
                <Wrench className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                Extraction method
                {optionalBadge}
              </label>
              <input placeholder="e.g. Cold-pressed" className="admin-input" {...register("extractionMethod")} />
            </div>
            <div>
              <label className={labelClass}>
                <Sparkles className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                Benefits
                {optionalBadge}
              </label>
              <textarea rows={4} placeholder="One benefit per line" className="admin-input resize-none" {...register("benefits")} />
            </div>
            <div>
              <label className={labelClass}>
                <Wrench className="h-3.5 w-3.5 text-[var(--text-muted)]" aria-hidden="true" />
                Uses
                {optionalBadge}
              </label>
              <textarea rows={4} placeholder="One use per line" className="admin-input resize-none" {...register("uses")} />
            </div>
          </div>
        </div>

        {/* ── Images ── */}
        <div>
          <p className={sectionHeadingClass}>
            <ImageIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Product images
          </p>
          <MultipleImageUpload
            existingImages={existingImages}
            onChange={handleImagesChange}
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
                <label className={labelClass}>Meta title {optionalBadge}</label>
                <input placeholder="SEO page title" className="admin-input" {...register("metaTitle")} />
              </div>
              <div>
                <label className={labelClass}>Meta keywords {optionalBadge}</label>
                <input placeholder="keyword1, keyword2" className="admin-input" {...register("metaKeywords")} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Meta description {optionalBadge}</label>
              <textarea rows={2} placeholder="Short description for search results…" className="admin-input resize-none" {...register("metaDescription")} />
            </div>
          </div>
        </div>

        {/* ── Visibility ── */}
        <div>
          <p className={sectionHeadingClass}>
            <ToggleLeft className="h-3.5 w-3.5" aria-hidden="true" />
            Visibility
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5">
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">Featured</p>
                <p className="text-xs text-[var(--text-muted)]">Highlighted on storefront</p>
              </div>
              <FeaturedToggle
                featured={featured}
                disabled={isSubmitting}
                onChange={(value) => setValue("featured", value, { shouldDirty: true })}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] px-4 py-3.5">
              <div>
                <p className="text-[13px] font-medium text-[var(--text-primary)]">Active status</p>
                <p className="text-xs text-[var(--text-muted)]">Visible on public site</p>
              </div>
              <StatusToggle
                isActive={isActive}
                disabled={isSubmitting}
                onChange={(value) => setValue("isActive", value, { shouldDirty: true })}
              />
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-end gap-3 border-t border-[var(--border)] pt-4">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="admin-btn-secondary">
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="admin-btn-primary inline-flex min-w-[130px] items-center justify-center gap-2"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
            {mode === "create" ? "Create product" : "Save changes"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
}
