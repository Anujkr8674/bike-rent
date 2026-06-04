/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PleaseWaitOverlay } from "@/components/admin/bikes/please-wait-overlay";
import { SearchableSelect } from "@/components/admin/bikes/searchable-select";
import { ImagePreviewGrid, ImageUploadField } from "@/components/admin/bikes/image-upload-field";
import { TiptapEditor } from "@/components/admin/bikes/tiptap-editor";
import { FieldLabel, FormSection } from "@/components/admin/bikes/form-section";
import type { CatalogItem } from "@/components/admin/bikes/catalog-manager-modal";
import {
  bikeAdminFormSchema,
  bikeFuelTypeOptions,
  bikeRecordToFormValues,
  bikeTransmissionOptions,
  defaultBikeFormValues,
  slugifyText,
  type AdminBikeRecord,
  type BikeAdminFormValues,
} from "@/lib/admin-bike";
import { bikeFeatureOptions } from "@/lib/bike-json";
import { makeBikeFormData, submitBikeMutation } from "@/lib/bike-form-client";

type BikeFormInput = z.input<typeof bikeAdminFormSchema>;

type BikeAdminFormProps = {
  bikeId?: string;
  onSaved?: () => void;
};

function usePreviewUrl(file: File | null) {
  const url = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);
  return url;
}

function useFilesPreviewUrls(files: File[]) {
  const urls = useMemo(() => files.map((file) => ({ file, url: URL.createObjectURL(file) })), [files]);
  useEffect(
    () => () => {
      urls.forEach((item) => URL.revokeObjectURL(item.url));
    },
    [urls],
  );
  return urls;
}

