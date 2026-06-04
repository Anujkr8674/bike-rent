-- Bike module production upgrade (safe additive migration)

ALTER TABLE "BikeBrand" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "BikeCategory" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "brandId" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "categoryId" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "shortDescription" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "description" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "seatingPerson" INTEGER;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "topSpeed" INTEGER;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "power" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "torque" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "fuelTank" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "weight" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "seatHeight" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "engineType" TEXT;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "includedKmPerDay" INTEGER;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "extraKmCharge" DECIMAL(10,2);
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "minimumBookingHours" INTEGER;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "maximumBookingDays" INTEGER;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "lateReturnCharge" DECIMAL(10,2);
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "features" JSONB;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "seo" JSONB;
ALTER TABLE "Bike" ADD COLUMN IF NOT EXISTS "documents" JSONB;

CREATE TABLE IF NOT EXISTS "BikeImage" (
  "id" TEXT NOT NULL,
  "bikeId" TEXT NOT NULL,
  "imageUrl" TEXT NOT NULL,
  "sortOrder" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BikeImage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "BikeImage_bikeId_sortOrder_idx" ON "BikeImage"("bikeId", "sortOrder");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'BikeImage_bikeId_fkey'
  ) THEN
    ALTER TABLE "BikeImage"
      ADD CONSTRAINT "BikeImage_bikeId_fkey"
      FOREIGN KEY ("bikeId") REFERENCES "Bike"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Bike_brandId_fkey'
  ) THEN
    ALTER TABLE "Bike"
      ADD CONSTRAINT "Bike_brandId_fkey"
      FOREIGN KEY ("brandId") REFERENCES "BikeBrand"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'Bike_categoryId_fkey'
  ) THEN
    ALTER TABLE "Bike"
      ADD CONSTRAINT "Bike_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "BikeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "Bike_brandId_categoryId_idx" ON "Bike"("brandId", "categoryId");

-- Backfill brandId / categoryId from legacy text columns
UPDATE "Bike" b
SET "brandId" = bb.id
FROM "BikeBrand" bb
WHERE b."brandId" IS NULL AND lower(bb.name) = lower(b.brand);

UPDATE "Bike" b
SET "categoryId" = bc.id
FROM "BikeCategory" bc
WHERE b."categoryId" IS NULL AND b.category IS NOT NULL AND lower(bc.name) = lower(b.category);

-- Backfill BikeImage from gallery array
INSERT INTO "BikeImage" ("id", "bikeId", "imageUrl", "sortOrder")
SELECT
  md5(b.id || '-' || g.ord::text || '-' || g.url) AS id,
  b.id,
  g.url,
  g.ord
FROM "Bike" b
CROSS JOIN LATERAL unnest(b.gallery) WITH ORDINALITY AS g(url, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM "BikeImage" bi WHERE bi."bikeId" = b.id
);
