// middleware.ts
export { auth as middleware } from "@/auth";

export const config = {
  matcher: ["/debate/:path*", "/leaderboard/:path*"]
};