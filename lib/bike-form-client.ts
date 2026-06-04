import type { BikeAdminFormValues } from "@/lib/admin-bike";
import { normalizeBikeForm } from "@/lib/admin-bike";

export function makeBikeFormData(
  values: BikeAdminFormValues,
  primaryImage: File | null,
  galleryImages: File[],
  removeGalleryUrls: string[],
  removePrimaryImage: boolean,
) {
  const formData = new FormData();
  formData.append("payload", JSON.stringify(normalizeBikeForm(values)));
  if (primaryImage) formData.append("primaryImage", primaryImage);
  galleryImages.forEach((file) => formData.append("galleryImages", file));
  formData.append("removeGalleryUrls", JSON.stringify(removeGalleryUrls));
  formData.append("removePrimaryImage", JSON.stringify(removePrimaryImage));
  return formData;
}

export function submitBikeMutation(
  method: "POST" | "PATCH" | "DELETE",
  url: string,
  body?: FormData,
  onProgress?: (progress: number) => void,
) {
  return new Promise<{ ok: boolean; data: unknown; status: number }>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url);
    xhr.withCredentials = true;
    xhr.responseType = "json";

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (!event.lengthComputable) return;
        onProgress(Math.round((event.loaded / event.total) * 100));
      };
    }

    xhr.onload = () => {
      resolve({
        ok: xhr.status >= 200 && xhr.status < 300,
        data: xhr.response,
        status: xhr.status,
      });
    };

    xhr.onerror = () => reject(new Error("Network error while saving bike."));
    xhr.send(body);
  });
}
