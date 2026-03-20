import { auth } from "@/auth";
import { NextResponse } from "next/server";

const publicOnlyRoutes = ["/", "/login", "/signup"];
const protectedRoutes = ["/dashboard", "/debate", "/leaderboard"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Logged-in users trying to access public-only pages → redirect to /dashboard
  if (isLoggedIn && publicOnlyRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  // Unauthenticated users trying to access protected pages → redirect to /login
  if (
    !isLoggedIn &&
    protectedRoutes.some((route) => pathname.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/login", req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/",
    "/login",
    "/signup",
    "/dashboard/:path*",
    "/debate/:path*",
    "/leaderboard/:path*",
  ],
};
