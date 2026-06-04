"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Bike, Loader2, Pencil } from "lucide-react";
import { RichHtmlContent } from "@/components/ui/rich-html-content";
import { bikeFeatureOptions } from "@/lib/bike-json";
import { richTextFromJson, type AdminBikeRecord } from "@/lib/admin-bike";
import { cn, formatCurrency } from "@/lib/utils";

type Props = { bikeId: string };

function DetailBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h3 className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">{title}</h3>
      <div className="mt-3">{children}</div>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex justify-between gap-4 border-b border-zinc-100 py-2 text-sm last:border-0">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-900 text-right">{value ?? "—"}</span>
    </div>
  );
}

export function BikeAdminDetail({ bikeId }: Props) {
  const [bike, setBike] = useState<AdminBikeRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/admin/bikes/${bikeId}`, { credentials: "include", cache: "no-store" });
        const data = (await response.json()) as { bike?: AdminBikeRecord; message?: string };
        if (!response.ok || !data.bike) throw new Error(data.message || "Bike not found.");
        setBike(data.bike);
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Failed to load bike.");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [bikeId]);

  if (loading) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center text-sm text-zinc-500">
        <Loader2 className="mx-auto mb-2 h-5 w-5 animate-spin text-[#FF653F]" />
        Loading bike details...
      </div>
    );
  }

  if (error || !bike) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-700">
        {error || "Bike not found."}
        <div className="mt-4">
          <Link href="/admin/bikes" className="inline-flex h-10 items-center rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50">
            Back to bikes
          </Link>
        </div>
      </div>
    );
  }

  const gallery = Array.from(new Set([bike.imageUrl, ...bike.gallery].filter(Boolean)));
  const rentalTermsHtml = richTextFromJson(bike.content?.rentalTerms);
  const activeFeatures = bikeFeatureOptions.filter((f) => bike.features[f.key]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">Bike details</p>
          <h1 className="font-display mt-2 text-3xl font-bold text-zinc-900">{bike.name}</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {bike.brand} · {bike.category ?? "—"} · {bike.city?.name ?? "Ranchi"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/bikes"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 hover:bg-zinc-50"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Link
            href={`/admin/bikes/${bike.id}`}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#FF653F] px-4 text-sm font-semibold text-white hover:bg-[#e55a38]"
          >
            <Pencil className="h-4 w-4" />
            Edit bike
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-5">
          <div className="overflow-hidden rounded-[1.75rem] border border-zinc-200 bg-white shadow-sm">
            {bike.imageUrl ? (
              <img src={bike.imageUrl} alt={bike.name} className="h-[320px] w-full object-cover" />
            ) : (
              <div className="flex h-[320px] items-center justify-center text-zinc-400">
                <Bike className="h-12 w-12" />
              </div>
            )}
          </div>
          {gallery.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {gallery.map((url, index) => (
                <div key={`${url}-${index}`} className="h-20 w-28 overflow-hidden rounded-xl border border-zinc-200">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          ) : null}

          {bike.shortDescription ? (
            <DetailBlock title="Short description">
              <p className="text-sm text-zinc-600">{bike.shortDescription}</p>
            </DetailBlock>
          ) : null}

          {bike.description ? (
            <DetailBlock title="Full description">
              <RichHtmlContent html={bike.description} />
            </DetailBlock>
          ) : null}

          {rentalTermsHtml ? (
            <DetailBlock title="Rental terms">
              <RichHtmlContent html={rentalTermsHtml} />
            </DetailBlock>
          ) : null}
        </div>

        <div className="space-y-5">
          <DetailBlock title="Status & pricing">
            <span
              className={cn(
                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                bike.isAvailable ? "bg-emerald-100 text-emerald-700" : "bg-zinc-100 text-zinc-600",
              )}
            >
              {bike.isAvailable ? "Available" : "Unavailable"}
            </span>


            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-orange-100 bg-orange-50 p-3">
                <p className="text-[10px] font-semibold uppercase text-orange-700">Daily rate</p>
                <p className="text-xl font-bold text-orange-900">{formatCurrency(Number(bike.pricePerDay))}<span className="text-xs font-semibold">/ day</span></p>
              </div>


              <div className="rounded-xl border-blue-100 bg-blue-50 p-3">
                <p className="text-[10px] font-semibold uppercase text-blue-700">Hourly rate</p>
                <p className="text-xl font-bold text-blue-900">
                  {bike.hourlyCharge == null ? "—" : formatCurrency(Number(bike.hourlyCharge))} <span className="text-xs font-semibold">/ hour</span>
                </p>
              </div>
              <div className="rounded-xl border-violet-100 bg-violet-50 p-3">
                <p className="text-[10px] font-semibold uppercase text-violet-700">Security Deposit</p>
                <p className="text-xl font-bold text-violet-900">{formatCurrency(Number(bike.securityDeposit))}</p>
              </div>
              <div className="rounded-xl bg-zinc-50 p-3">
                <p className="text-[10px] font-semibold uppercase text-zinc-400">Bike no.</p>
                <p className="text-lg font-bold truncate">{bike.bikeNo || "—"}</p>
              </div>
            </div>
          </DetailBlock>

          <DetailBlock title="Specifications">
            <SpecRow label="Slug" value={bike.slug} />
            <SpecRow label="CC" value={`${bike.cc}cc`} />
            <SpecRow label="Mileage" value={`${bike.mileage} kmpl`} />
            <SpecRow label="Fuel" value={bike.fuelType} />
            <SpecRow label="Transmission" value={bike.transmission} />
            <SpecRow label="Model year" value={bike.modelYear} />
            <SpecRow label="Color" value={bike.color} />
            <SpecRow label="Seating" value={bike.seatingPerson} />
            <SpecRow label="Top speed" value={bike.topSpeed ? `${bike.topSpeed} km/h` : null} />
            <SpecRow label="Engine" value={bike.engineType} />
            <SpecRow label="Power" value={bike.power} />
            <SpecRow label="Torque" value={bike.torque} />
            <SpecRow label="Fuel tank" value={bike.fuelTank} />
            <SpecRow label="Weight" value={bike.weight} />
            <SpecRow label="Seat height" value={bike.seatHeight} />
          </DetailBlock>

          <DetailBlock title="Rental rules">
            <SpecRow label="Included KM/day" value={bike.includedKmPerDay} />
            <SpecRow label="Extra KM charge" value={bike.extraKmCharge == null ? null : formatCurrency(Number(bike.extraKmCharge))} />
            <SpecRow label="Min booking hours" value={bike.minimumBookingHours} />
            <SpecRow label="Max booking days" value={bike.maximumBookingDays} />
            <SpecRow label="Late return charge" value={bike.lateReturnCharge == null ? null : formatCurrency(Number(bike.lateReturnCharge))} />
          </DetailBlock>

          {activeFeatures.length ? (
            <DetailBlock title="Features">
              <div className="flex flex-wrap gap-2">
                {activeFeatures.map((f) => (
                  <span key={f.key} className="rounded-full bg-[#FF653F]/10 px-3 py-1 text-xs font-semibold text-[#FF653F]">
                    {f.label}
                  </span>
                ))}
              </div>
            </DetailBlock>
          ) : null}

          <DetailBlock title="SEO">
            <SpecRow label="Meta title" value={bike.seo.meta_title || "—"} />
            <SpecRow label="Meta description" value={bike.seo.meta_description || "—"} />
            <SpecRow label="Keywords" value={bike.seo.keywords.length ? bike.seo.keywords.join(", ") : "—"} />
          </DetailBlock>

          <DetailBlock title="Documents">
            <SpecRow label="RC number" value={bike.documents.rc_number || "—"} />
            <SpecRow label="Insurance expiry" value={bike.documents.insurance_expiry || "—"} />
            <SpecRow label="PUC expiry" value={bike.documents.puc_expiry || "—"} />
            <SpecRow label="Service due" value={bike.documents.service_due_date || "—"} />
          </DetailBlock>

          <DetailBlock title="Timestamps">
            <SpecRow label="Created" value={bike.createdAt ? new Date(bike.createdAt).toLocaleString("en-IN") : "—"} />
            <SpecRow label="Updated" value={bike.updatedAt ? new Date(bike.updatedAt).toLocaleString("en-IN") : "—"} />
          </DetailBlock>
        </div>
      </div>
    </div>
  );
}
