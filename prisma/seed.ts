import { PrismaClient, FuelType, TransmissionType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { ranchiBikes } from "../lib/bikes";

const db = new PrismaClient();

async function main() {
  const city = await db.city.upsert({
    where: { slug: "ranchi" },
    update: {},
    create: { name: "Ranchi", slug: "ranchi", isActive: true },
  });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@nextgenbike.ranchi";
  const adminPass = process.env.ADMIN_PASSWORD || "Ranchi#0000";

  const adminUser = await db.user.upsert({
    where: { email: adminEmail },
    update: { role: "ADMIN", isVerified: true, fullName: "Admin" },
    create: {
      email: adminEmail,
      fullName: "Admin",
      role: "ADMIN",
      isVerified: true,
      passwordHash: await bcrypt.hash(adminPass, 10),
    },
  });

  await db.admin.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      email: adminEmail,
      passwordHash: await bcrypt.hash(adminPass, 10),
      title: "Super Admin",
    },
  });

  const brandNames = Array.from(new Set(ranchiBikes.map((bike) => bike.brand)));
  const categoryNames = Array.from(new Set(ranchiBikes.map((bike) => bike.category)));

  for (const name of brandNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    await db.bikeBrand.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { name, slug, isActive: true },
    });
  }

  for (const name of categoryNames) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    await db.bikeCategory.upsert({
      where: { slug },
      update: { name, isActive: true },
      create: { name, slug, isActive: true },
    });
  }

  for (const bike of ranchiBikes) {
    await db.bike.upsert({
      where: { slug: bike.id },
      update: {
        name: bike.name,
        brand: bike.brand,
        category: bike.category,
        cc: bike.cc,
        mileage: bike.mileage,
        fuelType: bike.fuelType === "Electric" ? FuelType.ELECTRIC : FuelType.PETROL,
        transmission: bike.transmission === "Automatic" ? TransmissionType.AUTOMATIC : TransmissionType.MANUAL,
        imageUrl: bike.image,
        gallery: [bike.image],
        pricePerDay: bike.pricePerDay,
        securityDeposit: 2000,
        isAvailable: true,
        cityId: city.id,
      },
      create: {
        name: bike.name,
        slug: bike.id,
        brand: bike.brand,
        category: bike.category,
        cc: bike.cc,
        mileage: bike.mileage,
        fuelType: bike.fuelType === "Electric" ? FuelType.ELECTRIC : FuelType.PETROL,
        transmission: bike.transmission === "Automatic" ? TransmissionType.AUTOMATIC : TransmissionType.MANUAL,
        cityId: city.id,
        imageUrl: bike.image,
        gallery: [bike.image],
        pricePerDay: bike.pricePerDay,
        securityDeposit: 2000,
        isAvailable: true,
      },
    });
  }

  console.log("Seed complete: Ranchi city, admin user, and bikes.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
