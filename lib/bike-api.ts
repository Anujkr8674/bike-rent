import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import type { BikeAdminFormValues } from "@/lib/admin-bike";
import { contentPayloadFromValues, richTextToJson, slugifyText } from "@/lib/admin-bike";
import {
  bikeAdminInclude,
  bikeRecordFromDb,
  bikeScalarDataFromPayload,
  resolveBrandCategoryIds,
  syncBikeImages,
} from "@/lib/bike-db";
import { repairBikeMedia } from "@/lib/storage";

export async function serializeAdminBike(bikeId: string) {
  const bike = await db.bike.findUnique({
    where: { id: bikeId },
    include: bikeAdminInclude,
  });
  if (!bike) return null;
  const record = bikeRecordFromDb(bike);
  const repaired = await repairBikeMedia(bike.id, record.imageUrl, record.gallery);
  return { ...record, imageUrl: repaired.imageUrl, gallery: repaired.gallery };
}

export const getCachedAdminBike = unstable_cache(
  async (bikeId: string) => {
    return await serializeAdminBike(bikeId);
  },
  ["admin-bike-details"],
  { tags: ["bikes", "bike-details"], revalidate: 3600 }
);

export async function buildBikeCreateData(payload: BikeAdminFormValues, cityId: string) {
  const { brand, category } = await resolveBrandCategoryIds(payload);
  return {
    ...bikeScalarDataFromPayload(payload, brand.name, category.name, brand.id, category.id),
    cityId,
    imageUrl: "",
    gallery: [] as string[],
  };
}

export function rentalTermsContent(payload: BikeAdminFormValues) {
  const content = contentPayloadFromValues(payload);
  const rentalTerms = content.rentalTerms ? richTextToJson(content.rentalTerms) : null;
  return {
    rentalTerms: rentalTerms ?? Prisma.DbNull,
  };
}

export async function applyGalleryUpdate(
  bikeId: string,
  imageUrl: string,
  gallery: string[],
) {
  await syncBikeImages(bikeId, gallery);
  return { imageUrl, gallery };
}

export { slugifyText };
