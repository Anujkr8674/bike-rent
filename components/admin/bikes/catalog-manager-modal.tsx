"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CatalogItem = { id: string; name: string; slug: string };

type CatalogManagerModalProps = {
  open: boolean;
  kind: "brand" | "category";
  onClose: () => void;
  onUpdated?: () => void;
};

export function CatalogManagerModal({ open, kind, onClose, onUpdated }: CatalogManagerModalProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const endpoint = kind === "brand" ? "/api/admin/bike-brands" : "/api/admin/bike-categories";
  const title = kind === "brand" ? "Manage Brands" : "Manage Categories";
  const placeholder = kind === "brand" ? "e.g. Hero, TVS, Bajaj" : "e.g. Sports, Commuter, Scooter";
  const pillClass =
    kind === "brand"
      ? "border-sky-200 bg-sky-50 text-sky-800"
      : "border-violet-200 bg-violet-50 text-violet-800";

  const loadItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(endpoint, { credentials: "include", cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load list.");
      setItems(kind === "brand" ? data.brands ?? [] : data.categories ?? []);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Failed to load list.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!open) return;
    setName("");
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, kind]);

  const handleAdd = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save.");
      setName("");
      await loadItems();
      onUpdated?.();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Failed to save.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: CatalogItem) => {
    const confirmed = window.confirm(`Delete "${item.name}"?`);
    if (!confirmed) return;

    setDeletingId(item.id);
    setError(null);
    try {
      const response = await fetch(`${endpoint}?id=${encodeURIComponent(item.id)}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to delete.");
      await loadItems();
      onUpdated?.();
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Failed to delete.");
    } finally {
      setDeletingId(null);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-zinc-950/60 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Bike CMS</p>
            <h3 className="mt-1 text-xl font-bold text-zinc-900">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 p-2 text-zinc-500 hover:bg-zinc-50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4 p-5">
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder={placeholder}
              className="flex-1 rounded-xl border border-zinc-200 px-4 py-3 text-sm outline-none focus:border-[#FF653F]/50"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleAdd();
                }
              }}
            />
            <Button type="button" onClick={() => void handleAdd()} disabled={saving} className="gap-2 shrink-0">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add
            </Button>
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Added {kind === "brand" ? "brands" : "categories"} ({items.length})
            </p>
            {loading ? (
              <p className="mt-3 text-sm text-zinc-500">Loading...</p>
            ) : items.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-500">Nothing added yet.</p>
            ) : (
              <div className="mt-3 flex max-h-48 flex-wrap gap-2 overflow-y-auto">
                {items.map((item) => (
                  <span
                    key={item.id}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border py-1.5 pl-3 pr-1.5 text-sm font-medium",
                      pillClass,
                    )}
                  >
                    {item.name}
                    <button
                      type="button"
                      aria-label={`Delete ${item.name}`}
                      disabled={deletingId === item.id}
                      onClick={() => void handleDelete(item)}
                      className="rounded-full p-0.5 transition hover:bg-white/80 disabled:opacity-50"
                    >
                      {deletingId === item.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <X className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
