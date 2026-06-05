import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugifyText } from "@/lib/admin-bike";

import { uploadBikeCategoryFile, extractStoragePath, deleteStoragePaths } from "@/lib/storage";

async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function GET() {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const categories = await db.bikeCategory.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
  });

  return NextResponse.json({ categories });
}

export async function POST(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  let name = "";
  let imageFile: File | null = null;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    name = formData.get("name")?.toString().trim() ?? "";
    imageFile = formData.get("image") as File | null;
  } else {
    const body = (await req.json().catch(() => null)) as { name?: string } | null;
    name = body?.name?.trim() ?? "";
  }

  if (!name) {
    return NextResponse.json({ message: "Category name is required." }, { status: 400 });
  }

  const slug = slugifyText(name) || `category-${Date.now()}`;

  try {
    let category = await db.bikeCategory.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { name, slug, isActive: true },
    });

    if (imageFile && imageFile.size > 0) {
      try {
        const uploaded = await uploadBikeCategoryFile(category.id, imageFile, imageFile.name);
        category = await db.bikeCategory.update({
          where: { id: category.id },
          data: { imageUrl: uploaded.url },
        });
      } catch (uploadError) {
        console.error("Category image upload failed:", uploadError);
        return NextResponse.json({
          success: true,
          category,
          warning: uploadError instanceof Error ? uploadError.message : "Failed to upload image.",
        });
      }
    }

    return NextResponse.json({ success: true, category });
  } catch (dbError) {
    console.error("Category DB operation failed:", dbError);
    return NextResponse.json({ message: "Category already exists or could not be saved." }, { status: 409 });
  }
}

export async function PATCH(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Category id is required." }, { status: 400 });

  const existingCategory = await db.bikeCategory.findUnique({ where: { id } });
  if (!existingCategory) return NextResponse.json({ message: "Category not found." }, { status: 404 });

  let name = existingCategory.name;
  let imageFile: File | null = null;
  let deleteImage = false;

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    name = formData.get("name")?.toString().trim() ?? existingCategory.name;
    imageFile = formData.get("image") as File | null;
    deleteImage = formData.get("deleteImage") === "true";
  } else {
    const body = (await req.json().catch(() => null)) as { name?: string; deleteImage?: boolean } | null;
    name = body?.name?.trim() ?? existingCategory.name;
    deleteImage = !!body?.deleteImage;
  }

  if (!name) {
    return NextResponse.json({ message: "Category name cannot be empty." }, { status: 400 });
  }

  const slug = slugifyText(name) || `category-${Date.now()}`;

  try {
    let imageUrl = existingCategory.imageUrl;
    let oldImagePathToDelete: string | null = null;

    if (deleteImage || (imageFile && imageFile.size > 0)) {
      if (existingCategory.imageUrl) {
        oldImagePathToDelete = extractStoragePath(existingCategory.imageUrl);
      }
      imageUrl = null;
    }

    if (imageFile && imageFile.size > 0) {
      const uploaded = await uploadBikeCategoryFile(existingCategory.id, imageFile, imageFile.name);
      imageUrl = uploaded.url;
    }

    const updatedCategory = await db.bikeCategory.update({
      where: { id },
      data: { name, slug, imageUrl },
    });

    if (oldImagePathToDelete) {
      await deleteStoragePaths([oldImagePathToDelete]).catch((err) =>
        console.error("Failed to delete old category image from storage:", err)
      );
    }

    return NextResponse.json({ success: true, category: updatedCategory });
  } catch (error) {
    console.error("PATCH Category Error:", error);
    return NextResponse.json({ message: "Failed to update category." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Category id is required." }, { status: 400 });

  const category = await db.bikeCategory.findUnique({ where: { id } });
  if (!category) return NextResponse.json({ message: "Category not found." }, { status: 404 });

  const bikesUsing = await db.bike.count({
    where: { category: { equals: category.name, mode: "insensitive" } },
  });
  if (bikesUsing > 0) {
    return NextResponse.json(
      { message: `Cannot delete. ${bikesUsing} bike(s) are using "${category.name}".` },
      { status: 409 },
    );
  }

  if (category.imageUrl) {
    const storagePath = extractStoragePath(category.imageUrl);
    if (storagePath) {
      await deleteStoragePaths([storagePath]).catch((err) =>
        console.error("Failed to delete category image on delete:", err)
      );
    }
  }

  await db.bikeCategory.update({
    where: { id },
    data: { isActive: false, imageUrl: null },
  });
  return NextResponse.json({ success: true });
}
