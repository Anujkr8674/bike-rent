"use client";

import { useEffect, useState } from "react";
import type { BikeItem } from "@/lib/bikes";
import { ranchiBikes } from "@/lib/bikes";

export function useCatalogBikes(limit?: number) {
  const fallback = limit ? ranchiBikes.slice(0, limit) : ranchiBikes;
  const [bikes, setBikes] = useState<BikeItem[]>(fallback);

  useEffect(() => {
    let active = true;
    fetch("/api/bikes", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { bikes?: BikeItem[] }) => {
        if (!active || !Array.isArray(data.bikes) || !data.bikes.length) return;
        setBikes(limit ? data.bikes.slice(0, limit) : data.bikes);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [limit]);

  return bikes;
}
