"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    label: "Upload",
    title: "Drop your recording",
    description:
      "Upload your raw screen recording in any format. MP4, MOV, WebM — we handle it all automatically.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 15V4M7 8l4-4 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accent: "#3B7BFF",
  },
  {
    number: "02",
    label: "Customize",
    title: "Choose your style",
    description:
      "Pick from dozens of premium environments, lighting setups, and phone models. No design skills needed.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M11 2v2M11 18v2M2 11h2M18 11h2M4.22 4.22l1.42 1.42M16.36 16.36l1.42 1.42M4.22 17.78l1.42-1.42M16.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accent: "#8B5CF6",
  },
  {
    number: "03",
    label: "Render",
    title: "AI does the work",
    description:
      "Our rendering engine composes cinema-quality output in seconds — lighting, shadows, reflections included.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    accent: "#10b981",
  },
  {
    number: "04",
    label: "Export",
    title: "Download & share",
    description:
      "Get your video in 4K MP4, GIF, or web-optimized format. Ready for App Store, socials, and press kits.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 4v11M7 11l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M3 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    accent: "#f59e0b",
  },
];

function StepCard({ step, index }: { step: typeof steps[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
        delay: index * 0.12,
      }
    );
  }, [index]);

  return (
    <div ref={cardRef} className="relative flex flex-col gap-6" style={{ opacity: 0 }}>
      {/* Number + connector */}
      <div className="flex items-center gap-4">
        <div
          className="flex items-center justify-center flex-shrink-0 font-mono text-xs font-bold"
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "10px",
            background: `${step.accent}18`,
            border: `1px solid ${step.accent}35`,
            color: step.accent,
          }}
        >
          {step.number}
        </div>
        {index < steps.length - 1 && (
          <div
            className="flex-1 h-px"
            style={{
              background: `linear-gradient(to right, ${step.accent}40, rgba(255,255,255,0.06))`,
            }}
          />
        )}
      </div>

      {/* Content */}
      <div
        className="glass-card p-7 flex flex-col gap-4 transition-all duration-400 group"
        style={{ borderRadius: "20px" }}
        data-cursor-hover
      >
        {/* Icon */}
        <div
          className="flex items-center justify-center w-12 h-12 rounded-xl transition-colors duration-300"
          style={{
            background: `${step.accent}12`,
            border: `1px solid ${step.accent}28`,
            color: step.accent,
          }}
        >
          {step.icon}
        </div>

        <div>
          <p className="text-label text-[10px] mb-2" style={{ color: "var(--text-muted)" }}>
            {step.label}
          </p>
          <h3
            className="font-semibold text-lg tracking-tight mb-2"
            style={{ color: "var(--text-primary)" }}
          >
            {step.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {step.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProcessSection() {
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
    <section ref={sectionRef} id="process" className="section-padding" style={{ background: "var(--bg-primary)" }}>
      <div className="container-wide">
        {/* Headline */}
        <div ref={headlineRef} className="mb-20" style={{ opacity: 0 }}>
          <div className="tag w-fit mb-6">
            <span className="rounded-full inline-block" style={{ width: "6px", height: "6px", background: "#10b981" }} />
            How It Works
          </div>
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <h2 className="text-headline max-w-[460px]">
              <span className="gradient-text">Four steps to</span>
              <br />
              <span className="gradient-text">cinematic output.</span>
            </h2>
            <p
              className="text-body-lg max-w-[320px] lg:pb-1"
              style={{ color: "var(--text-secondary)" }}
            >
              From raw recording to polished mockup — the entire workflow takes under a minute.
            </p>
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.map((step, i) => (
            <StepCard key={step.number} step={step} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
