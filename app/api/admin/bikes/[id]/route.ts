import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { bikeAdminFormSchema, coerceBoolean, normalizeBikeForm, slugifyText } from "@/lib/admin-bike";
import { rentalTermsContent, serializeAdminBike } from "@/lib/bike-api";
import { bikeAdminInclude, bikeScalarDataFromPayload, resolveBrandCategoryIds, syncBikeImages } from "@/lib/bike-db";
import { revalidateTag } from "next/cache";
import { deleteStoragePaths, extractStoragePath, uploadBikeFile } from "@/lib/storage";

async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) return null;
  return session;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const { id } = await params;

  const { getCachedAdminBike } = await import("@/lib/bike-api");
  const bike = await getCachedAdminBike(id);
  if (!bike) return NextResponse.json({ message: "Bike not found." }, { status: 404 });

  return NextResponse.json({ bike });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const adminId = session.adminId;
  const { id } = await params;

  const existing = await db.bike.findUnique({ where: { id }, include: bikeAdminInclude });
  if (!existing) return NextResponse.json({ message: "Bike not found." }, { status: 404 });

  const formData = await req.formData();

  let payload: ReturnType<typeof normalizeBikeForm>;
  try {
    payload = normalizeBikeForm(bikeAdminFormSchema.parse(JSON.parse(String(formData.get("payload") || "{}"))));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid bike form data.";
    return NextResponse.json({ message }, { status: 400 });
  }

  const galleryFiles = formData
    .getAll("galleryImages")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);
  const primaryImage = formData.get("primaryImage");

  const removeGalleryUrls = (JSON.parse(String(formData.get("removeGalleryUrls") || "[]")) as unknown[]).map(String);
  const removePrimary = coerceBoolean(JSON.parse(String(formData.get("removePrimaryImage") || "false")), false);

  let imageUrl = removePrimary ? "" : existing.imageUrl;
  let gallery = existing.gallery.filter((url) => !removeGalleryUrls.includes(url));
  const storageDeleteTargets = removeGalleryUrls
    .map((url) => extractStoragePath(url))
    .filter((path): path is string => Boolean(path));

  if (removePrimary && existing.imageUrl) {
    gallery = gallery.filter((url) => url !== existing.imageUrl);
    const primaryPath = extractStoragePath(existing.imageUrl);
    if (primaryPath) storageDeleteTargets.push(primaryPath);
  }

  const citySlug = slugifyText(payload.cityName) || "ranchi";
  const city = await db.city.upsert({
    where: { slug: citySlug },
    update: { name: payload.cityName, isActive: true },
    create: { name: payload.cityName, slug: citySlug, isActive: true },
  });

  if (primaryImage instanceof File && primaryImage.size > 0) {
    const uploaded = await uploadBikeFile(id, primaryImage, primaryImage.name);
    imageUrl = uploaded.url;
    gallery = gallery.filter((url) => url !== existing.imageUrl);
    const oldPrimaryPath = extractStoragePath(existing.imageUrl);
    if (oldPrimaryPath) storageDeleteTargets.push(oldPrimaryPath);
    gallery = [uploaded.url, ...gallery];
  }

  for (const file of galleryFiles) {
    const uploaded = await uploadBikeFile(id, file, file.name);
    gallery.push(uploaded.url);
  }

  gallery = Array.from(new Set(gallery.filter(Boolean)));
  if (imageUrl && !gallery.includes(imageUrl)) gallery = [imageUrl, ...gallery];
  if (!imageUrl && gallery.length) imageUrl = gallery[0];

  const { brand, category } = await resolveBrandCategoryIds(payload);

  const finalImageUrl = imageUrl || existing.imageUrl;
  if (!finalImageUrl) {
    return NextResponse.json({ message: "Primary image is required." }, { status: 400 });
  }

  try {
    await db.bike.update({
      where: { id },
      data: {
        ...bikeScalarDataFromPayload(payload, brand.name, category.name, brand.id, category.id),
        cityId: city.id,
        imageUrl: finalImageUrl,
        gallery,
      },
    });
    await syncBikeImages(id, gallery);

    await db.bikeContent.upsert({
      where: { bikeId: id },
      update: rentalTermsContent(payload),
      create: { bikeId: id, ...rentalTermsContent(payload) },
    });

    if (storageDeleteTargets.length) {
      await deleteStoragePaths(storageDeleteTargets).catch(() => undefined);
    }

    await db.activityLog
      .create({
        data: {
          adminId,
          action: "UPDATE",
          entityType: "bike",
          entityId: id,
          meta: { name: payload.name, slug: payload.slug },
        },
      })
      .catch(() => undefined);

    revalidateTag("bike-details", "max");
    revalidateTag("bikes", "max");
    const bike = await serializeAdminBike(id);
    return NextResponse.json({ success: true, bike });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ message: "Another bike already uses this slug." }, { status: 409 });
    }
    const message = error instanceof Error ? error.message : "Failed to save bike.";
    console.error("[admin/bikes PATCH]", error);
    return NextResponse.json({ message }, { status: 500 });
  }
}
