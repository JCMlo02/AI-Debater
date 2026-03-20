import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 px-8 pb-5 pt-10 backdrop-blur-xl">
      <div className="mx-auto flex max-w-[900px] flex-wrap items-start justify-between gap-6">
        <div className="flex flex-col gap-1 text-lg">
          <span className="flex items-center gap-2 font-extrabold text-white">
            <Image
              src="/images/iDebateLogo.png"
              alt="iDebate Logo"
              width={24}
              height={24}
              style={{ mixBlendMode: "screen" }}
            />
            iDebate
          </span>
          <p className="mt-1 text-xs text-white/40">
            Sharpen your mind against machines.
          </p>
        </div>
        <div className="flex gap-5">
          <Link
            href="/"
            className="text-sm font-semibold text-white/55 no-underline transition-colors hover:text-white"
          >
            Home
          </Link>
          <Link
            href="/login"
            className="text-sm font-semibold text-white/55 no-underline transition-colors hover:text-white"
          >
            Log In
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold text-white/55 no-underline transition-colors hover:text-white"
          >
            Sign Up
          </Link>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-[900px] border-t border-white/5 pt-4 text-center">
        <p className="text-xs text-white/25">
          © {new Date().getFullYear()} DebateWithAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
