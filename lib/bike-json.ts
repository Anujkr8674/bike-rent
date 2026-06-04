import { z } from "zod";

export const bikeFeaturesSchema = z.object({
  abs: z.boolean().default(false),
  dual_abs: z.boolean().default(false),
  bluetooth: z.boolean().default(false),
  usb_charger: z.boolean().default(false),
  gps: z.boolean().default(false),
  quick_shifter: z.boolean().default(false),
  cruise_control: z.boolean().default(false),
  helmet_included: z.boolean().default(true),
});

export const bikeSeoSchema = z.object({
  meta_title: z.string().default(""),
  meta_description: z.string().default(""),
  keywords: z.array(z.string()).default([]),
});

export const bikeDocumentsSchema = z.object({
  rc_number: z.string().default(""),
  insurance_expiry: z.string().default(""),
  puc_expiry: z.string().default(""),
  service_due_date: z.string().default(""),
});

export type BikeFeatures = z.infer<typeof bikeFeaturesSchema>;
export type BikeSeo = z.infer<typeof bikeSeoSchema>;
export type BikeDocuments = z.infer<typeof bikeDocumentsSchema>;

export const defaultBikeFeatures: BikeFeatures = {
  abs: false,
  dual_abs: false,
  bluetooth: false,
  usb_charger: false,
  gps: false,
  quick_shifter: false,
  cruise_control: false,
  helmet_included: true,
};

export const defaultBikeSeo: BikeSeo = {
  meta_title: "",
  meta_description: "",
  keywords: [],
};

export const defaultBikeDocuments: BikeDocuments = {
  rc_number: "",
  insurance_expiry: "",
  puc_expiry: "",
  service_due_date: "",
};

export function parseBikeFeatures(value: unknown): BikeFeatures {
  const parsed = bikeFeaturesSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultBikeFeatures;
}

export function parseBikeSeo(value: unknown): BikeSeo {
  const parsed = bikeSeoSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultBikeSeo;
}

export function parseBikeDocuments(value: unknown): BikeDocuments {
  const parsed = bikeDocumentsSchema.safeParse(value);
  return parsed.success ? parsed.data : defaultBikeDocuments;
}

export const bikeFeatureOptions: { key: keyof BikeFeatures; label: string }[] = [
  { key: "abs", label: "ABS" },
  { key: "dual_abs", label: "Dual ABS" },
  { key: "bluetooth", label: "Bluetooth" },
  { key: "usb_charger", label: "USB Charger" },
  { key: "gps", label: "GPS" },
  { key: "quick_shifter", label: "Quick Shifter" },
  { key: "cruise_control", label: "Cruise Control" },
  { key: "helmet_included", label: "Helmet Included" },
];
