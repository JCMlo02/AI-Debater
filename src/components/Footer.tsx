"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();

  return (
    <>
      <style>{`
        .footer-root {
          font-family: var(--font-syne), sans-serif;
        }
        .footer-link {
          font-family: var(--font-syne), sans-serif;
          font-size: 0.82rem;
          font-weight: 600;
          color: rgba(255,255,255,0.4);
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-link:hover {
          color: rgba(255,255,255,0.85);
        }
        .footer-ext-link {
          font-family: var(--font-space-mono), monospace;
          font-size: 0.72rem;
          color: rgba(255,255,255,0.3);
          text-decoration: none;
          transition: color 0.15s;
        }
        .footer-ext-link:hover {
          color: rgba(255,255,255,0.65);
        }
      `}</style>

      <footer
        className="footer-root"
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          background: "rgba(0,0,0,0.3)",
          backdropFilter: "blur(20px)",
          padding: "36px 32px 28px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 24,
          }}
        >
          {/* Brand */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
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
                width={22}
                height={22}
                style={{
                  mixBlendMode: "screen",
                  filter: "drop-shadow(0 0 6px rgba(0,212,255,0.6))",
                }}
              />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#fff",
                  letterSpacing: "-0.02em",
                }}
              >
                iDebate
              </span>
            </Link>
            <p
              style={{
                fontFamily: "var(--font-space-mono), monospace",
                fontSize: "0.7rem",
                color: "rgba(255,255,255,0.28)",
                marginTop: 4,
              }}
            >
              Sharpen your mind against machines.
            </p>
          </div>

          {/* Nav links — hide auth links when logged in */}
          <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
            <Link href="/" className="footer-link">
              Home
            </Link>
            {!session?.user && (
              <>
                <Link href="/login" className="footer-link">
                  Log In
                </Link>
                <Link href="/signup" className="footer-link">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          style={{
            maxWidth: 900,
            margin: "20px auto 0",
            paddingTop: 16,
            borderTop: "1px solid rgba(255,255,255,0.05)",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 8,
          }}
        >
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            © {new Date().getFullYear()} DebateWithAI. All rights reserved.
          </p>
          <p
            style={{
              fontFamily: "'Space Mono', monospace",
              fontSize: "0.68rem",
              color: "rgba(255,255,255,0.2)",
            }}
          >
            Powered by{" "}
            <a
              href="https://huggingface.co/inference-api"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-ext-link"
            >
              HuggingFace
            </a>
            {" & "}
            <a
              href="https://huggingface.co/Qwen/Qwen2.5-7B-Instruct"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-ext-link"
            >
              Meta Llama 3
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
