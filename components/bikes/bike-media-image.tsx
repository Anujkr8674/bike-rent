"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80";

function normalizeSrc(src: string) {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) return "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  return "";
}

type BikeMediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function BikeMediaImage({ src, alt, className, fill, priority }: BikeMediaImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? FALLBACK_IMAGE : normalizeSrc(src) || FALLBACK_IMAGE;

  if (fill) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={resolved}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onError={() => setFailed(true)}
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={resolved}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}

export function getBikeGallery(image: string, gallery?: string[]) {
  const urls = Array.from(new Set([...(gallery ?? []), image].map(normalizeSrc).filter(Boolean)));
  return urls.length ? urls : [FALLBACK_IMAGE];
}
