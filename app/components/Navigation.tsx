"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

const navItems = [
  { label: "Product", href: "#showcase" },
  { label: "How it Works", href: "#process" },
  { label: "Templates", href: "#templates" },
  { label: "Pricing", href: "#cta" },
];

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-[9990] transition-all duration-500 ${
        scrolled
          ? "backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      }`}
      style={{
        background: scrolled
          ? "rgba(6, 7, 10, 0.75)"
          : "transparent",
      }}
    >
      <div className="container-wide">
        <div className="flex items-center justify-between h-[68px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group" data-cursor-hover>
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #3B7BFF, #8B5CF6)",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="2" y="1" width="4" height="12" rx="1" fill="white" opacity="0.9" />
                <rect x="8" y="3" width="4" height="8" rx="1" fill="white" opacity="0.5" />
              </svg>
            </div>
            <span
              className="font-semibold tracking-tight text-[15px]"
              style={{ color: "var(--text-primary)" }}
            >
              MockFlow
            </span>
          </Link>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{ color: "var(--text-secondary)" }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-primary)")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "var(--text-secondary)")
                }
                data-cursor-hover
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              href="#"
              className="hidden md:block text-sm font-medium px-4 py-2 transition-colors duration-200"
              style={{ color: "var(--text-secondary)" }}
              data-cursor-hover
            >
              Sign in
            </Link>
            <Link
              href="#cta"
              className="btn-primary !py-2.5 !px-5 !text-sm"
              data-cursor-hover
            >
              Get started
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
