export async function logoutCompletely(redirectTo = "/") {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  window.location.href = redirectTo;
}

export type AuthUser = {
  id: string;
  email: string;
  fullName: string | null;
  role: "USER" | "ADMIN";
  phone: string | null;
  isVerified: boolean;
};

export async function fetchCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me", { credentials: "include", cache: "no-store" });
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}
