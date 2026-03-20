"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Loader2, Swords } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <>
      <style>{`
        .nav-root {
          font-family: var(--font-syne), sans-serif;
        }
        .nav-signout-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          font-family: var(--font-syne), sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          cursor: pointer;
          transition: background 0.15s, color 0.15s, border-color 0.15s;
        }
        .nav-signout-btn:hover {
          background: rgba(255,255,255,0.08);
          color: #fff;
          border-color: rgba(255,255,255,0.15);
        }
        .nav-login-link {
          padding: 8px 16px;
          border-radius: 10px;
          font-family: var(--font-syne), sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          color: rgba(255,255,255,0.6);
          text-decoration: none;
          transition: color 0.15s;
        }
        .nav-login-link:hover {
          color: #fff;
        }
        .nav-signup-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 9px 20px;
          border-radius: 10px;
          background: linear-gradient(135deg, #00d4ff, #0062ff);
          font-family: var(--font-syne), sans-serif;
          font-size: 0.85rem;
          font-weight: 700;
          color: #fff;
          text-decoration: none;
          box-shadow: 0 2px 16px rgba(0,114,255,0.35);
          transition: transform 0.15s, box-shadow 0.15s;
        }
        .nav-signup-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 24px rgba(0,114,255,0.5);
        }
      `}</style>

      <nav className="nav-root sticky top-0 z-50 flex items-center justify-between border-b border-white/10 bg-black/30 px-4 py-3 backdrop-blur-xl sm:px-8 sm:py-4">
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            textDecoration: "none",
          }}
        >
          <Image
            src="/images/iDebateLogo.png"
            alt="iDebate Logo"
            width={32}
            height={32}
            style={{
              mixBlendMode: "screen",
              filter: "drop-shadow(0 0 8px rgba(0,212,255,0.7))",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-syne), sans-serif",
              fontWeight: 800,
              fontSize: "1.1rem",
              color: "#fff",
              letterSpacing: "-0.02em",
            }}
          >
            iDebate
          </span>
        </Link>

        {/* Right side */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {status === "loading" ? (
            <Loader2
              size={18}
              style={{
                color: "rgba(255,255,255,0.4)",
                animation: "spin 1s linear infinite",
              }}
            />
          ) : session?.user ? (
            <>
              <span
                style={{
                  fontFamily: "var(--font-syne), sans-serif",
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.45)",
                  display: "none",
                }}
                className="sm:inline-block"
              >
                {session.user.name || session.user.email}
              </span>
              <button
                className="nav-signout-btn"
                onClick={() => signOut({ callbackUrl: "/" })}
              >
                <LogOut size={14} />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="nav-login-link">
                Log In
              </Link>
              <Link href="/signup" className="nav-signup-btn">
                <Swords size={14} />
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
}
