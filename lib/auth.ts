import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/jwt";

export async function getSession() {
  const token = (await cookies()).get("nb_session")?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
