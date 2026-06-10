import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { unstable_cache, revalidateTag } from "next/cache";
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

  const getCachedBrands = unstable_cache(
    async () => {
      return await db.bikeBrand.findMany({
        where: { isActive: true },
        orderBy: { name: "asc" },
      });
    },
    ["active-bike-brands"],
    { tags: ["bike-brands"], revalidate: 86400 }
  );

  const brands = await getCachedBrands();

  return NextResponse.json({ brands });
}

export async function POST(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim() ?? "";
  if (!name) {
    return NextResponse.json({ message: "Brand name is required." }, { status: 400 });
  }

  const slug = slugifyText(name) || `brand-${Date.now()}`;

  try {
    const brand = await db.bikeBrand.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { name, slug, isActive: true },
    });
    revalidateTag("bike-brands", "max");
    return NextResponse.json({ success: true, brand });
  } catch {
    return NextResponse.json({ message: "Brand already exists or could not be saved." }, { status: 409 });
  }
}

export async function PATCH(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Brand id is required." }, { status: 400 });

  const existingBrand = await db.bikeBrand.findUnique({ where: { id } });
  if (!existingBrand) return NextResponse.json({ message: "Brand not found." }, { status: 404 });

  const body = (await req.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name?.trim() ?? "";
  if (!name) {
    return NextResponse.json({ message: "Brand name cannot be empty." }, { status: 400 });
  }

  const slug = slugifyText(name) || `brand-${Date.now()}`;

  try {
    const updatedBrand = await db.bikeBrand.update({
      where: { id },
      data: { name, slug },
    });
    revalidateTag("bike-brands", "max");
    return NextResponse.json({ success: true, brand: updatedBrand });
  } catch (error) {
    console.error("PATCH Brand Error:", error);
    return NextResponse.json({ message: "Failed to update brand." }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ message: "Brand id is required." }, { status: 400 });

  const brand = await db.bikeBrand.findUnique({ where: { id } });
  if (!brand) return NextResponse.json({ message: "Brand not found." }, { status: 404 });

  const bikesUsing = await db.bike.count({
    where: { brand: { equals: brand.name, mode: "insensitive" } },
  });
  if (bikesUsing > 0) {
    return NextResponse.json(
      { message: `Cannot delete. ${bikesUsing} bike(s) are using "${brand.name}".` },
      { status: 409 },
    );
  }

  await db.bikeBrand.update({ where: { id }, data: { isActive: false } });
  revalidateTag("bike-brands", "max");
  return NextResponse.json({ success: true });
}
