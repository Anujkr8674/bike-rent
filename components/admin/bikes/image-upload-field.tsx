"use client";

import { useId, useRef } from "react";
import { ImagePlus, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ImageUploadFieldProps = {
  label: string;
  required?: boolean;
  multiple?: boolean;
  accept?: string;
  onFiles: (files: File[]) => void;
  className?: string;
};

export function ImageUploadField({
  label,
  required,
  multiple,
  accept = "image/*",
  onFiles,
  className,
}: ImageUploadFieldProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label htmlFor={inputId} className="text-sm font-semibold text-white">
          {label}
          {required ? <span className="ml-2 text-[10px] font-bold uppercase tracking-wider text-[#FF653F]">Required</span> : null}
        </label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="gap-2 border-[#FF653F]/30 bg-[#FF653F]/5 text-[#FF653F] hover:bg-[#FF653F]/10"
          onClick={() => inputRef.current?.click()}
        >
          {multiple ? <ImagePlus className="h-4 w-4" /> : <Upload className="h-4 w-4" />}
          {multiple ? "Add gallery images" : "Upload primary image"}
        </Button>
      </div>
      <input
        id={inputId}
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const list = event.target.files;
          if (!list?.length) return;
          onFiles(Array.from(list));
          event.target.value = "";
        }}
      />
      <p className="text-xs text-zinc-400">JPG, PNG or WebP. {multiple ? "You can select multiple files." : "One main photo for listings."}</p>
    </div>
  );
}

type ImagePreviewGridProps = {
  urls: { src: string; key: string; onRemove?: () => void }[];
};

export function ImagePreviewGrid({ urls }: ImagePreviewGridProps) {
  if (!urls.length) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {urls.map((item) => (
        <div key={item.key} className="group relative h-20 w-20 overflow-hidden rounded-xl border border-white/10 shadow-xl shadow-black/40">
          <img src={item.src} alt="" className="h-full w-full object-cover" />
          {item.onRemove ? (
            <button
              type="button"
              onClick={item.onRemove}
              className="absolute right-1 top-1 rounded-md bg-rose-500 p-0.5 text-white opacity-90 hover:opacity-100"
              aria-label="Remove image"
            >
              <X className="h-3 w-3" />
            </button>
          ) : null}
        </div>
      ))}
    </div>
  );
}
