"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function PreviewInterface() {
  const interfaceRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      interfaceRef.current,
      { opacity: 0, scale: 0.95, y: 30 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: interfaceRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <div
      ref={interfaceRef}
      className="relative rounded-[28px] overflow-hidden"
      style={{
        background: "rgba(11, 16, 32, 0.9)",
        border: "1px solid rgba(255,255,255,0.08)",
        boxShadow: "0 40px 100px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        opacity: 0,
      }}
    >
      {/* Window chrome */}
      <div
        className="flex items-center justify-between px-5 py-3"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ background: "#ff5f57" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#febc2e" }} />
          <div className="w-3 h-3 rounded-full" style={{ background: "#28c840" }} />
        </div>
        <div
          className="flex items-center gap-2 rounded-lg px-3 py-1"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="w-2 h-2 rounded-full" style={{ background: "#3B7BFF", boxShadow: "0 0 6px #3B7BFF" }} />
          <span className="text-xs" style={{ color: "var(--text-muted)" }}>mockflow.app/export/preview</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[11px] font-medium px-3 py-1 rounded-md" style={{ color: "var(--text-muted)", background: "rgba(255,255,255,0.04)" }} data-cursor-hover>
            Share
          </button>
          <button className="text-[11px] font-medium px-3 py-1 rounded-md" style={{ color: "var(--bg-primary)", background: "#3B7BFF" }} data-cursor-hover>
            Export
          </button>
        </div>
      </div>

      {/* Main editor area */}
      <div className="flex" style={{ height: "460px" }}>
        {/* Left panel */}
        <div
          className="flex flex-col gap-0"
          style={{ width: "220px", borderRight: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}
        >
          {/* Panel header */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Templates</p>
          </div>

          {/* Template list */}
          {["Midnight Studio", "Floating Dark", "Light Studio", "Glass Room"].map((name, i) => (
            <div
              key={name}
              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors"
              style={{
                background: i === 0 ? "rgba(59,123,255,0.1)" : "transparent",
                borderLeft: i === 0 ? "2px solid #3B7BFF" : "2px solid transparent",
              }}
              data-cursor-hover
            >
              <div
                className="rounded-md flex-shrink-0"
                style={{
                  width: "32px",
                  height: "32px",
                  background: ["#1e3a8a", "#1e1b4b", "#f8fafc", "#0f172a"][i],
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <div>
                <p className="text-xs font-medium" style={{ color: i === 0 ? "var(--text-primary)" : "var(--text-secondary)" }}>{name}</p>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>Environment</p>
              </div>
            </div>
          ))}

          {/* Separator */}
          <div className="px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", marginTop: "auto" }}>
            <p className="text-xs font-medium mb-3" style={{ color: "var(--text-muted)" }}>Settings</p>
            {["4K Resolution", "60fps", "MP4 + GIF"].map((opt, i) => (
              <div key={opt} className="flex items-center justify-between py-1.5">
                <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{opt}</span>
                <div
                  className="rounded-full"
                  style={{
                    width: "28px",
                    height: "16px",
                    background: i === 0 ? "#3B7BFF" : "rgba(255,255,255,0.1)",
                    position: "relative",
                  }}
                >
                  <div
                    className="absolute top-[2px] rounded-full"
                    style={{
                      width: "12px",
                      height: "12px",
                      background: "white",
                      left: i === 0 ? "14px" : "2px",
                      transition: "left 0.2s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview canvas */}
        <div
          className="flex-1 flex items-center justify-center relative"
          style={{
            background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(59,123,255,0.04), transparent)",
          }}
        >
          {/* Background environment */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(160deg, rgba(11,16,32,0.8), rgba(6,7,10,0.95))",
            }}
          />

          {/* Subtle grid */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)
              `,
              backgroundSize: "40px 40px",
            }}
          />

          {/* Phone mockup preview */}
          <div
            className="relative z-10"
            style={{
              width: "140px",
              height: "290px",
              transform: "perspective(800px) rotateY(-8deg) rotateX(4deg)",
            }}
          >
            <div
              className="w-full h-full rounded-[24px] overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1A1D2E, #080A12)",
                border: "1px solid rgba(255,255,255,0.14)",
                boxShadow: "0 30px 80px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <div
                className="absolute inset-[5px] rounded-[20px] overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0F172A, #020817)" }}
              >
                {/* Mini app */}
                <div className="w-full h-full p-2 flex flex-col gap-1.5">
                  <div className="rounded" style={{ width: "50%", height: "6px", background: "rgba(255,255,255,0.15)", marginTop: "16px" }} />
                  <div
                    className="rounded-lg p-2"
                    style={{ background: "linear-gradient(135deg, #1e3a8a, #3b82f6)", boxShadow: "0 4px 12px rgba(59,130,246,0.3)" }}
                  >
                    <div className="rounded" style={{ width: "70%", height: "5px", background: "rgba(255,255,255,0.6)", marginBottom: "4px" }} />
                    <div className="rounded" style={{ width: "40%", height: "10px", background: "rgba(255,255,255,0.9)" }} />
                  </div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-1.5 py-1">
                      <div className="rounded-full flex-shrink-0" style={{ width: "14px", height: "14px", background: "rgba(59,123,255,0.3)" }} />
                      <div className="flex-1">
                        <div className="rounded" style={{ width: "80%", height: "4px", background: "rgba(255,255,255,0.15)" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="absolute top-[6px] left-1/2 -translate-x-1/2 z-10"
                style={{ width: "40px", height: "10px", background: "#000", borderRadius: "5px" }}
              />
            </div>

            {/* Reflection */}
            <div
              className="absolute inset-0 rounded-[24px]"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* Render progress badge */}
          <div
            className="absolute bottom-4 right-4 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(6,7,10,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <div className="relative w-3 h-3">
              <div
                className="absolute inset-0 rounded-full"
                style={{ background: "#10b981", animation: "shimmer 2s ease-in-out infinite" }}
              />
            </div>
            <span className="text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
              Rendering — 94%
            </span>
          </div>

          {/* Timestamp badge */}
          <div
            className="absolute top-4 left-4 flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(6,7,10,0.9)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(12px)",
            }}
          >
            <span className="text-[11px]" style={{ color: "var(--text-muted)", fontFamily: "monospace" }}>
              00:12 / 00:30
            </span>
          </div>
        </div>

        {/* Right panel */}
        <div
          className="flex flex-col"
          style={{ width: "200px", borderLeft: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}
        >
          <div className="px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Export Options</p>
          </div>

          <div className="p-4 flex flex-col gap-3">
            {[
              { format: "MP4", size: "4K", icon: "▶", color: "#3B7BFF" },
              { format: "GIF", size: "720p", icon: "◉", color: "#8B5CF6" },
              { format: "WebM", size: "1080p", icon: "◈", color: "#10b981" },
            ].map((exp) => (
              <div
                key={exp.format}
                className="flex items-center gap-2 p-2.5 rounded-xl cursor-pointer transition-all"
                style={{
                  background: exp.format === "MP4" ? `${exp.color}12` : "transparent",
                  border: `1px solid ${exp.format === "MP4" ? exp.color + "30" : "rgba(255,255,255,0.06)"}`,
                }}
                data-cursor-hover
              >
                <span style={{ color: exp.color, fontSize: "14px" }}>{exp.icon}</span>
                <div>
                  <p className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{exp.format}</p>
                  <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>{exp.size}</p>
                </div>
              </div>
            ))}

            <div
              className="mt-2 p-3 rounded-xl flex flex-col gap-2"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>File size estimate</p>
              <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>~48 MB</p>
              <div
                className="w-full rounded-full overflow-hidden"
                style={{ height: "4px", background: "rgba(255,255,255,0.08)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{ width: "70%", background: "linear-gradient(to right, #3B7BFF, #8B5CF6)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PreviewSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      headlineRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="preview" className="section-padding" style={{ background: "var(--bg-secondary)" }}>
      <div className="container-wide">
        <div ref={headlineRef} className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6" style={{ opacity: 0 }}>
          <div>
            <div className="tag w-fit mb-6">
              <span className="rounded-full inline-block" style={{ width: "6px", height: "6px", background: "#3B7BFF" }} />
              Live Preview
            </div>
            <h2 className="text-headline">
              <span className="gradient-text">See exactly what</span>
              <br />
              <span className="gradient-text">you&apos;ll get.</span>
            </h2>
          </div>
          <p className="text-body-lg max-w-[320px] lg:pb-1" style={{ color: "var(--text-secondary)" }}>
            Real-time render preview with full export controls. What you see is exactly what you&apos;ll download.
          </p>
        </div>

        <PreviewInterface />
      </div>
    </section>
  );
}
