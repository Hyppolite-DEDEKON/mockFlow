"use client";

import Link from "next/link";

const footerLinks = {
  Product: ["Features", "Templates", "Pricing", "Changelog"],
  Company: ["About", "Blog", "Careers", "Press"],
  Support: ["Documentation", "Community", "Contact", "Status"],
};

export default function Footer() {
  return (
    <footer
      className="relative"
      style={{
        background: "var(--bg-primary)",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="container-wide py-16">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4 w-fit" data-cursor-hover>
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #3B7BFF, #8B5CF6)" }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="2" y="1" width="4" height="12" rx="1" fill="white" opacity="0.9" />
                  <rect x="8" y="3" width="4" height="8" rx="1" fill="white" opacity="0.5" />
                </svg>
              </div>
              <span className="font-semibold text-[15px]" style={{ color: "var(--text-primary)" }}>
                MockFlow
              </span>
            </Link>
            <p className="text-sm max-w-[240px] mb-6" style={{ color: "var(--text-secondary)", lineHeight: "1.65" }}>
              Cinematic phone mockup videos for modern app creators. Built for speed. Designed for impact.
            </p>
            <div className="flex items-center gap-3">
              {["tw", "gh", "yt", "in"].map((social) => (
                <Link
                  key={social}
                  href="#"
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "var(--text-muted)",
                  }}
                  data-cursor-hover
                >
                  {social}
                </Link>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <p
                className="text-label text-[11px] mb-4"
                style={{ color: "var(--text-muted)" }}
              >
                {category}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--text-primary)")
                      }
                      onMouseLeave={(e) =>
                        ((e.target as HTMLElement).style.color = "var(--text-secondary)")
                      }
                      data-cursor-hover
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-16 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            © 2026 MockFlow. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: "var(--text-muted)" }}
                data-cursor-hover
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
