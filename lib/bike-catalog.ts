import type { Bike, City } from "@prisma/client";
import type { BikeItem } from "@/lib/bikes";
import { ranchiBikes } from "@/lib/bikes";
import { db } from "@/lib/db";
import { richTextFromJson } from "@/lib/admin-bike";
import { bikeAdminInclude, bikeRecordFromDb } from "@/lib/bike-db";
import type { BikeFeatures } from "@/lib/bike-json";
import { parseBikeFeatures } from "@/lib/bike-json";
import { repairBikeMedia } from "@/lib/storage";

export type CatalogBike = Bike & {
  city: City | null;
  content?: { rentalTerms?: unknown } | null;
  color?: string | null;
  categoryRef?: { name: string } | null;
};

export type BikeDetailItem = BikeItem & {
  dbId: string;
  bikeNo?: string;
  modelYear?: number;
  power?: string;
  torque?: string;
  fuelTank?: string;
  weight?: string;
  seatHeight?: string;
  engineType?: string;
  extraKmCharge?: number;
  shortDescription?: string;
  descriptionHtml?: string;
  rentalTermsHtml?: string;
  features: BikeFeatures;
  seatingPerson?: number;
  topSpeed?: number;
  includedKmPerDay?: number;
  minimumBookingHours?: number;
  securityDepositAmount: number;
};

function inferCategory(cc: number, transmission: string, stored?: string | null): string {
  const normalized = stored?.trim();
  if (normalized) return normalized;
  if (cc <= 125 && transmission === "AUTOMATIC") return "Scooter";
  if (cc >= 300) return "Cruiser";
  if (cc >= 180) return "Sports";
  return "Commuter";
}

export async function mapDbBikeToBikeItem(bike: CatalogBike): Promise<BikeDetailItem> {
  const repaired = await repairBikeMedia(bike.id, bike.imageUrl, bike.gallery);
  const gallery = Array.from(new Set(repaired.gallery.filter(Boolean)));
  const image = repaired.imageUrl || gallery[0] || "";

  return {
    id: bike.slug,
    dbId: bike.id,
    bikeNo: bike.bikeNo ?? undefined,
    modelYear: bike.modelYear ?? undefined,
    power: bike.power ?? undefined,
    torque: bike.torque ?? undefined,
    fuelTank: bike.fuelTank ?? undefined,
    weight: bike.weight ?? undefined,
    seatHeight: bike.seatHeight ?? undefined,
    engineType: bike.engineType ?? undefined,
    extraKmCharge: bike.extraKmCharge ? Number(bike.extraKmCharge) : undefined,
    name: bike.name,
    brand: bike.brand,
    cc: bike.cc,
    mileage: bike.mileage,
    color: bike.color ?? undefined,
    fuelType: bike.fuelType === "ELECTRIC" ? "Electric" : "Petrol",
    transmission: bike.transmission === "AUTOMATIC" ? "Automatic" : "Manual",
    rating: 4.6,
    pricePerDay: Number(bike.pricePerDay),
    pricePerHour: bike.hourlyCharge ? Number(bike.hourlyCharge) : Math.max(75, Math.round(Number(bike.pricePerDay) / 8)),
    image,
    gallery: gallery.length ? gallery : image ? [image] : [],
    city: (bike.city?.name as "Ranchi") ?? "Ranchi",
    category: inferCategory(bike.cc, bike.transmission, bike.categoryRef?.name ?? bike.category),
    shortDescription: bike.shortDescription ?? undefined,
    descriptionHtml: bike.description ?? undefined,
    rentalTermsHtml: richTextFromJson(bike.content?.rentalTerms),
    features: parseBikeFeatures(bike.features),
    seatingPerson: bike.seatingPerson ?? undefined,
    topSpeed: bike.topSpeed ?? undefined,
    includedKmPerDay: bike.includedKmPerDay ?? undefined,
    minimumBookingHours: bike.minimumBookingHours ?? undefined,
    securityDepositAmount: Number(bike.securityDeposit),
  };
}

export async function serializeAdminBikeImages<T extends { id: string; imageUrl: string; gallery: string[] }>(
  bike: T,
) {
  const repaired = await repairBikeMedia(bike.id, bike.imageUrl, bike.gallery);
  return { ...bike, imageUrl: repaired.imageUrl, gallery: repaired.gallery };
}

import { checkBikeAvailability, getBikeCurrentStatus, getBulkBikeAvailability } from "@/lib/availability";

let cachedStaticBikes: BikeDetailItem[] | null = null;
let lastStaticCacheTime = 0;
const CACHE_TTL = 60000; // 1 minute
let isFetchingStaticBikes = false;

