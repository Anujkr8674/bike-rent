import { z } from "zod";
import {
  bikeDocumentsSchema,
  bikeFeaturesSchema,
  bikeSeoSchema,
  defaultBikeDocuments,
  defaultBikeFeatures,
  defaultBikeSeo,
  parseBikeDocuments,
  parseBikeFeatures,
  parseBikeSeo,
} from "@/lib/bike-json";

export const bikeTransmissionOptions = ["MANUAL", "AUTOMATIC"] as const;
export const bikeFuelTypeOptions = ["PETROL", "ELECTRIC"] as const;

const emptyToUndefined = (value: unknown) =>
  value === "" || value === null || value === undefined || (typeof value === "number" && Number.isNaN(value))
    ? undefined
    : value;

const optionalNumber = z.preprocess(emptyToUndefined, z.coerce.number().optional());
const optionalPositiveInt = z.preprocess(emptyToUndefined, z.coerce.number().int().positive().optional());

export const bikeAdminFormSchema = z.object({
  name: z.string().trim().min(1, "Bike name is required"),
  slug: z.string().trim().optional().default(""),
  brandId: z.string().trim().min(1, "Brand is required"),
  categoryId: z.string().trim().min(1, "Category is required"),
  cityName: z.string().trim().min(1, "City is required").default("Ranchi"),
  shortDescription: z.string().trim().max(500).optional().default(""),
  description: z.string().trim().optional().default(""),
  cc: z.coerce.number().int().positive("CC must be greater than zero"),
  mileage: z.coerce.number().int().positive("Mileage must be greater than zero"),
  modelYear: optionalPositiveInt,
  seatingPerson: optionalPositiveInt,
  topSpeed: optionalPositiveInt,
  power: z.string().trim().optional().default(""),
  torque: z.string().trim().optional().default(""),
  fuelTank: z.string().trim().optional().default(""),
  weight: z.string().trim().optional().default(""),
  seatHeight: z.string().trim().optional().default(""),
  engineType: z.string().trim().optional().default(""),
  bikeNo: z.string().trim().optional().default(""),
  color: z.string().trim().optional().default(""),
  hourlyCharge: z.coerce.number().positive("Hourly charge must be greater than zero"),
  transmission: z.enum(bikeTransmissionOptions),
  fuelType: z.enum(bikeFuelTypeOptions),
  pricePerDay: z.coerce.number().positive("Daily charge must be greater than zero"),
  securityDeposit: z.coerce.number().min(0, "Security deposit cannot be negative").default(0),
  includedKmPerDay: optionalPositiveInt,
  extraKmCharge: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
  minimumBookingHours: optionalPositiveInt,
  maximumBookingDays: optionalPositiveInt,
  lateReturnCharge: z.preprocess(emptyToUndefined, z.coerce.number().min(0).optional()),
  isAvailable: z.coerce.boolean().default(true),
  features: bikeFeaturesSchema.default(defaultBikeFeatures),
  seo: bikeSeoSchema.default(defaultBikeSeo),
  documents: bikeDocumentsSchema.default(defaultBikeDocuments),
  rentalTerms: z.string().trim().optional().default(""),
  keywordsText: z.string().trim().optional().default(""),
});

export type BikeAdminFormValues = z.infer<typeof bikeAdminFormSchema>;

export type BikeContentValue = {
  rentalTerms?: unknown;
} | null;

export type AdminBikeRecord = {
  id: string;
  name: string;
  slug: string;
  brandId: string;
  categoryId: string;
  brand: string;
  category?: string | null;
  shortDescription?: string | null;
  description?: string | null;
  cc: number;
  modelYear?: number | null;
  seatingPerson?: number | null;
  topSpeed?: number | null;
  power?: string | null;
  torque?: string | null;
  fuelTank?: string | null;
  weight?: string | null;
  seatHeight?: string | null;
  engineType?: string | null;
  bikeNo?: string | null;
  color?: string | null;
  hourlyCharge?: number | null;
  mileage: number;
  transmission: (typeof bikeTransmissionOptions)[number];
  fuelType: (typeof bikeFuelTypeOptions)[number];
  city: { id: string; name: string; slug: string } | null;
  imageUrl: string;
  gallery: string[];
  pricePerDay: string | number;
  securityDeposit: string | number;
  includedKmPerDay?: number | null;
  extraKmCharge?: number | null;
  minimumBookingHours?: number | null;
  maximumBookingDays?: number | null;
  lateReturnCharge?: number | null;
  isAvailable: boolean;
  features: z.infer<typeof bikeFeaturesSchema>;
  seo: z.infer<typeof bikeSeoSchema>;
  documents: z.infer<typeof bikeDocumentsSchema>;
  updatedAt?: string;
  createdAt?: string;
  content?: BikeContentValue;
};

