"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=1200&q=80";

function normalizeSrc(src: string) {
  const trimmed = src?.trim() ?? "";
  if (!trimmed) return "";
  
  let validUrl = "";
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://") || trimmed.startsWith("/")) {
    validUrl = trimmed;
  }
  
  if (!validUrl) return "";

  try {
    // Escape spaces and special characters so Next.js Image Optimization doesn't crash
    return encodeURI(decodeURI(validUrl));
  } catch {
    // If decode fails, just encode it
    return encodeURI(validUrl).replace(/%25/g, '%'); // prevent double encoding of already encoded chars if possible
  }
}

type BikeMediaImageProps = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
};

export function BikeMediaImage({ src, alt, className, fill, priority, sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" }: BikeMediaImageProps) {
  const [failed, setFailed] = useState(false);
  const resolved = failed ? FALLBACK_IMAGE : normalizeSrc(src) || FALLBACK_IMAGE;

  if (fill) {
    return (
      <Image
        src={resolved}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        sizes={sizes}
        onError={() => setFailed(true)}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <div className={cn("relative overflow-hidden", className)}>
      <Image
        src={resolved}
        alt={alt}
        fill
        unoptimized
        priority={priority}
        sizes={sizes}
        onError={() => setFailed(true)}
        className="object-cover"
      />
    </div>
  );
}

export function getBikeGallery(image: string, gallery?: string[]) {
  const urls = Array.from(new Set([...(gallery ?? []), image].map(normalizeSrc).filter(Boolean)));
  return urls.length ? urls : [FALLBACK_IMAGE];
}