async function fetchStaticBikes() {
  try {
    const bikes = await db.bike.findMany({
      where: { isAvailable: true },
      include: { city: true, content: true, categoryRef: true },
      orderBy: { updatedAt: "desc" },
    });
    
    const mappedPromises = bikes.map(async (bike) => {
      try {
        return await mapDbBikeToBikeItem(bike);
      } catch {
        return null;
      }
    });
    
    cachedStaticBikes = (await Promise.all(mappedPromises)).filter(Boolean) as BikeDetailItem[];
    lastStaticCacheTime = Date.now();
  } catch {
    // keep old cache on failure
  } finally {
    isFetchingStaticBikes = false;
  }
}

export async function getCatalogBikes(targetPickup?: Date, targetReturn?: Date) {
  try {
    const needsRefresh = !cachedStaticBikes || Date.now() - lastStaticCacheTime > CACHE_TTL;
    
    if (needsRefresh && !isFetchingStaticBikes) {
      isFetchingStaticBikes = true;
      if (!cachedStaticBikes) {
        await fetchStaticBikes();
      } else {
        // Run in background so we don't block the request (Stale-while-revalidate)
        fetchStaticBikes();
      }
    }

    const staticBikes = cachedStaticBikes;
    if (!staticBikes) return ranchiBikes;

    const bulkAvailability = await getBulkBikeAvailability();

    const finalMappedPromises = staticBikes.map(async (item) => {
      try {
        let availability;
        if (targetPickup && targetReturn) {
           availability = await checkBikeAvailability(item.dbId, targetPickup, targetReturn);
           if (!availability.isAvailable) return null;
        }
        
        const currentStatus = bulkAvailability[item.dbId] || await getBikeCurrentStatus(item.dbId);
        
        const safeStatus = {
          isAvailable: currentStatus.isAvailable,
          availabilityStatus: currentStatus.availabilityStatus,
          nextAvailableAt: currentStatus.nextAvailableAt,
          bufferMinutes: currentStatus.bufferMinutes,
          availabilityMessage: currentStatus.availabilityMessage,
        };
        
        return {
           ...item,
           isAvailableObj: safeStatus
        };
      } catch {
        return null;
      }
    });

    const mapped = (await Promise.all(finalMappedPromises)).filter(Boolean) as (BikeDetailItem & { isAvailableObj?: any })[];
    
    if (mapped.length) return mapped;
  } catch {
    // fall through when DB unavailable
  }
  return ranchiBikes;
}

export async function getCatalogBikeBySlug(slug: string): Promise<BikeDetailItem & { isAvailableObj?: any } | null> {
  try {
    const bike = await db.bike.findFirst({
      where: { slug, isAvailable: true },
      include: { city: true, content: true, categoryRef: true },
    });
    if (bike) {
      const item = await mapDbBikeToBikeItem(bike);
      const currentStatus = await getBikeCurrentStatus(bike.id);
      
      const safeStatus = {
        isAvailable: currentStatus.isAvailable,
        availabilityStatus: currentStatus.availabilityStatus,
        nextAvailableAt: currentStatus.nextAvailableAt,
        bufferMinutes: currentStatus.bufferMinutes,
        availabilityMessage: currentStatus.availabilityMessage,
      };

      return { ...item, isAvailableObj: safeStatus };
    }
  } catch {
    // fall through
  }

  const fallback = ranchiBikes.find((item) => item.id === slug);
  if (!fallback) return null;

  return {
    ...fallback,
    dbId: fallback.id,
    gallery: fallback.gallery?.length ? fallback.gallery : [fallback.image],
    features: parseBikeFeatures(null),
    securityDepositAmount: 2000,
    isAvailableObj: {
      isAvailable: true,
      availabilityStatus: "AVAILABLE",
      availabilityMessage: "Available Now"
    }
  };
}

let cachedCategories: { id: string; name: string; slug: string; imageUrl: string | null }[] | null = null;
let lastCategoryCacheTime = 0;
let isFetchingCategories = false;

export async function getCachedCategories() {
  const needsRefresh = !cachedCategories || Date.now() - lastCategoryCacheTime > CACHE_TTL;

  if (needsRefresh && !isFetchingCategories) {
    isFetchingCategories = true;
    const fetchCats = async () => {
      try {
        cachedCategories = await db.bikeCategory.findMany({
          where: { isActive: true },
          orderBy: { name: "asc" },
          select: { id: true, name: true, slug: true, imageUrl: true },
        });
        lastCategoryCacheTime = Date.now();
      } catch {
        // Keep old cache
      } finally {
        isFetchingCategories = false;
      }
    };

    if (!cachedCategories) {
      await fetchCats();
    } else {
      fetchCats(); // run in background
    }
  }

  if (cachedCategories && cachedCategories.length > 0) {
    return cachedCategories;
  }

  return [
    { id: "sports", name: "Sports", slug: "sports", imageUrl: null },
    { id: "cruiser", name: "Cruiser", slug: "cruiser", imageUrl: null },
    { id: "scooter", name: "Scooter", slug: "scooter", imageUrl: null },
    { id: "commuter", name: "Commuter", slug: "commuter", imageUrl: null },
  ];
}