export function BikeAdminForm({ bikeId, onSaved }: BikeAdminFormProps) {
  const router = useRouter();
  const [brands, setBrands] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [selectedBike, setSelectedBike] = useState<AdminBikeRecord | null>(null);
  const [loadingBike, setLoadingBike] = useState(Boolean(bikeId));
  const [saving, setSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [removeGalleryUrls, setRemoveGalleryUrls] = useState<string[]>([]);
  const [removePrimaryImage, setRemovePrimaryImage] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BikeFormInput, unknown, BikeAdminFormValues>({
    resolver: zodResolver(bikeAdminFormSchema),
    defaultValues: defaultBikeFormValues,
  });

  const currentName = useWatch({ control, name: "name" }) ?? "";
  const currentSlug = useWatch({ control, name: "slug" }) ?? "";
  const isEditing = Boolean(selectedBike?.id);
  const primaryPreview = usePreviewUrl(primaryImage);
  const galleryPreviews = useFilesPreviewUrls(galleryImages);

  const brandOptions = brands.map((item) => ({ value: item.id, label: item.name }));
  const categoryOptions = categories.map((item) => ({ value: item.id, label: item.name }));

  const existingPrimaryUrl =
    isEditing && selectedBike?.imageUrl && !removePrimaryImage ? selectedBike.imageUrl : "";
  const currentPrimaryUrl = primaryPreview || existingPrimaryUrl;

  const existingGallery = useMemo(() => {
    const existing = isEditing ? selectedBike?.gallery ?? [] : [];
    return existing.filter((url) => !removeGalleryUrls.includes(url));
  }, [isEditing, removeGalleryUrls, selectedBike]);

  const loadCatalog = async () => {
    const [brandRes, categoryRes] = await Promise.all([
      fetch("/api/admin/bike-brands", { credentials: "include", cache: "no-store" }),
      fetch("/api/admin/bike-categories", { credentials: "include", cache: "no-store" }),
    ]);
    const brandData = await brandRes.json();
    const categoryData = await categoryRes.json();
    if (brandRes.ok) setBrands(brandData.brands ?? []);
    if (categoryRes.ok) setCategories(categoryData.categories ?? []);
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  useEffect(() => {
    if (!bikeId) {
      setLoadingBike(false);
      return;
    }
    const load = async () => {
      setLoadingBike(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/bikes/${bikeId}`, { credentials: "include", cache: "no-store" });
        const data = (await response.json()) as { bike?: AdminBikeRecord; message?: string };
        if (!response.ok || !data.bike) throw new Error(data.message || "Bike not found.");
        setSelectedBike(data.bike);
        reset(bikeRecordToFormValues(data.bike));
        setEditorKey((key) => key + 1);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load bike.");
      } finally {
        setLoadingBike(false);
      }
    };
    void load();
  }, [bikeId, reset]);

  useEffect(() => {
    if (!isEditing && !currentSlug && currentName.trim()) {
      setValue("slug", slugifyText(currentName), { shouldDirty: true });
    }
  }, [currentName, currentSlug, isEditing, setValue]);

  const inputClass = "w-full rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#FF653F]/50";

  const onSubmit = async (values: BikeAdminFormValues) => {
    setSaving(true);
    setSaveProgress(0);
    setError(null);
    try {
      if (!isEditing && !primaryImage) {
        throw new Error("Primary image is required for new bikes.");
      }
      const url = selectedBike ? `/api/admin/bikes/${selectedBike.id}` : "/api/admin/bikes";
      const method = selectedBike ? "PATCH" : "POST";
      const formData = makeBikeFormData(values, primaryImage, galleryImages, removeGalleryUrls, removePrimaryImage);
      const result = await submitBikeMutation(method, url, formData, setSaveProgress);
      if (!result.ok) {
        const payload = (result.data as { message?: string } | null) || null;
        throw new Error(payload?.message || "Failed to save bike.");
      }
      onSaved?.();
      if (!bikeId) router.push("/admin/bikes");
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save bike.");
    } finally {
      setSaving(false);
      setSaveProgress(0);
    }
  };

  const formErrorMessage = Object.values(errors)[0]?.message;

  return (
    <div className="space-y-5 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
      <PleaseWaitOverlay open={saving} />
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">{isEditing ? "Edit bike" : "Create bike"}</p>
          <h2 className="font-display mt-2 text-2xl font-bold text-zinc-900">{isEditing ? selectedBike?.name : "New bike"}</h2>
        </div>
        <Link
          href="/admin/bikes"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to bikes
        </Link>
      </div>

      {loadingBike ? (
        <div className="rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-500">
          <Loader2 className="mx-auto mb-2 h-4 w-4 animate-spin text-[#FF653F]" />
          Loading bike...
        </div>
      ) : null}

      {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div> : null}
      {formErrorMessage ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{String(formErrorMessage)}</div>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <FormSection title="1. Basic information" description="Core bike identity and catalog mapping.">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel label="Bike name" required />
              <input {...register("name")} className={inputClass} />
            </div>
            <div>
              <FieldLabel label="Slug" />
              <input {...register("slug")} className={inputClass} />
            </div>
            <div>
              <Controller control={control} name="brandId" render={({ field }) => (
                <SearchableSelect label="Brand" required value={field.value} options={brandOptions} onChange={field.onChange} error={errors.brandId?.message} />
              )} />
            </div>
            <div>
              <Controller control={control} name="categoryId" render={({ field }) => (
                <SearchableSelect label="Category" required value={field.value} options={categoryOptions} onChange={field.onChange} error={errors.categoryId?.message} />
              )} />
            </div>
            <div>
              <FieldLabel label="City" required />
              <input {...register("cityName")} className={inputClass} />
            </div>
            <div>
              <FieldLabel label="Bike number" />
              <input {...register("bikeNo")} className={inputClass} placeholder="JH01EV8575" />
            </div>
            <div>
              <FieldLabel label="Bike color" />
              <input {...register("color")} className={inputClass} placeholder="Matte Black" />
            </div>
            <div className="md:col-span-2">
              <FieldLabel label="Short description" />
              <textarea {...register("shortDescription")} rows={2} className={inputClass} placeholder="One-line summary for cards and SEO." />
            </div>
            <div className="md:col-span-2">
              {!loadingBike ? (
                <Controller
                  key={`description-${editorKey}`}
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <TiptapEditor label="Full description" value={field.value ?? ""} onChange={field.onChange} placeholder="Detailed bike description..." />
                  )}
                />
              ) : null}
            </div>
          </div>
        </FormSection>

        <FormSection title="2. Specifications" description="Performance and mechanical details.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div><FieldLabel label="CC" required /><input type="number" {...register("cc", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Mileage (kmpl)" required /><input type="number" {...register("mileage", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Model year" /><input type="number" {...register("modelYear", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Seating persons" /><input type="number" {...register("seatingPerson", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Top speed (km/h)" /><input type="number" {...register("topSpeed", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Engine type" /><input {...register("engineType")} className={inputClass} placeholder="Single cylinder" /></div>
            <div><FieldLabel label="Power" /><input {...register("power")} className={inputClass} placeholder="14.8 bhp" /></div>
            <div><FieldLabel label="Torque" /><input {...register("torque")} className={inputClass} placeholder="13.9 Nm" /></div>
            <div><FieldLabel label="Fuel tank" /><input {...register("fuelTank")} className={inputClass} placeholder="5.3 L" /></div>
            <div><FieldLabel label="Weight" /><input {...register("weight")} className={inputClass} placeholder="108 kg" /></div>
            <div><FieldLabel label="Seat height" /><input {...register("seatHeight")} className={inputClass} placeholder="765 mm" /></div>
            <div>
              <FieldLabel label="Fuel type" required />
              <select {...register("fuelType")} className={inputClass}>{bikeFuelTypeOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select>
            </div>
            <div>
              <FieldLabel label="Transmission" required />
              <select {...register("transmission")} className={inputClass}>{bikeTransmissionOptions.map((o) => <option key={o} value={o}>{o}</option>)}</select>
            </div>
          </div>
        </FormSection>

        <FormSection title="3. Rental settings" description="Pricing and booking rules.">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div><FieldLabel label="Hourly charge" required /><input type="number" {...register("hourlyCharge", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Daily charge" required /><input type="number" {...register("pricePerDay", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Security deposit" /><input type="number" {...register("securityDeposit", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Included KM / day" /><input type="number" {...register("includedKmPerDay", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Extra KM charge" /><input type="number" {...register("extraKmCharge", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Min booking hours" /><input type="number" {...register("minimumBookingHours", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Max booking days" /><input type="number" {...register("maximumBookingDays", { valueAsNumber: true })} className={inputClass} /></div>
            <div><FieldLabel label="Late return charge" /><input type="number" {...register("lateReturnCharge", { valueAsNumber: true })} className={inputClass} /></div>
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
            <input type="checkbox" {...register("isAvailable")} className="h-4 w-4" />
            <span className="text-sm font-medium text-zinc-700">Available for booking</span>
          </label>
        </FormSection>

        <FormSection title="4. Features" description="Saved as JSON in PostgreSQL.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {bikeFeatureOptions.map((feature) => (
              <label key={feature.key} className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm">
                <input type="checkbox" {...register(`features.${feature.key}`)} className="h-4 w-4" />
                {feature.label}
              </label>
            ))}
          </div>
        </FormSection>

        <FormSection title="5. SEO" description="Search engine metadata (JSONB).">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2"><FieldLabel label="Meta title" /><input {...register("seo.meta_title")} className={inputClass} /></div>
            <div className="md:col-span-2"><FieldLabel label="Meta description" /><textarea {...register("seo.meta_description")} rows={2} className={inputClass} /></div>
            <div className="md:col-span-2"><FieldLabel label="Keywords (comma separated)" /><input {...register("keywordsText")} className={inputClass} placeholder="bike rent ranchi, activa rent" /></div>
          </div>
        </FormSection>

        <FormSection title="6. Documents" description="RC and compliance dates (JSONB).">
          <div className="grid gap-4 md:grid-cols-2">
            <div><FieldLabel label="RC number" /><input {...register("documents.rc_number")} className={inputClass} /></div>
            <div><FieldLabel label="Insurance expiry" /><input type="date" {...register("documents.insurance_expiry")} className={inputClass} /></div>
            <div><FieldLabel label="PUC expiry" /><input type="date" {...register("documents.puc_expiry")} className={inputClass} /></div>
            <div><FieldLabel label="Service due date" /><input type="date" {...register("documents.service_due_date")} className={inputClass} /></div>
          </div>
        </FormSection>

        <FormSection title="7. Images" description="Supabase Storage: assets/admin/bike/{bikeId}/">
          <div className="space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <ImageUploadField
                label="Primary image"
                required={!isEditing}
                onFiles={(files) => setPrimaryImage(files[0] ?? null)}
              />
              {isEditing && selectedBike?.imageUrl ? (
                <button type="button" onClick={() => setRemovePrimaryImage((c) => !c)} className="mt-2 text-xs font-semibold text-rose-600">
                  {removePrimaryImage ? "Restore existing primary" : "Remove existing primary"}
                </button>
              ) : null}
              {currentPrimaryUrl ? <img src={currentPrimaryUrl} alt="Primary" className="mt-3 h-44 w-full rounded-xl border border-zinc-200 object-cover" /> : null}
            </div>
            <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <ImageUploadField label="Gallery images" multiple onFiles={(files) => setGalleryImages((current) => [...current, ...files])} />
              <ImagePreviewGrid
                urls={[
                  ...existingGallery.map((url) => ({
                    src: url,
                    key: `existing-${url}`,
                    onRemove: () => setRemoveGalleryUrls((current) => [...current, url]),
                  })),
                  ...galleryPreviews.map((item, index) => ({
                    src: item.url,
                    key: `new-${item.file.name}-${index}`,
                    onRemove: () => setGalleryImages((current) => current.filter((file) => file !== item.file)),
                  })),
                ]}
              />
            </div>
          </div>
        </FormSection>

        <FormSection title="8. Rental terms" description="Rich terms shown on the public bike page.">
          {!loadingBike ? (
            <Controller
              key={`rental-${editorKey}`}
              control={control}
              name="rentalTerms"
              render={({ field }) => (
                <TiptapEditor label="Rental terms" value={field.value ?? ""} onChange={field.onChange} />
              )}
            />
          ) : null}
        </FormSection>

        <Button type="submit" disabled={saving} className="gap-2">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {isEditing ? "Update bike" : "Create bike"}
        </Button>
      </form>
    </div>
  );
}
