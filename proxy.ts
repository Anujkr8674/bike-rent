import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/jwt";

const adminProtectedPrefix = "/admin";
const adminPublic = "/admin/login";

export function proxy(req: NextRequest) {
  const token = req.cookies.get("nb_session")?.value;
  const session = token ? verifySessionToken(token) : null;
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith(adminProtectedPrefix) &&
    !pathname.startsWith(adminPublic) &&
    session?.role !== "ADMIN"
  ) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  return res;
}

export const config = {
  matcher: ["/admin/:path*"],
};
