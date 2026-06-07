"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bike,
  CheckCircle2,
  Copy,
  Download,
  Eye,
  Loader2,
  MapPin,
  MoreVertical,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Tag,
  Tags,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CatalogManagerModal, type CatalogItem } from "@/components/admin/bikes/catalog-manager-modal";
import { PleaseWaitOverlay } from "@/components/admin/bikes/please-wait-overlay";
import {
  bikeFuelTypeOptions,
  bikeRecordToFormValues,
  bikeTransmissionOptions,
  normalizeBikeForm,
  type AdminBikeRecord,
} from "@/lib/admin-bike";
import { makeBikeFormData, submitBikeMutation } from "@/lib/bike-form-client";
import { cn, formatCurrency } from "@/lib/utils";
import { BikeAdminForm } from "./bike-admin-form";

type BikeListResponse = {
  bikes: AdminBikeRecord[];
  stats: {
    total: number;
    available: number;
    unavailable: number;
    brands: number;
    categories: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type Filters = {
  q: string;
  availability: "all" | "available" | "unavailable";
  fuelType: "all" | (typeof bikeFuelTypeOptions)[number];
  transmission: "all" | (typeof bikeTransmissionOptions)[number];
};

type BikeManagerProps = {
  view?: "full" | "list" | "form";
  bikeId?: string;
};

function bikeMediaUrls(bike: AdminBikeRecord) {
  return Array.from(new Set([bike.imageUrl, ...bike.gallery].filter(Boolean)));
}

function formatBikeDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function toneClass(kind: "success" | "warning" | "danger" | "neutral") {
  switch (kind) {
    case "success":
      return "border-emerald-200 bg-emerald-50 text-emerald-700";
    case "warning":
      return "border-amber-200 bg-amber-50 text-amber-700";
    case "danger":
      return "border-rose-200 bg-rose-50 text-rose-700";
    default:
      return "border-zinc-200 bg-zinc-100 text-zinc-700";
  }
}

export function BikeManager({ view = "full", bikeId }: BikeManagerProps) {
  const router = useRouter();
  const showList = view !== "form";
  const showForm = view !== "list";
  const [filters, setFilters] = useState<Filters>({
    q: "",
    availability: "all",
    fuelType: "all",
    transmission: "all",
  });
  const [bikes, setBikes] = useState<AdminBikeRecord[]>([]);
  const [stats, setStats] = useState<BikeListResponse["stats"]>({
    total: 0,
    available: 0,
    unavailable: 0,
    brands: 0,
    categories: 0,
  });
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  const [brands, setBrands] = useState<CatalogItem[]>([]);
  const [categories, setCategories] = useState<CatalogItem[]>([]);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedBike, setSelectedBike] = useState<AdminBikeRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeCardImage, setActiveCardImage] = useState<Record<string, number>>({});

  const fetchCatalog = async () => {
    try {
      const [brandRes, categoryRes] = await Promise.all([
        fetch("/api/admin/bike-brands", { credentials: "include", cache: "no-store" }),
        fetch("/api/admin/bike-categories", { credentials: "include", cache: "no-store" }),
      ]);
      const brandData = await brandRes.json();
      const categoryData = await categoryRes.json();
      if (brandRes.ok) setBrands(brandData.brands ?? []);
      if (categoryRes.ok) setCategories(categoryData.categories ?? []);
    } catch {
      // ignore catalog load errors in form
    }
  };

  const fetchBikes = async () => {
    setLoading(true);
    setError(null);

    const searchParams = new URLSearchParams();
    if (filters.q.trim()) searchParams.set("q", filters.q.trim());
    if (filters.availability !== "all") searchParams.set("availability", filters.availability);
    if (filters.fuelType !== "all") searchParams.set("fuelType", filters.fuelType);
    if (filters.transmission !== "all") searchParams.set("transmission", filters.transmission);
    searchParams.set("page", String(page));
    searchParams.set("limit", "10");

    try {
      const response = await fetch(`/api/admin/bikes?${searchParams.toString()}`, {
        credentials: "include",
        cache: "no-store",
      });
      const data = (await response.json()) as BikeListResponse & { message?: string };
      if (!response.ok) {
        throw new Error(data.message || "Failed to load bikes.");
      }
      setBikes(data.bikes || []);
      setStats(
        data.stats || { total: 0, available: 0, unavailable: 0, brands: 0, categories: 0 },
      );
      setPagination(data.pagination || { page: 1, limit: 10, total: 0, totalPages: 1 });
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load bikes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!showList) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchBikes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.availability, filters.fuelType, filters.q, filters.transmission, page, showList]);

  useEffect(() => {
    if (!showForm && !showList) return;
    void fetchCatalog();
  }, [showForm, showList, brandModalOpen, categoryModalOpen]);

  const handleDelete = async (bike: AdminBikeRecord) => {
    const confirmed = window.confirm(`Delete ${bike.name}? This will remove the bike and linked storage files.`);
    if (!confirmed) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await submitBikeMutation("DELETE", `/api/admin/bikes?id=${bike.id}`);
      if (!result.ok) {
        const payload = (result.data as { message?: string } | null) || null;
        throw new Error(payload?.message || "Failed to delete bike.");
      }

      if (selectedBike?.id === bike.id) setSelectedBike(null);
      if (showList) {
        await fetchBikes();
      } else {
        router.push("/admin/bikes");
      }
      setSuccess("Bike deleted.");
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete bike.");
    } finally {
      setSaving(false);
    }
  };

  const setAvailability = async (bike: AdminBikeRecord, isAvailable: boolean) => {
    if (bike.isAvailable === isAvailable) return;

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const baseValues = normalizeBikeForm({
        ...bikeRecordToFormValues(bike),
        isAvailable,
      });
      const formData = makeBikeFormData(baseValues, null, [], [], false);
      const result = await submitBikeMutation("PATCH", `/api/admin/bikes/${bike.id}`, formData);
      if (!result.ok) {
        const payload = (result.data as { message?: string } | null) || null;
        throw new Error(payload?.message || "Failed to update availability.");
      }
      const responseBike = (result.data as { bike?: AdminBikeRecord } | null)?.bike;
      if (responseBike) {
        setBikes((current) => current.map((entry) => (entry.id === responseBike.id ? responseBike : entry)));
      }
      await fetchBikes();
      setSuccess(`${bike.name} is now ${isAvailable ? "available" : "unavailable"}.`);
    } catch (toggleError) {
      setError(toggleError instanceof Error ? toggleError.message : "Failed to update availability.");
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = () => {
    const rows = [
      ["Name", "Brand", "Slug", "City", "CC", "Mileage", "Fuel", "Transmission", "Price/Day", "Deposit", "Available"],
      ...bikes.map((bike) => [
        bike.name,
        bike.brand,
        bike.slug,
        bike.city?.name ?? "",
        bike.cc,
        bike.mileage,
        bike.fuelType,
        bike.transmission,
        Number(bike.pricePerDay),
        Number(bike.securityDeposit),
        bike.isAvailable ? "Yes" : "No",
      ]),
    ];
    const csv = rows
      .map((row) =>
        row
          .map((value) => {
            const text = String(value ?? "");
            return `"${text.replace(/"/g, '""')}"`;
          })
          .join(","),
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "admin-bikes.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 px-5 py-6 md:px-8">
      <PleaseWaitOverlay open={saving} message="Please wait..." />
      <CatalogManagerModal
        open={brandModalOpen}
        kind="brand"
        onClose={() => setBrandModalOpen(false)}
        onUpdated={() => {
          void fetchCatalog();
          if (showList) void fetchBikes();
        }}
      />
      <CatalogManagerModal
        open={categoryModalOpen}
        kind="category"
        onClose={() => setCategoryModalOpen(false)}
        onUpdated={() => {
          void fetchCatalog();
          if (showList) void fetchBikes();
        }}
      />
      <div className={cn("grid gap-4", showList && showForm ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-1")}>
        {showList ? (
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-400">Bike CMS</p>
              <h1 className="font-display mt-2 text-3xl font-bold text-zinc-900">Bike management</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
                Add, edit, search, filter, and manage bike inventory with Supabase Storage-backed images and structured
                content.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {showList ? (
                <Button
                  type="button"
                  onClick={exportCsv}
                  className="gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-zinc-900"
                >
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
              ) : null}
              {showList ? (
                <>
                  <Button
                    type="button"
                    onClick={() => setBrandModalOpen(true)}
                    className="gap-2 rounded-xl border border-sky-300 bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-sky-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Brand
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCategoryModalOpen(true)}
                    className="gap-2 rounded-xl border border-violet-300 bg-violet-500 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-600"
                  >
                    <Plus className="h-4 w-4" />
                    Add Category
                  </Button>
                  <Link
                    href="/admin/bikes/new"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF5722] px-5 py-3 text-sm font-semibold text-white shadow-md shadow-[#FF5722]/30 transition hover:bg-[#F4511E]"
                  >
                    <Plus className="h-4 w-4" />
                    Add New Bike
                  </Link>
                </>
              ) : (
                <Button type="button" variant="outline" onClick={() => router.push("/admin/bikes")} className="gap-2">
                  <ArrowRight className="h-4 w-4" />
                  Back to list
                </Button>
              )}
            </div>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { label: "Total Bikes", value: stats.total, hint: "+2 this month", iconClass: "bg-[#FFF1EA] text-[#FF653F] border-[#FFE0D6]", hintClass: "text-[#FF653F]", Icon: Bike, onClick: undefined },
              { label: "Available Bikes", value: stats.available, hint: `${stats.total ? Math.round((stats.available / stats.total) * 100) : 0}% of total`, iconClass: "bg-emerald-50 text-emerald-600 border-emerald-100", hintClass: "text-emerald-600", Icon: CheckCircle2, onClick: undefined },
              { label: "Unavailable Bikes", value: stats.unavailable, hint: `${stats.total ? Math.round((stats.unavailable / stats.total) * 100) : 0}% of total`, iconClass: "bg-rose-50 text-rose-500 border-rose-100", hintClass: "text-rose-600", Icon: X, onClick: undefined },
              { label: "Total Brands", value: stats.brands, hint: "Click to manage", iconClass: "bg-sky-50 text-sky-600 border-sky-100", hintClass: "text-sky-600", Icon: Tag, onClick: () => setBrandModalOpen(true) },
              { label: "Total Categories", value: stats.categories, hint: "Click to manage", iconClass: "bg-violet-50 text-violet-600 border-violet-100", hintClass: "text-violet-600", Icon: Tags, onClick: () => setCategoryModalOpen(true) },
            ].map((item) => {
              const Icon = item.Icon;
              const CardTag = item.onClick ? "button" : "div";
              return (
                <CardTag
                  key={item.label}
                  type={item.onClick ? "button" : undefined}
                  onClick={item.onClick}
                  className={cn(
                    "w-full rounded-2xl border border-zinc-200 bg-white p-4 text-left shadow-sm",
                    item.onClick && "cursor-pointer transition hover:-translate-y-0.5 hover:border-[#FF653F]/30 hover:shadow-md",
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("flex h-14 w-14 items-center justify-center rounded-full border", item.iconClass)}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-600">{item.label}</p>
                      <p className="mt-1 text-3xl font-bold tracking-tight text-zinc-900">{item.value}</p>
                      <p className={cn("mt-1 text-sm font-semibold", item.hintClass)}>{item.hint}</p>
                    </div>
                  </div>
                </CardTag>
              );
            })}
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr_1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  value={filters.q}
                  onChange={(event) => { setPage(1); setFilters((current) => ({ ...current, q: event.target.value })); }}
                  placeholder="Search bikes by name, brand, city or slug..."
                  className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#FF653F]/50"
                />
              </div>
              <select
                value={filters.availability}
                onChange={(event) => {
                  setPage(1);
                  setFilters((current) => ({
                    ...current,
                    availability: event.target.value as Filters["availability"],
                  }));
                }}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none"
              >
                <option value="all">All Status</option>
                <option value="available">Available</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <select
                value={filters.fuelType}
                onChange={(event) => {
                  setPage(1);
                  setFilters((current) => ({
                    ...current,
                    fuelType: event.target.value as Filters["fuelType"],
                  }));
                }}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none"
              >
                <option value="all">All Fuel</option>
                {bikeFuelTypeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <select
                value={filters.transmission}
                onChange={(event) => {
                  setPage(1);
                  setFilters((current) => ({
                    ...current,
                    transmission: event.target.value as Filters["transmission"],
                  }));
                }}
                className="rounded-xl border border-zinc-200 bg-white px-3 py-3 text-sm outline-none"
              >
                <option value="all">All Transmission</option>
                {bikeTransmissionOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <Button type="button" variant="outline" className="h-12 gap-2 rounded-xl">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
                <span className="rounded-full bg-[#FF653F] px-2 py-0.5 text-[10px] font-black text-white">3</span>
              </Button>
            </div>
          </div>

          <div className="mt-5 text-sm text-zinc-500">
            {loading ? "Loading bikes..." : `${bikes.length} results`}
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
          ) : null}
          {success ? (
            <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          ) : null}

          <div className="mt-5 space-y-4">
            {loading ? (
              <div className="rounded-3xl border border-dashed border-zinc-200 p-10 text-center text-sm text-zinc-500">
                Loading bikes...
              </div>
            ) : bikes.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-zinc-200 p-10 text-center">
                <p className="text-lg font-semibold text-zinc-900">No bikes match the current filters</p>
                <p className="mt-2 text-sm text-zinc-500">Create a new bike or adjust filters to see records.</p>
              </div>
            ) : (
              bikes.map((bike) => {
                const media = bikeMediaUrls(bike);
                const activeIndex = activeCardImage[bike.id] ?? 0;
                const mainImage = media[activeIndex] ?? bike.imageUrl;
                const visibleThumbs = media.slice(0, 3);
                const extraCount = Math.max(0, media.length - visibleThumbs.length);

                return (
                  <div
                    key={bike.id}
                    className={cn(
                      "overflow-hidden rounded-2xl border bg-white shadow-[0_6px_18px_rgba(15,23,42,0.05)]",
                      selectedBike?.id === bike.id ? "border-[#FF5722]/40 ring-2 ring-[#FF5722]/10" : "border-zinc-200",
                    )}
                  >
                    <div className="grid gap-0 lg:grid-cols-[170px_1fr]">
                      <div className="border-b border-zinc-100 bg-zinc-50 p-2.5 lg:border-b-0 lg:border-r">
                        <div className="relative h-[125px] overflow-hidden rounded-xl bg-zinc-100">
                          {mainImage ? (
                            <img src={mainImage} alt={bike.name} className="h-full w-full object-cover" />
                          ) : (
                            <div className="flex h-[125px] tems-center justify-center text-zinc-400">
                              <Bike className="h-8 w-8" />
                            </div>
                          )}
                          <span
                            className={cn(
                              "absolute left-2.5 top-2.5 rounded-md px-2 py-0.5 text-[10px] font-semibold text-white shadow",
                              bike.isAvailable ? "bg-emerald-500" : "bg-rose-500",
                            )}
                          >
                            {bike.isAvailable ? "Available" : "Unavailable"}
                          </span>
                          {media.length > 0 ? (
                            <div className="absolute inset-x-0 bottom-0 flex items-end gap-1.5 bg-gradient-to-t from-black/80 via-black/45 to-transparent px-2 pb-2 pt-8">
                              {visibleThumbs.map((url, index) => (
                                <button
                                  key={`${bike.id}-thumb-${index}`}
                                  type="button"
                                  onClick={() => setActiveCardImage((current) => ({ ...current, [bike.id]: index }))}
                                  className={cn(
                                    "h-8 w-8 shrink-0 overflow-hidden rounded-md border-2 bg-white/90",
                                    activeIndex === index ? "border-white" : "border-white/40",
                                  )}
                                >
                                  <img src={url} alt={`${bike.name} ${index + 1}`} className="h-full w-full object-cover" />
                                </button>
                              ))}
                              {extraCount > 0 ? (
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/40 bg-black/40 text-xs font-bold text-white">
                                  +{extraCount}
                                </div>
                              ) : null}
                            </div>
                          ) : null}
                        </div>
                      </div>

                      <div className="space-y-2 p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-lg font-bold text-zinc-900 sm:text-xl">{bike.name}</h3>
                              <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-semibold text-zinc-600">{bike.brand}</span>
                              {bike.category ? (
                                <span className="rounded-md bg-violet-100 px-2 py-0.5 text-xs font-semibold text-violet-700">
                                  {bike.category}
                                </span>
                              ) : null}
                            </div>
                            <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500">
                              <MapPin className="h-3.5 w-3.5 text-[#FF5722]" />
                              {bike.city?.name ?? "Ranchi"}
                            </p>
                          </div>
                          <Link
                            href={`/admin/bikes/${bike.id}/view`}
                            className="rounded-lg border border-zinc-200 p-1.5 text-zinc-500 transition hover:bg-zinc-50"
                            aria-label="View bike details"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Link>
                        </div>

                        <p className="text-sm text-zinc-600">
                          {bike.cc}cc • {bike.mileage} kmpl • {bike.fuelType} • {bike.transmission}
                          {bike.modelYear ? ` • Model Year: ${bike.modelYear}` : ""}
                          {bike.color ? ` • Color: ${bike.color}` : ""}
                        </p>

                        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-4">
                          <div className="rounded-lg border border-orange-100 bg-orange-50 p-2">
                            <p className="text-[11px] font-medium text-orange-700">Daily rate</p>
                            <p className="mt-0.5 text-base font-bold text-orange-900">
                              {formatCurrency(Number(bike.pricePerDay))} <span className="text-xs font-semibold">/ day</span>
                            </p>
                          </div>

                          
                          <div className="rounded-lg border border-blue-100 bg-blue-50 p-2">
                            <p className="text-[11px] font-medium text-blue-700">Hourly rate</p>
                            <p className="mt-0.5 text-base font-bold text-blue-900">
                              {bike.hourlyCharge == null ? "—" : formatCurrency(Number(bike.hourlyCharge))}{" "}
                              <span className="text-xs font-semibold">/ hour</span>
                            </p>
                          </div>
                          <div className="rounded-lg border border-violet-100 bg-violet-50 p-2">
                            <p className="text-[11px] font-medium text-violet-700">Security deposit</p>
                            <p className="mt-0.5 text-base font-bold text-violet-900">{formatCurrency(Number(bike.securityDeposit))}</p>
                          </div>
                          <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-2">
                            <p className="text-[11px] font-medium text-zinc-500">Bike No.</p>
                            <div className="mt-0.5 flex items-center justify-between gap-2">
                              <p className="truncate text-base font-bold text-zinc-900">{bike.bikeNo || "N/A"}</p>
                              {bike.bikeNo ? (
                                <button
                                  type="button"
                                  className="shrink-0 rounded-md p-1 text-zinc-500 hover:bg-white hover:text-zinc-800"
                                  aria-label="Copy bike number"
                                  onClick={() => navigator.clipboard.writeText(bike.bikeNo ?? "")}
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <p className="text-xs text-zinc-500">
                          Created: {formatBikeDate(bike.createdAt)} • Updated: {formatBikeDate(bike.updatedAt)}
                        </p>

                        <div className="grid grid-cols-2 gap-2 border-t border-zinc-100 pt-3 sm:grid-cols-4">
                          <Link
                            href={`/admin/bikes/${bike.id}/view`}
                            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-blue-200 bg-blue-50 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Link>
                          <Link
                            href={`/admin/bikes/${bike.id}`}
                            className="inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 text-sm font-semibold text-amber-800 hover:bg-amber-100"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Link>
                          <select
                            value={bike.isAvailable ? "available" : "unavailable"}
                            disabled={saving}
                            onChange={(event) => setAvailability(bike, event.target.value === "available")}
                            className={cn(
                              "h-9 w-full rounded-lg border px-2 text-sm font-semibold outline-none",
                              bike.isAvailable
                                ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                                : "border-rose-200 bg-rose-50 text-rose-700",
                            )}
                          >
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                          </select>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(bike)}
                            className="h-9 w-full justify-center gap-1.5 rounded-lg border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-4 mt-6">
            <p className="text-sm text-zinc-500">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pagination.page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                Previous
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={pagination.totalPages <= pagination.page || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
        ) : null}

        {showForm ? (
        <BikeAdminForm
          bikeId={bikeId}
          onSaved={() => {
            void fetchBikes();
            void fetchCatalog();
            setSuccess(bikeId ? "Bike updated successfully." : "Bike created successfully.");
          }}
        />
        ) : null}

      </div>
    </div>
  );
}
