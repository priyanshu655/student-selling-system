import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Define Route Groups
  const isAuthPage = pathname === "/login" || pathname === "/register";
  const isProtectedRoute = ["/dashboard", "/seller", "/sell"].some(route => 
    pathname.startsWith(route)
  );
  const isApiRoute = pathname.startsWith("/api/");
  const isPublicApi = pathname.startsWith("/api/auth/login") || pathname.startsWith("/api/auth/register");

  // 2. Protect API Routes (Security Boost)
  if (isApiRoute && !isPublicApi && !token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. Handle Page Redirects
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/seller/:path*",
    "/sell-product/:path*",
    "/login",
    "/register",
  ],
};