export function slugifyText(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function normalizeBikeForm(values: BikeAdminFormValues): BikeAdminFormValues {
  const keywords = (values.keywordsText || values.seo.keywords.join(","))
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return {
    ...values,
    slug: slugifyText(values.slug || values.name),
    cityName: values.cityName.trim() || "Ranchi",
    bikeNo: values.bikeNo.trim(),
    color: values.color.trim(),
    shortDescription: values.shortDescription.trim(),
    description: values.description.trim(),
    rentalTerms: values.rentalTerms.trim(),
    seo: {
      ...values.seo,
      meta_title: values.seo.meta_title.trim(),
      meta_description: values.seo.meta_description.trim(),
      keywords,
    },
    documents: {
      rc_number: values.documents.rc_number.trim(),
      insurance_expiry: values.documents.insurance_expiry,
      puc_expiry: values.documents.puc_expiry,
      service_due_date: values.documents.service_due_date,
    },
  };
}

export function richTextToJson(value: string) {
  const html = value.trim();
  return html ? { html } : null;
}

export function richTextFromJson(value: unknown) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "object" && value && "html" in value) {
    const html = (value as { html?: unknown }).html;
    return typeof html === "string" ? html : "";
  }
  return "";
}

export function bikeRecordToFormValues(bike: AdminBikeRecord): BikeAdminFormValues {
  const seo = parseBikeSeo(bike.seo);
  return {
    name: bike.name,
    slug: bike.slug,
    brandId: bike.brandId,
    categoryId: bike.categoryId,
    cityName: bike.city?.name ?? "Ranchi",
    shortDescription: bike.shortDescription ?? "",
    description: bike.description ?? "",
    cc: bike.cc,
    modelYear: bike.modelYear ?? undefined,
    seatingPerson: bike.seatingPerson ?? undefined,
    topSpeed: bike.topSpeed ?? undefined,
    power: bike.power ?? "",
    torque: bike.torque ?? "",
    fuelTank: bike.fuelTank ?? "",
    weight: bike.weight ?? "",
    seatHeight: bike.seatHeight ?? "",
    engineType: bike.engineType ?? "",
    bikeNo: bike.bikeNo ?? "",
    color: bike.color ?? "",
    hourlyCharge: bike.hourlyCharge == null ? 0 : Number(bike.hourlyCharge),
    mileage: bike.mileage,
    transmission: bike.transmission,
    fuelType: bike.fuelType,
    pricePerDay: Number(bike.pricePerDay),
    securityDeposit: Number(bike.securityDeposit),
    includedKmPerDay: bike.includedKmPerDay ?? undefined,
    extraKmCharge: bike.extraKmCharge == null ? undefined : Number(bike.extraKmCharge),
    minimumBookingHours: bike.minimumBookingHours ?? undefined,
    maximumBookingDays: bike.maximumBookingDays ?? undefined,
    lateReturnCharge: bike.lateReturnCharge == null ? undefined : Number(bike.lateReturnCharge),
    isAvailable: bike.isAvailable,
    features: parseBikeFeatures(bike.features),
    seo,
    documents: parseBikeDocuments(bike.documents),
    rentalTerms: richTextFromJson(bike.content?.rentalTerms),
    keywordsText: seo.keywords.join(", "),
  };
}

export function contentPayloadFromValues(values: BikeAdminFormValues) {
  return {
    rentalTerms: values.rentalTerms.trim() || null,
  };
}

export const defaultBikeFormValues: BikeAdminFormValues = {
  name: "",
  slug: "",
  brandId: "",
  categoryId: "",
  cityName: "Ranchi",
  shortDescription: "",
  description: "",
  cc: 110,
  mileage: 40,
  modelYear: undefined,
  seatingPerson: 2,
  topSpeed: undefined,
  power: "",
  torque: "",
  fuelTank: "",
  weight: "",
  seatHeight: "",
  engineType: "",
  bikeNo: "",
  color: "",
  hourlyCharge: 75,
  transmission: "MANUAL",
  fuelType: "PETROL",
  pricePerDay: 499,
  securityDeposit: 2000,
  includedKmPerDay: 100,
  extraKmCharge: undefined,
  minimumBookingHours: 2,
  maximumBookingDays: 30,
  lateReturnCharge: undefined,
  isAvailable: true,
  features: defaultBikeFeatures,
  seo: defaultBikeSeo,
  documents: defaultBikeDocuments,
  rentalTerms: "",
  keywordsText: "",
};

export function coerceBoolean(value: unknown, fallback = false) {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value !== 0;
  if (typeof value === "string") {
    return ["true", "1", "yes", "on"].includes(value.toLowerCase());
  }
  return fallback;
}
