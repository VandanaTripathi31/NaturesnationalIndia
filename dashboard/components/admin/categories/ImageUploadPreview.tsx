"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

type ImageUploadPreviewProps = {
  currentImageUrl?: string | null;
  onChange: (file: File | null) => void;
  disabled?: boolean;
};

export default function ImageUploadPreview({
  currentImageUrl,
  onChange,
  disabled = false,
}: ImageUploadPreviewProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    if (!file) {
      setPreviewUrl(null);
      onChange(null);
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    onChange(file);
  }

  function clearSelection() {
    if (inputRef.current) {
      inputRef.current.value = "";
    }

    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl(null);
    onChange(null);
  }

  const displayUrl = previewUrl ?? currentImageUrl ?? null;

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">
        Category image
      </label>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="relative flex h-32 w-32 items-center justify-center overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50">
          {displayUrl ? (
            <Image
              src={displayUrl}
              alt="Category preview"
              fill
              className="object-cover"
              unoptimized={displayUrl.startsWith("blob:")}
            />
          ) : (
            <ImagePlus className="h-8 w-8 text-slate-400" aria-hidden="true" />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            disabled={disabled}
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-emerald-700 hover:file:bg-emerald-100"
          />
          <p className="text-xs text-slate-500">
            PNG, JPG, or WEBP up to 5MB. Leave empty to keep the current image.
          </p>
          {(previewUrl || currentImageUrl) && (
            <button
              type="button"
              onClick={clearSelection}
              disabled={disabled}
              className="inline-flex w-fit items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              Remove selected image
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
