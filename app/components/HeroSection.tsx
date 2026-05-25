"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

// Particles floating in hero
type ParticleData = { x: string; y: string; size: number; delay: number; alpha: number };

function Particle({ x, y, size, delay, alpha }: ParticleData) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: x,
        top: y,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(59,123,255,${alpha}), transparent)`,
        animation: `float-particle ${4 + delay}s ease-in-out ${delay}s infinite`,
      }}
    />
  );
}

// Ultra-realistic CSS phone mockup
function PhoneMockup() {
  const phoneRef = useRef<HTMLDivElement>(null);
  const screenRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const phone = phoneRef.current;
    if (!phone) return;

    // Floating animation
    gsap.to(phone, {
      y: -18,
      rotation: 0.8,
      duration: 4,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    // Mouse parallax
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2;
      const y = (clientY / innerHeight - 0.5) * 2;

      gsap.to(phone, {
        rotateY: x * 8,
        rotateX: -y * 5,
        duration: 1.2,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  return (
    <div
      ref={phoneRef}
      className="relative"
      style={{
        width: "300px",
        height: "620px",
        transformStyle: "preserve-3d",
        perspective: "1200px",
      }}
    >
      {/* Shadow */}
      <div
        className="absolute bottom-[-60px] left-1/2 -translate-x-1/2"
        style={{
          width: "180px",
          height: "40px",
          background: "radial-gradient(ellipse, rgba(0,0,0,0.6), transparent 70%)",
          filter: "blur(20px)",
          animation: "float 4s ease-in-out infinite",
        }}
      />

      {/* Phone body */}
      <div
        className="relative w-full h-full rounded-[44px] overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1A1D2E 0%, #0D0F1A 40%, #080A12 100%)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: `
            var(--shadow-phone),
            inset 0 1px 0 rgba(255,255,255,0.1),
            inset 0 -1px 0 rgba(0,0,0,0.5),
            0 0 0 0.5px rgba(255,255,255,0.06)
          `,
        }}
      >
        {/* Side highlight */}
        <div
          className="absolute top-0 left-0 w-[1px] h-full"
          style={{
            background: "linear-gradient(to bottom, rgba(255,255,255,0.2), transparent 40%, transparent 60%, rgba(255,255,255,0.05))",
          }}
        />

        {/* Top highlight */}
        <div
          className="absolute top-0 left-[10%] right-[10%] h-[1px]"
          style={{
            background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)",
          }}
        />

        {/* Screen bezel */}
        <div className="absolute inset-[10px] rounded-[36px] overflow-hidden" ref={screenRef}>
          {/* Dynamic Island */}
          <div
            className="absolute top-[14px] left-1/2 -translate-x-1/2 z-10"
            style={{
              width: "90px",
              height: "26px",
              background: "#000",
              borderRadius: "13px",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.08)",
            }}
          >
            <div
              className="absolute right-[20px] top-1/2 -translate-y-1/2 rounded-full"
              style={{ width: "8px", height: "8px", background: "#1a1a1a" }}
            />
          </div>

          {/* Screen content */}
          <div
            className="w-full h-full relative overflow-hidden"
            style={{
              background: "linear-gradient(160deg, #0F172A 0%, #020817 100%)",
            }}
          >
            {/* App UI mockup inside screen */}
            <AppScreenContent />

            {/* Glass reflection on screen */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>

        {/* Glass reflection on phone body */}
        <div
          className="absolute inset-0 rounded-[44px] pointer-events-none"
          style={{
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)",
          }}
        />

        {/* Side button - right */}
        <div
          className="absolute right-[-2px] top-[120px]"
          style={{
            width: "3px",
            height: "60px",
            background: "linear-gradient(to right, #1a1d2e, #2a2d3e)",
            borderRadius: "0 2px 2px 0",
          }}
        />
        <div
          className="absolute right-[-2px] top-[195px]"
          style={{
            width: "3px",
            height: "40px",
            background: "linear-gradient(to right, #1a1d2e, #2a2d3e)",
            borderRadius: "0 2px 2px 0",
          }}
        />

        {/* Volume buttons - left */}
        <div
          className="absolute left-[-2px] top-[140px]"
          style={{
            width: "3px",
            height: "36px",
            background: "linear-gradient(to left, #1a1d2e, #2a2d3e)",
            borderRadius: "2px 0 0 2px",
          }}
        />
        <div
          className="absolute left-[-2px] top-[186px]"
          style={{
            width: "3px",
            height: "36px",
            background: "linear-gradient(to left, #1a1d2e, #2a2d3e)",
            borderRadius: "2px 0 0 2px",
          }}
        />
      </div>

      {/* Soft environment light */}
      <div
        className="absolute top-[-40px] left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "200px",
          height: "200px",
          background: "radial-gradient(circle, rgba(59,123,255,0.06), transparent 70%)",
          filter: "blur(30px)",
        }}
      />
    </div>
  );
}

function AppScreenContent() {
  return (
    <div className="w-full h-full flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* Status bar */}
      <div
        className="flex items-center justify-between px-6 pt-16 pb-2"
        style={{ fontSize: "10px", color: "rgba(255,255,255,0.8)", fontWeight: 600 }}
      >
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <div style={{ width: "14px", height: "8px", border: "1.5px solid rgba(255,255,255,0.7)", borderRadius: "2px", position: "relative" }}>
            <div style={{ position: "absolute", right: "-3px", top: "50%", transform: "translateY(-50%)", width: "1.5px", height: "4px", background: "rgba(255,255,255,0.7)", borderRadius: "1px" }} />
            <div style={{ position: "absolute", left: "1px", top: "1px", right: "4px", bottom: "1px", background: "rgba(255,255,255,0.7)", borderRadius: "1px" }} />
          </div>
        </div>
      </div>

      {/* App content */}
      <div className="flex-1 px-5 pt-3 pb-6 overflow-hidden">
        {/* Header */}
        <div className="mb-5">
          <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", marginBottom: "4px" }}>Good morning 👋</p>
          <p style={{ fontSize: "18px", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em" }}>Dashboard</p>
        </div>

        {/* Main card */}
        <div
          className="rounded-2xl p-4 mb-4"
          style={{
            background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
            boxShadow: "0 8px 24px rgba(59,130,246,0.3)",
          }}
        >
          <p style={{ fontSize: "10px", color: "rgba(255,255,255,0.7)", marginBottom: "4px" }}>Total Revenue</p>
          <p style={{ fontSize: "24px", fontWeight: 800, color: "#fff", letterSpacing: "-0.03em" }}>$48,291</p>
          <div className="flex items-center gap-1 mt-1">
            <span style={{ fontSize: "10px", color: "#86efac", fontWeight: 600 }}>▲ 12.4%</span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.5)" }}>vs last month</span>
          </div>
          {/* Mini chart */}
          <div className="flex items-end gap-1 mt-3" style={{ height: "28px" }}>
            {[40, 55, 45, 70, 60, 80, 68, 90, 75, 100].map((h, i) => (
              <div
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  background: i === 9 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.3)",
                  borderRadius: "2px",
                }}
              />
            ))}
          </div>
        </div>

        {/* Stat row */}
        <div className="flex gap-3 mb-4">
          {[
            { label: "Orders", val: "1,482", color: "#a78bfa" },
            { label: "Users", val: "24.5k", color: "#34d399" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex-1 rounded-xl p-3"
              style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.4)", marginBottom: "3px" }}>{s.label}</p>
              <p style={{ fontSize: "16px", fontWeight: 700, color: s.color, letterSpacing: "-0.02em" }}>{s.val}</p>
            </div>
          ))}
        </div>

        {/* Recent list */}
        <div>
          <p style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.4)", marginBottom: "8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Recent Activity</p>
          {[
            { name: "New subscription", time: "2m ago", amount: "+$99" },
            { name: "Refund issued", time: "1h ago", amount: "-$29" },
            { name: "Pro upgrade", time: "3h ago", amount: "+$199" },
          ].map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between py-2.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
            >
              <div>
                <p style={{ fontSize: "11px", fontWeight: 600, color: "rgba(255,255,255,0.85)" }}>{item.name}</p>
                <p style={{ fontSize: "9px", color: "rgba(255,255,255,0.3)" }}>{item.time}</p>
              </div>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: item.amount.startsWith("+") ? "#34d399" : "#f87171",
                }}
              >
                {item.amount}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tab bar */}
      <div
        className="flex items-center justify-around px-4 py-3"
        style={{
          background: "rgba(15,20,40,0.95)",
          backdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        {["⊞", "○", "↗", "👤"].map((icon, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1"
            style={{ opacity: i === 0 ? 1 : 0.4 }}
          >
            <span style={{ fontSize: "16px" }}>{icon}</span>
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: i === 0 ? "#3b7bff" : "transparent",
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLDivElement>(null);
  const h1Ref = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // Generate particles client-side only to avoid SSR/client hydration mismatch
  const [particles, setParticles] = useState<ParticleData[]>([]);

  useEffect(() => {
    setParticles(
      Array.from({ length: 8 }, (_, i) => ({
        x: `${10 + Math.random() * 80}%`,
        y: `${10 + Math.random() * 80}%`,
        size: 2 + Math.random() * 3,
        alpha: 0.3 + Math.random() * 0.3,
        delay: i * 0.7,
      }))
    );
  }, []);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });

    tl.fromTo(
      tagRef.current,
      { opacity: 0, y: 20, filter: "blur(8px)" },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.8, ease: "power3.out" }
    )
      .fromTo(
        h1Ref.current,
        { opacity: 0, y: 40, filter: "blur(12px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.5"
      )
      .fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
        "-=0.4"
      )
      .fromTo(
        rightRef.current,
        { opacity: 0, x: 60, filter: "blur(20px)" },
        { opacity: 1, x: 0, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        "-=0.9"
      );
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ paddingTop: "68px" }}
    >
      {/* Background gradients */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 50% -10%, rgba(59, 123, 255, 0.1), transparent),
            radial-gradient(ellipse 50% 40% at 80% 60%, rgba(99, 102, 241, 0.07), transparent),
            radial-gradient(ellipse 40% 30% at 20% 80%, rgba(139, 92, 246, 0.05), transparent)
          `,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p, i) => (
          <Particle key={i} {...p} />
        ))}
      </div>

      <div className="container-wide w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center min-h-[calc(100vh-68px)] py-20">
          {/* Left content */}
          <div ref={leftRef} className="flex flex-col gap-8 max-w-[560px]">
            <div ref={tagRef} style={{ opacity: 0 }}>
              <div className="tag w-fit">
                <span
                  className="rounded-full inline-block"
                  style={{ width: "6px", height: "6px", background: "#3B7BFF" }}
                />
                Launching v2.0 — Now with AI scene detection
              </div>
            </div>

            <h1
              ref={h1Ref}
              className="text-display"
              style={{ opacity: 0 }}
            >
              <span className="gradient-text block">Create stunning</span>
              <span className="gradient-text block">video mockups</span>
              <span
                className="block"
                style={{
                  background: "linear-gradient(135deg, #6EB3FF, #8B5CF6)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                in seconds.
              </span>
            </h1>

            <p
              ref={subRef}
              className="text-body-lg max-w-[440px]"
              style={{ color: "var(--text-secondary)", opacity: 0 }}
            >
              Transform your app recordings into cinematic phone presentations — automatically rendered, ready to share.
            </p>

            <div ref={ctaRef} className="flex flex-wrap items-center gap-4" style={{ opacity: 0 }}>
              <a href="#cta" className="btn-primary" data-cursor-hover>
                Start Creating
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2.5 7h9M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#showcase" className="btn-secondary" data-cursor-hover>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M5.5 5.2l4.2 1.8-4.2 1.8V5.2z" fill="currentColor" />
                </svg>
                Watch Demo
              </a>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4" style={{ opacity: 0, animation: "none" }}>
              <div className="flex -space-x-2">
                {["#3B7BFF", "#8B5CF6", "#34d399", "#f59e0b"].map((color, i) => (
                  <div
                    key={i}
                    className="rounded-full border-2 flex items-center justify-center text-xs font-bold"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: color,
                      borderColor: "var(--bg-primary)",
                      fontSize: "9px",
                      color: "white",
                    }}
                  >
                    {["A", "M", "S", "J"][i]}
                  </div>
                ))}
              </div>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: 600 }}>2,400+</span> creators trust MockFlow
              </p>
            </div>
          </div>

          {/* Right: Phone */}
          <div
            ref={rightRef}
            className="flex items-center justify-center lg:justify-end relative"
            style={{ opacity: 0 }}
          >
            {/* Atmospheric glow behind phone */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "500px",
                height: "500px",
                background: "radial-gradient(circle, rgba(59,123,255,0.08) 0%, rgba(99,102,241,0.05) 40%, transparent 70%)",
                filter: "blur(40px)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Cinematic spotlight */}
            <div
              className="absolute pointer-events-none"
              style={{
                width: "300px",
                height: "600px",
                background: "linear-gradient(to bottom, rgba(59,123,255,0.06), transparent)",
                filter: "blur(60px)",
                top: "-50px",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            />

            <PhoneMockup />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "var(--text-muted)" }}
      >
        <p className="text-label text-[10px]">Scroll to explore</p>
        <div
          className="w-px h-10 rounded-full overflow-hidden"
          style={{ background: "var(--border-subtle)" }}
        >
          <div
            className="w-full h-1/2 rounded-full"
            style={{
              background: "var(--accent-blue)",
              animation: "scan-line 2s ease-in-out infinite",
            }}
          />
        </div>
      </div>
    </section>
  );
}
