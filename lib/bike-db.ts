import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { BikeAdminFormValues } from "@/lib/admin-bike";
import {
  defaultBikeDocuments,
  defaultBikeFeatures,
  defaultBikeSeo,
  parseBikeDocuments,
  parseBikeFeatures,
  parseBikeSeo,
} from "@/lib/bike-json";
import { resolveBikeMediaUrl } from "@/lib/storage";

export async function resolveBrandCategoryIds(payload: Pick<BikeAdminFormValues, "brandId" | "categoryId">) {
  const [brand, category] = await Promise.all([
    db.bikeBrand.findUnique({ where: { id: payload.brandId } }),
    db.bikeCategory.findUnique({ where: { id: payload.categoryId } }),
  ]);

  if (!brand?.isActive) throw new Error("Selected brand is invalid.");
  if (!category?.isActive) throw new Error("Selected category is invalid.");

  return { brand, category };
}

export function bikeScalarDataFromPayload(
  payload: BikeAdminFormValues,
  brandName: string,
  categoryName: string,
  brandId: string,
  categoryId: string,
): Omit<Prisma.BikeUncheckedCreateInput, "cityId" | "imageUrl" | "gallery"> & { color?: string | null } {
  return {
    name: payload.name,
    slug: payload.slug,
    brandId,
    categoryId,
    brand: brandName,
    category: categoryName,
    shortDescription: payload.shortDescription.trim() || null,
    description: payload.description.trim() || null,
    cc: payload.cc,
    mileage: payload.mileage,
    modelYear: payload.modelYear ?? null,
    seatingPerson: payload.seatingPerson ?? null,
    topSpeed: payload.topSpeed ?? null,
    power: payload.power?.trim() || null,
    torque: payload.torque?.trim() || null,
    fuelTank: payload.fuelTank?.trim() || null,
    weight: payload.weight?.trim() || null,
    seatHeight: payload.seatHeight?.trim() || null,
    engineType: payload.engineType?.trim() || null,
    bikeNo: payload.bikeNo.trim() || null,
    color: payload.color?.trim() || null,
    fuelType: payload.fuelType,
    transmission: payload.transmission,
    hourlyCharge: payload.hourlyCharge ?? null,
    pricePerDay: payload.pricePerDay,
    securityDeposit: payload.securityDeposit,
    includedKmPerDay: payload.includedKmPerDay ?? null,
    extraKmCharge: payload.extraKmCharge ?? null,
    minimumBookingHours: payload.minimumBookingHours ?? null,
    maximumBookingDays: payload.maximumBookingDays ?? null,
    lateReturnCharge: payload.lateReturnCharge ?? null,
    features: payload.features,
    seo: payload.seo,
    documents: payload.documents,
    isAvailable: payload.isAvailable,
  };
}

export async function syncBikeImages(bikeId: string, galleryUrls: string[]) {
  const unique = Array.from(new Set(galleryUrls.filter(Boolean)));
  await db.bikeImage.deleteMany({ where: { bikeId } });
  if (!unique.length) return;
  await db.bikeImage.createMany({
    data: unique.map((imageUrl, index) => ({
      bikeId,
      imageUrl,
      sortOrder: index,
    })),
  });
}

export async function getBikeGalleryUrls(bikeId: string, fallbackGallery: string[], primaryUrl: string) {
  const rows = await db.bikeImage.findMany({
    where: { bikeId },
    orderBy: { sortOrder: "asc" },
  });
  if (rows.length) {
    return rows.map((row) => resolveBikeMediaUrl(row.imageUrl)).filter(Boolean);
  }
  const legacy = Array.from(new Set([primaryUrl, ...fallbackGallery].map(resolveBikeMediaUrl).filter(Boolean)));
  return legacy;
}

export function bikeRecordFromDb(
  bike: Prisma.BikeGetPayload<{ include: { city: true; content: true; brandRef: true; categoryRef: true; images: true } }>,
) {
  const galleryFromImages = bike.images
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((img) => resolveBikeMediaUrl(img.imageUrl))
    .filter(Boolean);

  const gallery = galleryFromImages.length
    ? galleryFromImages
    : bike.gallery.map(resolveBikeMediaUrl).filter(Boolean);

  const imageUrl = resolveBikeMediaUrl(bike.imageUrl) || gallery[0] || "";

  return {
    ...bike,
    imageUrl,
    gallery,
    features: parseBikeFeatures(bike.features),
    seo: parseBikeSeo(bike.seo),
    documents: parseBikeDocuments(bike.documents),
    brand: bike.brandRef?.name ?? bike.brand,
    category: bike.categoryRef?.name ?? bike.category,
    brandId: bike.brandId ?? bike.brandRef?.id ?? "",
    categoryId: bike.categoryId ?? bike.categoryRef?.id ?? "",
  };
}

export const bikeAdminInclude = {
  city: true,
  content: true,
  brandRef: true,
  categoryRef: true,
  images: { orderBy: { sortOrder: "asc" as const } },
} as const;
