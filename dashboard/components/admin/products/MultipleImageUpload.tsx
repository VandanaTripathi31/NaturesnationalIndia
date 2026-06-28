"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import type { ProductImage } from "@/types/product";

type PreviewItem = {
  id: string;
  url: string;
  file?: File;
  publicId?: string;
  isExisting?: boolean;
};

type MultipleImageUploadProps = {
  existingImages?: ProductImage[];
  onChange: (files: File[], removedPublicIds: string[]) => void;
  disabled?: boolean;
};

export default function MultipleImageUpload({
  existingImages = [],
  onChange,
  disabled = false,
}: MultipleImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const onChangeRef = useRef(onChange);
  const [previews, setPreviews] = useState<PreviewItem[]>([]);
  const [removedPublicIds, setRemovedPublicIds] = useState<string[]>([]);
  const resetKey = existingImages.map((image) => image.public_id).join("|");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setPreviews(
      existingImages.map((image) => ({
        id: image.public_id,
        url: image.url,
        publicId: image.public_id,
        isExisting: true,
      })),
    );
    setRemovedPublicIds([]);
  }, [resetKey, existingImages]);

  function notifyChange(nextPreviews: PreviewItem[], nextRemoved: string[]) {
    const files = nextPreviews
      .filter((item) => item.file)
      .map((item) => item.file!);
    onChangeRef.current(files, nextRemoved);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files ?? []);

    const newPreviews = selectedFiles.map((file) => ({
      id: `${file.name}-${file.lastModified}-${Math.random()}`,
      url: URL.createObjectURL(file),
      file,
    }));

    setPreviews((current) => {
      const next = [...current, ...newPreviews];
      notifyChange(next, removedPublicIds);
      return next;
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  function removePreview(item: PreviewItem) {
    if (item.file && item.url.startsWith("blob:")) {
      URL.revokeObjectURL(item.url);
    }

    const nextRemoved =
      item.isExisting && item.publicId
        ? [...removedPublicIds, item.publicId]
        : removedPublicIds;

    if (item.isExisting && item.publicId) {
      setRemovedPublicIds(nextRemoved);
    }

    setPreviews((current) => {
      const next = current.filter((preview) => preview.id !== item.id);
      notifyChange(next, nextRemoved);
      return next;
    });
  }

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        Product images
      </label>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {previews.map((preview) => (
          <div
            key={preview.id}
            className="relative aspect-square overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-muted)]"
          >
            <Image
              src={preview.url}
              alt="Product preview"
              fill
              className="object-cover"
              unoptimized={preview.url.startsWith("blob:")}
            />
            <button
              type="button"
              disabled={disabled}
              onClick={() => removePreview(preview)}
              className="absolute right-2 top-2 rounded-full bg-[#3e2b1e]/85 p-1 text-white"
              aria-label="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-[var(--border)] bg-[var(--surface-muted)] text-[var(--text-muted)] transition hover:border-[var(--brand-coffee-brown)] hover:text-[var(--brand-coffee-brown)]"
        >
          <ImagePlus className="h-6 w-6" />
          <span className="text-xs font-medium">Add images</span>
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        disabled={disabled}
        onChange={handleFileChange}
        className="hidden"
      />

      <p className="text-xs text-[var(--text-muted)]">
        Upload up to 10 images. PNG, JPG, or WEBP up to 5MB each.
      </p>
    </div>
  );
}
