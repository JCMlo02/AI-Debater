"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Loader2 } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl sm:px-8 sm:py-4">
      <Link href="/" className="flex items-center gap-1 text-xl no-underline">
        <Image
          src="/images/iDebateLogo.png"
          alt="iDebate Logo"
          width={32}
          height={32}
          style={{ mixBlendMode: "screen" }}
          className="drop-shadow-[0_0_8px_rgba(0,212,255,0.6)]"
        />
        <span className="font-extrabold tracking-tight text-white">
          iDebate
        </span>
      </Link>

      <div className="flex items-center gap-3 sm:gap-4">
        {status === "loading" ? (
          <Loader2 size={20} className="animate-spin text-white/50" />
        ) : session?.user ? (
          <>
            <span className="hidden text-sm font-semibold text-white/70 sm:inline">
              {session.user.name || session.user.email}
            </span>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2 text-sm font-semibold text-white/70 transition-colors hover:text-white sm:px-4"
            >
              Log In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-gradient-to-r from-cyan-400 to-blue-600 px-4 py-2 text-sm font-bold text-white shadow-[0_2px_12px_rgba(0,114,255,0.3)] transition-transform hover:scale-105 sm:px-5"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
