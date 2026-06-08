"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, X, Pencil, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type CatalogItem = { id: string; name: string; slug: string; imageUrl?: string | null };

type CatalogManagerModalProps = {
  open: boolean;
  kind: "brand" | "category";
  onClose: () => void;
  onUpdated?: () => void;
};

export function CatalogManagerModal({ open, kind, onClose, onUpdated }: CatalogManagerModalProps) {
  const [items, setItems] = useState<CatalogItem[]>([]);
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);
  const [deleteImage, setDeleteImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  const endpoint = kind === "brand" ? "/api/admin/bike-brands" : "/api/admin/bike-categories";
  const title = kind === "brand" ? "Manage Brands" : "Manage Categories";
  const placeholder = kind === "brand" ? "e.g. Hero, TVS, Bajaj" : "e.g. Sports, Commuter, Scooter";
  const pillClass =
    kind === "brand"
      ? "border-sky-500/20 bg-sky-500/10 text-sky-300"
      : "border-violet-500/20 bg-violet-500/10 text-violet-300";

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
    setImageFile(null);
    setImagePreview(null);
    setEditingItem(null);
    setDeleteImage(false);
    setLightboxUrl(null);
    void loadItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, kind]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleStartEdit = (item: CatalogItem) => {
    setEditingItem(item);
    setName(item.name);
    setImageFile(null);
    setImagePreview(null);
    setDeleteImage(false);
  };

  const handleCancelEdit = () => {
    setEditingItem(null);
    setName("");
    setImageFile(null);
    setImagePreview(null);
    setDeleteImage(false);
  };

  const handleSave = async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("Name is required.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const isEditing = !!editingItem;
      const method = isEditing ? "PATCH" : "POST";
      const url = isEditing ? `${endpoint}?id=${encodeURIComponent(editingItem.id)}` : endpoint;

      const headers: Record<string, string> = {};
      let body: string | FormData;

      if (kind === "category") {
        const formData = new FormData();
        formData.append("name", trimmed);
        if (imageFile) {
          formData.append("image", imageFile);
        }
        if (isEditing) {
          formData.append("deleteImage", deleteImage ? "true" : "false");
        }
        body = formData;
      } else {
        headers["Content-Type"] = "application/json";
        body = JSON.stringify({ name: trimmed });
      }

      const response = await fetch(url, {
        method,
        credentials: "include",
        headers,
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to save.");
      setName("");
      setImageFile(null);
      setImagePreview(null);
      setEditingItem(null);
      setDeleteImage(false);
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

    if (editingItem?.id === item.id) {
      handleCancelEdit();
    }

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
      <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl">
        <div className="flex items-center justify-between border-b border-white/5 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Bike CMS</p>
            <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 p-2 text-zinc-400 hover:bg-[#111111]/5"
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
              className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm outline-none focus:border-[#FF653F]/50"
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  void handleSave();
                }
              }}
            />
            <Button type="button" onClick={() => void handleSave()} disabled={saving} className="gap-2 shrink-0">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : editingItem ? null : <Plus className="h-4 w-4" />}
              {editingItem ? "Save" : "Add"}
            </Button>
            {editingItem ? (
              <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={saving} className="shrink-0">
                Cancel
              </Button>
            ) : null}
          </div>

          {kind === "category" && (
            <div className="rounded-xl border border-dashed border-white/10 p-4 transition-all hover:border-[#FF653F]/30 bg-[#111111]/5/50">
              <div className="flex items-center gap-4">
                {imagePreview ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-[#111111] animate-in fade-in zoom-in-95 duration-200">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxUrl(imagePreview)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setImageFile(null);
                        setImagePreview(null);
                      }}
                      className="absolute right-0.5 top-0.5 rounded-full bg-black/60 p-0.5 text-white hover:bg-black transition-colors"
                      aria-label="Remove image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : editingItem?.imageUrl && !deleteImage ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-[#111111] animate-in fade-in zoom-in-95 duration-200">
                    <img
                      src={editingItem.imageUrl}
                      alt="Existing"
                      className="h-full w-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                      onClick={() => setLightboxUrl(editingItem.imageUrl ?? null)}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setDeleteImage(true);
                      }}
                      className="absolute right-0.5 top-0.5 rounded-full bg-rose-600 p-0.5 text-white hover:bg-rose-700 transition-colors animate-in fade-in zoom-in-95 duration-200"
                      title="Remove current image"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-white/10 bg-[#111111] text-zinc-400 animate-in fade-in zoom-in-95 duration-200">
                    <Plus className="h-5 w-5" />
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <p className="text-xs font-semibold text-zinc-300">
                    {editingItem ? "Update Image" : "Category Image (Optional)"}
                  </p>
                  <p className="text-[10px] text-zinc-400">
                    {editingItem?.imageUrl && !deleteImage
                      ? "Current image is active. Choose a new one to replace."
                      : "Drag & drop or select an image file"}
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="category-image-input"
                  />
                  <label
                    htmlFor="category-image-input"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border border-white/10 bg-[#111111] px-2.5 py-1 text-xs font-medium text-zinc-400 shadow-xl shadow-black/40 hover:bg-[#111111]/5 hover:text-zinc-300 transition"
                  >
                    Select File
                  </label>
                </div>
              </div>
            </div>
          )}

          {error ? <p className="text-sm text-rose-400">{error}</p> : null}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Added {kind === "brand" ? "brands" : "categories"} ({items.length})
            </p>
            {loading ? (
              <p className="mt-3 text-sm text-zinc-400">Loading...</p>
            ) : items.length === 0 ? (
              <p className="mt-3 text-sm text-zinc-400">Nothing added yet.</p>
            ) : (
              <div className="mt-3 max-h-60 overflow-y-auto border border-white/10 rounded-2xl divide-y divide-white/5 bg-[#111111]/5/20">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center justify-between p-3 transition-colors",
                      editingItem?.id === item.id ? "bg-[#FF653F]/5" : "hover:bg-[#111111]/5/80"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      {kind === "category" && (
                        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#111111]/10 flex items-center justify-center">
                          {item.imageUrl ? (
                            <img
                              src={item.imageUrl}
                              alt={item.name}
                              className="h-full w-full object-cover cursor-zoom-in hover:opacity-90 transition-opacity"
                              onClick={() => setLightboxUrl(item.imageUrl ?? null)}
                            />
                          ) : (
                            <Tag className="h-5 w-5 text-zinc-400" />
                          )}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-zinc-200">{item.name}</p>
                        <p className="text-[10px] text-zinc-400">slug: {item.slug}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 pr-1">
                      <button
                        type="button"
                        onClick={() => handleStartEdit(item)}
                        className="rounded-lg p-2 text-zinc-400 hover:bg-[#111111] hover:text-zinc-200 border border-transparent hover:border-white/10 hover:shadow-xl shadow-black/40 transition"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={deletingId === item.id}
                        onClick={() => void handleDelete(item)}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-400 transition disabled:opacity-50"
                        title="Delete"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in duration-200 cursor-zoom-out"
          onClick={() => setLightboxUrl(null)}
        >
          <div className="relative max-w-3xl max-h-[85vh] overflow-hidden rounded-2xl bg-zinc-900 shadow-2xl animate-in zoom-in-95 duration-250">
            <img
              src={lightboxUrl}
              alt="Fullscreen preview"
              className="max-h-[80vh] w-auto max-w-full object-contain"
            />
            <button
              type="button"
              onClick={() => setLightboxUrl(null)}
              className="absolute right-3 top-3 rounded-full bg-black/50 p-2 text-white hover:bg-black/80 transition-colors"
              aria-label="Close fullscreen preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
