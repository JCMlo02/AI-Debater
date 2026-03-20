export { auth as proxy } from "@/auth";

export const config = {
  matcher: ["/debate/:path*", "/leaderboard/:path*"],
};
