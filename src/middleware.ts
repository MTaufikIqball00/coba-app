import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  // Paths that do not require authentication
  const publicPaths = ["/login", "/register", "/forgot-password", "/api/login"];

  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // If the user is logged in (has a token)
  if (authToken) {
    // If they try to access the root, login, or register page, redirect to dashboard
    if (
      pathname === "/" ||
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }
  // If the user is not logged in (no token)
  else {
    // And they are trying to access a protected path
    if (!isPublicPath && pathname !== "/") {
      // Redirect them to the login page
      return NextResponse.redirect(new URL("/login", request.url));
    }
    // As requested, if user goes to the root path, redirect to login
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except for static files, images, and the favicon.
    "/((?!_next/static|_next/image|favicon.ico|assets/|file.svg|globe.svg|next.svg|vercel.svg|window.svg).*)",
  ],
};
