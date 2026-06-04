import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { slugifyText } from "@/lib/admin-bike";

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

  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim() ?? "";
  if (!name) {
    return NextResponse.json({ message: "Category name is required." }, { status: 400 });
  }

  const slug = slugifyText(name) || `category-${Date.now()}`;

  try {
    const category = await db.bikeCategory.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { name, slug, isActive: true },
    });
    return NextResponse.json({ success: true, category });
  } catch {
    return NextResponse.json({ message: "Category already exists or could not be saved." }, { status: 409 });
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

  await db.bikeCategory.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ success: true });
}
