import { NextResponse } from "next/server";
import { FuelType, Prisma, TransmissionType } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { bikeAdminFormSchema, normalizeBikeForm, slugifyText } from "@/lib/admin-bike";
import { buildBikeCreateData, rentalTermsContent, serializeAdminBike } from "@/lib/bike-api";
import { bikeAdminInclude, bikeRecordFromDb, syncBikeImages } from "@/lib/bike-db";
import { deleteStoragePaths, extractStoragePath, uploadBikeFile } from "@/lib/storage";
import { repairBikeMedia } from "@/lib/storage";

async function getOrCreateCityId(cityName: string) {
  const trimmed = cityName.trim() || "Ranchi";
  const slug = slugifyText(trimmed) || "ranchi";
  const city = await db.city.upsert({
    where: { slug },
    update: { name: trimmed, isActive: true },
    create: { name: trimmed, slug, isActive: true },
  });
  return city.id;
}

async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) return null;
  return session;
}

export async function GET(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim().toLowerCase() || "";
  const availability = url.searchParams.get("availability") || "all";
  const fuelType = url.searchParams.get("fuelType") || "all";
  const transmission = url.searchParams.get("transmission") || "all";
  const page = Math.max(1, parseInt(url.searchParams.get("page") || "1", 10));
  const limit = Math.max(1, parseInt(url.searchParams.get("limit") || "10", 10));
  const skip = (page - 1) * limit;

  const where: Prisma.BikeWhereInput = {};
  if (availability === "available") where.isAvailable = true;
  if (availability === "unavailable") where.isAvailable = false;
  if (fuelType !== "all") where.fuelType = fuelType as FuelType;
  if (transmission !== "all") where.transmission = transmission as TransmissionType;
  if (q) {
    const maybeYear = Number.parseInt(q, 10);
    where.OR = [
      { name: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { brand: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
      { bikeNo: { contains: q, mode: "insensitive" } },
      { city: { name: { contains: q, mode: "insensitive" } } },
      ...(Number.isFinite(maybeYear) ? [{ modelYear: maybeYear }] : []),
    ];
  }

  const { getBulkBikeAvailability } = await import("@/lib/availability");
  const [bikes, totalFiltered, availabilityStats, brands, categories, statuses] = await Promise.all([
    db.bike.findMany({ 
      where, 
      include: bikeAdminInclude, 
      orderBy: { updatedAt: "desc" },
      skip,
      take: limit,
    }),
    db.bike.count({ where }),
    db.bike.groupBy({
      by: ["isAvailable"],
      _count: { isAvailable: true },
    }),
    db.bikeBrand.count({ where: { isActive: true } }),
    db.bikeCategory.count({ where: { isActive: true } }),
    getBulkBikeAvailability(),
  ]);

  const available = availabilityStats.find(s => s.isAvailable)?._count.isAvailable || 0;
  const unavailable = availabilityStats.find(s => !s.isAvailable)?._count.isAvailable || 0;
  const total = available + unavailable;

  const serializedBikes = await Promise.all(
    bikes.map(async (bike) => {
      const record = bikeRecordFromDb(bike);
      const repaired = await repairBikeMedia(bike.id, record.imageUrl, record.gallery);
      const isAvailableObj = statuses[bike.id];
      return { ...record, imageUrl: repaired.imageUrl, gallery: repaired.gallery, isAvailableObj };
    }),
  );

  const totalPages = Math.ceil(totalFiltered / limit);

  return NextResponse.json({
    bikes: serializedBikes,
    stats: { total, available, unavailable, brands, categories },
    pagination: { page, limit, total: totalFiltered, totalPages }
  });
}

export async function POST(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const adminId = session.adminId;

  const formData = await req.formData();
  const payload = normalizeBikeForm(bikeAdminFormSchema.parse(JSON.parse(String(formData.get("payload") || "{}"))));

  const primaryImage = formData.get("primaryImage");
  if (!(primaryImage instanceof File) || primaryImage.size === 0) {
    return NextResponse.json({ message: "Primary image is required." }, { status: 400 });
  }

  const galleryFiles = formData
    .getAll("galleryImages")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  const cityId = await getOrCreateCityId(payload.cityName);
  const createData = await buildBikeCreateData(payload, cityId);

  const createdBike = await db.bike.create({ data: createData });
  const uploadedPaths: string[] = [];

  try {
    const primary = await uploadBikeFile(createdBike.id, primaryImage, primaryImage.name);
    uploadedPaths.push(primary.path);
    const galleryUrls: string[] = [];
    for (const file of galleryFiles) {
      const uploaded = await uploadBikeFile(createdBike.id, file, file.name);
      uploadedPaths.push(uploaded.path);
      galleryUrls.push(uploaded.url);
    }

    const allGallery = Array.from(new Set([primary.url, ...galleryUrls]));
    await db.bike.update({
      where: { id: createdBike.id },
      data: { imageUrl: primary.url, gallery: allGallery },
    });
    await syncBikeImages(createdBike.id, allGallery);

    await db.bikeContent.upsert({
      where: { bikeId: createdBike.id },
      update: rentalTermsContent(payload),
      create: { bikeId: createdBike.id, ...rentalTermsContent(payload) },
    });

    await db.activityLog.create({
      data: {
        adminId,
        action: "CREATE",
        entityType: "bike",
        entityId: createdBike.id,
        meta: { name: createdBike.name, slug: createdBike.slug },
      },
    }).catch(() => undefined);

    const bike = await serializeAdminBike(createdBike.id);
    return NextResponse.json({ success: true, bike });
  } catch (error) {
    await db.bike.delete({ where: { id: createdBike.id } }).catch(() => undefined);
    if (uploadedPaths.length) await deleteStoragePaths(uploadedPaths);
    const message = error instanceof Error ? error.message : "Failed to create bike.";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const adminId = session.adminId;

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Bike id required." }, { status: 400 });

  const bike = await db.bike.findUnique({ where: { id }, include: { images: true } });
  if (!bike) return NextResponse.json({ message: "Bike not found." }, { status: 404 });

  const storagePaths = [bike.imageUrl, ...bike.gallery, ...bike.images.map((img) => img.imageUrl)]
    .map((assetUrl) => extractStoragePath(assetUrl))
    .filter((path): path is string => Boolean(path));

  try {
    await db.bike.delete({ where: { id } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete bike.";
    return NextResponse.json({ message }, { status: 409 });
  }

  if (storagePaths.length) await deleteStoragePaths(storagePaths).catch(() => undefined);

  await db.activityLog.create({
    data: {
      adminId,
      action: "DELETE",
      entityType: "bike",
      entityId: bike.id,
      meta: { name: bike.name, slug: bike.slug },
    },
  }).catch(() => undefined);

  return NextResponse.json({ success: true });
}
