import { supabaseAdmin } from "@/lib/supabase-admin";

const storageBaseUrl = process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BASE_URL?.replace(/\/$/, "") ?? "";
const supabaseProjectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "") ?? "";

export const ADMIN_BIKE_BUCKET = "assets";

export function bikeStoragePath(bikeId: string, fileName: string) {
  return `admin/bike/${bikeId}/${fileName.replace(/^\/+/, "")}`;
}

function stripBucketPrefix(path: string) {
  const normalized = path.replace(/^\/+/, "");
  if (normalized.startsWith(`${ADMIN_BIKE_BUCKET}/`)) {
    return normalized.slice(ADMIN_BIKE_BUCKET.length + 1);
  }
  return normalized;
}

function publicStorageBase() {
  if (storageBaseUrl) return storageBaseUrl;
  if (supabaseProjectUrl) return `${supabaseProjectUrl}/storage/v1/object/public`;
  return "";
}

export function storagePublicUrl(objectPath: string) {
  const normalized = stripBucketPrefix(objectPath.replace(/^\/+/, ""));
  const base = publicStorageBase();
  if (!base) return `/${ADMIN_BIKE_BUCKET}/${normalized}`;

  const baseEndsWithBucket =
    base.endsWith(`/${ADMIN_BIKE_BUCKET}`) || base.endsWith(`/${ADMIN_BIKE_BUCKET}/`);
  if (baseEndsWithBucket) {
    return `${base.replace(/\/$/, "")}/${normalized}`;
  }
  return `${base}/${ADMIN_BIKE_BUCKET}/${normalized}`;
}

/** Fixes legacy or malformed bike image URLs before rendering. */
export function resolveBikeMediaUrl(url: string) {
  const trimmed = url?.trim() ?? "";
  if (!trimmed) return "";

  if (trimmed.startsWith("http")) {
    return trimmed
      .replace(`/public/${ADMIN_BIKE_BUCKET}/${ADMIN_BIKE_BUCKET}/`, `/public/${ADMIN_BIKE_BUCKET}/`)
      .replace(`/object/public/bike-images/`, `/object/public/${ADMIN_BIKE_BUCKET}/admin/bike/`)
      .replace(`/object/public/${ADMIN_BIKE_BUCKET}/${ADMIN_BIKE_BUCKET}/`, `/object/public/${ADMIN_BIKE_BUCKET}/`);
  }

  if (trimmed.startsWith("/assets/") || trimmed.startsWith("assets/")) {
    return storagePublicUrl(trimmed);
  }

  if (trimmed.startsWith("admin/bike/")) {
    return storagePublicUrl(trimmed);
  }

  return trimmed;
}

export function extractStoragePath(url: string) {
  const resolved = resolveBikeMediaUrl(url);
  const bucketMarker = `/${ADMIN_BIKE_BUCKET}/`;
  if (!resolved.includes(bucketMarker)) return null;
  const idx = resolved.indexOf(bucketMarker);
  return resolved.slice(idx + bucketMarker.length);
}

export function bookingDocumentPath(bookingId: string, fileName: string) {
  return `bookings/${bookingId}/${fileName.replace(/^\/+/, "")}`;
}

export async function uploadBookingDocument(bookingId: string, file: File | Blob, fileName: string) {
  const path = bookingDocumentPath(bookingId, fileName);
  const { error } = await supabaseAdmin.storage.from(ADMIN_BIKE_BUCKET).upload(path, file, {
    upsert: true,
    contentType: "type" in file ? file.type || undefined : undefined,
  });
  if (error) throw new Error(error.message);
  return { path, url: storagePublicUrl(path) };
}

export async function uploadBikeFile(bikeId: string, file: File | Blob, fileName: string) {
  const path = bikeStoragePath(bikeId, fileName);
  const { error } = await supabaseAdmin.storage.from(ADMIN_BIKE_BUCKET).upload(path, file, {
    upsert: true,
    contentType: "type" in file ? file.type || undefined : undefined,
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    path,
    url: storagePublicUrl(path),
  };
}

export async function deleteStoragePaths(paths: string[]) {
  const uniquePaths = Array.from(new Set(paths.filter(Boolean)));
  if (!uniquePaths.length) return;
  await supabaseAdmin.storage.from(ADMIN_BIKE_BUCKET).remove(uniquePaths);
}

function isBrokenBikeMediaUrl(url: string) {
  const resolved = resolveBikeMediaUrl(url);
  if (!resolved) return true;
  return (
    resolved.includes("/bike-images/") ||
    resolved.includes(`/public/${ADMIN_BIKE_BUCKET}/${ADMIN_BIKE_BUCKET}/`) ||
    !resolved.startsWith("http")
  );
}

/** When DB URLs are stale, rebuild from files under assets/admin/bike/{bikeId}/ */
export async function listBikeMediaUrls(bikeId: string) {
  const prefix = `admin/bike/${bikeId}`;
  const { data, error } = await supabaseAdmin.storage.from(ADMIN_BIKE_BUCKET).list(prefix, {
    limit: 100,
    sortBy: { column: "created_at", order: "asc" },
  });

  if (error || !data?.length) return [];

  return data
    .filter((file) => file.name && !file.name.endsWith("/"))
    .map((file) => storagePublicUrl(bikeStoragePath(bikeId, file.name)));
}

export async function repairBikeMedia(bikeId: string, imageUrl: string, gallery: string[]) {
  const resolvedGallery = gallery.map(resolveBikeMediaUrl).filter(Boolean);
  const resolvedPrimary = resolveBikeMediaUrl(imageUrl);

  if (resolvedPrimary && !isBrokenBikeMediaUrl(imageUrl)) {
    return {
      imageUrl: resolvedPrimary,
      gallery: Array.from(new Set(resolvedGallery.length ? resolvedGallery : [resolvedPrimary])),
    };
  }

  const storageUrls = await listBikeMediaUrls(bikeId);
  if (!storageUrls.length) {
    return {
      imageUrl: resolvedPrimary,
      gallery: resolvedGallery,
    };
  }

  return {
    imageUrl: storageUrls[0],
    gallery: storageUrls,
  };
}
