"use client";

import { useCallback, useEffect, useMemo, useState, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import type { BikeItem } from "@/lib/bikes";
import { ranchiBikes } from "@/lib/bikes";
import { buildRentalSearchParams } from "@/lib/pricing";
import { BikeCard } from "@/components/bikes/bike-card";
import { BikeFilters, defaultFilters, type FilterState } from "@/components/bikes/bike-filters";
import { BookingSearchBar } from "@/components/home/booking-search-bar";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { useDefaultPickupDrop, useRentalWindow } from "@/hooks/use-rental-window";

const PAGE_SIZE = 16;

function BikesContent({ embedded = false }: { embedded?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const defaults = useDefaultPickupDrop();
  const { pickup: urlPickup, drop: urlDrop, duration, days } = useRentalWindow();

  const [pickup, setPickup] = useState(urlPickup || defaults.pickup);
  const [drop, setDrop] = useState(urlDrop || defaults.drop);
  const [catalog, setCatalog] = useState<BikeItem[]>([]);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    ...defaultFilters,
    category: params.get("category") || "all",
  });
  const [mobileFilters, setMobileFilters] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (urlPickup) setPickup(urlPickup);
    if (urlDrop) setDrop(urlDrop);
  }, [urlPickup, urlDrop]);

  const pushRentalParams = useCallback(
    (nextPickup: string, nextDrop: string, nextCategory?: string) => {
      const qs = buildRentalSearchParams({
        pickup: nextPickup,
        drop: nextDrop,
        category: nextCategory ?? filters.category,
      });
      router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
    },
    [router, pathname, filters.category],
  );

  const handlePickupChange = (value: string) => {
    setPickup(value);
    pushRentalParams(value, drop);
    setPage(1);
  };

  const handleDropChange = (value: string) => {
    setDrop(value);
    pushRentalParams(pickup, value);
    setPage(1);
  };

  const handleFiltersChange = (next: FilterState) => {
    setFilters(next);
    setPage(1);
    const qs = buildRentalSearchParams({ pickup, drop, category: next.category });
    router.replace(`${pathname}?${qs.toString()}`, { scroll: false });
  };

  useEffect(() => {
    let active = true;
    fetch("/api/bikes", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { bikes?: BikeItem[] }) => {
        if (!active) return;
        if (Array.isArray(data.bikes)) {
          setCatalog(data.bikes.length ? data.bikes : ranchiBikes);
        }
      })
      .catch(() => {
        if (active) setCatalog(ranchiBikes);
      })
      .finally(() => {
        if (active) setLoadingCatalog(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const searchQuery = params.get("q") || "";

  const filtered = useMemo(() => {
    return catalog.filter((b) => {
      if (searchQuery) {
        const lowerQ = searchQuery.toLowerCase();
        if (!b.name.toLowerCase().includes(lowerQ) && !b.brand.toLowerCase().includes(lowerQ)) {
          return false;
        }
      }
      if (filters.category !== "all" && b.category.toLowerCase() !== filters.category.toLowerCase()) return false;
      if (filters.fuelType !== "all" && b.fuelType !== filters.fuelType) return false;
      if (filters.transmission !== "all" && b.transmission !== filters.transmission) return false;
      if (b.pricePerDay > filters.maxPrice) return false;
      if (b.cc < filters.minCc) return false;
      return true;
    });
  }, [catalog, filters, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const rentalQs = buildRentalSearchParams({ pickup, drop, category: filters.category }).toString();

  return (
    <div className={embedded ? "page-wrap pb-14" : "page-wrap py-10 md:py-14"}>
      {!embedded && (
        <>
          <SectionReveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Fleet</p>
            <h1 className="section-title mt-2">Find your ride in Ranchi</h1>
            <p className="section-subtitle">
              {duration
                ? `${duration.label} rental · live totals on each bike`
                : "Set pickup & drop-off for live rent totals"}
            </p>
          </SectionReveal>
          <div className="mt-8">
            <BookingSearchBar dense syncFromUrl />
          </div>
        </>
      )}

      <div className="mt-10 flex items-start gap-8">
        <BikeFilters
          filters={filters}
          onChange={handleFiltersChange}
          mobileOpen={mobileFilters}
          onMobileClose={() => setMobileFilters(false)}
          pickup={pickup}
          drop={drop}
          onPickupChange={handlePickupChange}
          onDropChange={handleDropChange}
        />

        <div className="min-w-0 flex-1">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-medium text-zinc-600">
              {loadingCatalog ? (
                "Loading fleet..."
              ) : (
                <>
                  <span className="font-bold text-zinc-900">{filtered.length}</span> bikes available
                  {filtered.length > PAGE_SIZE ? (
                    <span className="text-zinc-400">
                      {" "}
                      · Page {page} of {totalPages}
                    </span>
                  ) : null}
                </>
              )}
            </p>
            <Button variant="outline" size="sm" className="lg:hidden" onClick={() => setMobileFilters(true)}>
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {filtered.length === 0 ? (
            <div className="glass rounded-2xl p-12 text-center">
              <p className="text-lg font-semibold text-zinc-800">No bikes match your filters</p>
              <p className="mt-2 text-sm text-zinc-500">Try adjusting price or category.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2">
                {paginated.map((bike, i) => (
                  <BikeCard
                    key={bike.id}
                    bike={bike}
                    days={days}
                    pickup={pickup}
                    drop={drop}
                    index={i}
                    queryString={rentalQs}
                  />
                ))}
              </div>

              {totalPages > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => setPage((p) => p - 1)}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <span className="text-sm font-medium text-zinc-600">
                    {page} / {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => p + 1)}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function BikesListing({ embedded = false }: { embedded?: boolean }) {
  return (
    <Suspense fallback={<div className="page-wrap py-20 animate-pulse text-zinc-400">Loading fleet...</div>}>
      <BikesContent embedded={embedded} />
    </Suspense>
  );
}
