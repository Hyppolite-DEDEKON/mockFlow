"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const templates = [
  {
    name: "Midnight Studio",
    category: "Dark",
    color: "#3B7BFF",
    bg: "linear-gradient(160deg, #020817, #0f172a)",
    popular: true,
    size: "large",
  },
  {
    name: "Arctic Light",
    category: "Bright",
    color: "#06b6d4",
    bg: "linear-gradient(160deg, #ecfeff, #cffafe)",
    popular: false,
    size: "small",
  },
  {
    name: "Violet Haze",
    category: "Dark",
    color: "#8B5CF6",
    bg: "linear-gradient(160deg, #1e1b4b, #2d1b69)",
    popular: false,
    size: "small",
  },
  {
    name: "Forest Dawn",
    category: "Nature",
    color: "#10b981",
    bg: "linear-gradient(160deg, #022c22, #064e3b)",
    popular: true,
    size: "medium",
  },
  {
    name: "Golden Hour",
    category: "Warm",
    color: "#f59e0b",
    bg: "linear-gradient(160deg, #451a03, #78350f)",
    popular: false,
    size: "medium",
  },
  {
    name: "Glass Room",
    category: "Minimal",
    color: "#f8fafc",
    bg: "linear-gradient(160deg, #f8fafc, #e2e8f0)",
    popular: true,
    size: "small",
  },
];

function TemplateCard({
  template,
  index,
}: {
  template: typeof templates[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
        delay: index * 0.08,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [index]);

  const heights: Record<string, string> = {
    large: "340px",
    medium: "280px",
    small: "220px",
  };

  const isLight = template.category === "Bright" || template.category === "Minimal";

  return (
    <div
      ref={cardRef}
      className="relative rounded-[24px] overflow-hidden group cursor-pointer transition-all duration-500"
      style={{
        background: template.bg,
        border: "1px solid rgba(255,255,255,0.08)",
        height: heights[template.size],
        opacity: 0,
        boxShadow: "0 16px 50px rgba(0,0,0,0.4)",
      }}
      data-cursor-hover
    >
      {/* Hover overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: "rgba(0,0,0,0.15)" }}
      />

      {/* Mini phone */}
      <div
        className="absolute left-1/2 -translate-x-1/2"
        style={{
          width: "72px",
          height: "148px",
          top: "16px",
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <div
          className="w-full h-full rounded-[14px] overflow-hidden"
          style={{
            background: isLight ? "#fff" : "linear-gradient(160deg, #1A1D2E, #080A12)",
            border: `1px solid ${isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.12)"}`,
            boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
          }}
        >
          <div
            className="absolute inset-[3px] rounded-[12px] overflow-hidden"
            style={{ background: isLight ? "#f8fafc" : "linear-gradient(160deg, #0F172A, #020817)" }}
          >
            {/* Mini screen content */}
            <div className="p-1.5 flex flex-col gap-1">
              <div
                className="rounded w-3/4"
                style={{ height: "4px", background: isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.15)", marginTop: "6px" }}
              />
              <div
                className="rounded-md"
                style={{
                  height: "32px",
                  background: `${template.color}${isLight ? "44" : "22"}`,
                  marginTop: "2px",
                }}
              />
              {[80, 60, 70].map((w, i) => (
                <div
                  key={i}
                  className="rounded"
                  style={{
                    width: `${w}%`,
                    height: "3px",
                    background: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)",
                  }}
                />
              ))}
            </div>
          </div>
          <div
            className="absolute z-10"
            style={{
              width: "26px",
              height: "7px",
              background: isLight ? "#fff" : "#000",
              borderRadius: "3.5px",
              top: "3px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </div>

        {/* Phone shadow */}
        <div
          className="absolute -bottom-3 left-1/2 -translate-x-1/2"
          style={{
            width: "50px",
            height: "12px",
            background: "radial-gradient(ellipse, rgba(0,0,0,0.4), transparent 70%)",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* Template info */}
      <div
        className="absolute bottom-0 left-0 right-0 p-4"
        style={{
          background: isLight
            ? "linear-gradient(to top, rgba(248,250,252,0.95), transparent)"
            : "linear-gradient(to top, rgba(6,7,10,0.9), transparent)",
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            {template.popular && (
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full mb-1 inline-block"
                style={{
                  background: `${template.color}22`,
                  color: template.color,
                  border: `1px solid ${template.color}44`,
                }}
              >
                Popular
              </span>
            )}
            <p
              className="text-sm font-semibold tracking-tight"
              style={{ color: isLight ? "rgba(0,0,0,0.85)" : "var(--text-primary)" }}
            >
              {template.name}
            </p>
            <p
              className="text-[11px]"
              style={{ color: isLight ? "rgba(0,0,0,0.45)" : "var(--text-muted)" }}
            >
              {template.category}
            </p>
          </div>
          <button
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-[11px] font-medium px-3 py-1.5 rounded-lg"
            style={{
              background: template.color,
              color: isLight && template.color === "#f8fafc" ? "#000" : "#fff",
            }}
            data-cursor-hover
          >
            Use
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TemplatesSection() {
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
    <section ref={sectionRef} id="templates" className="section-padding" style={{ background: "var(--bg-primary)" }}>
      <div className="container-wide">
        <div ref={headlineRef} className="mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6" style={{ opacity: 0 }}>
          <div>
            <div className="tag w-fit mb-6">
              <span className="rounded-full inline-block" style={{ width: "6px", height: "6px", background: "#f59e0b" }} />
              Template Gallery
            </div>
            <h2 className="text-headline">
              <span className="gradient-text">Every scene.</span>
              <br />
              <span className="gradient-text">Every aesthetic.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-4 lg:items-end">
            <p className="text-body-lg max-w-[300px] lg:text-right" style={{ color: "var(--text-secondary)" }}>
              100+ professionally crafted environments. Dark, light, editorial, cinematic.
            </p>
            <a href="#cta" className="btn-secondary w-fit" data-cursor-hover>
              Browse all templates →
            </a>
          </div>
        </div>

        {/* Asymmetric magazine grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Row 1: large + small stack */}
          <div className="col-span-1 row-span-1">
            <TemplateCard template={templates[0]} index={0} />
          </div>
          <div className="col-span-1 flex flex-col gap-4">
            <TemplateCard template={templates[1]} index={1} />
            <TemplateCard template={templates[2]} index={2} />
          </div>
          <div className="hidden lg:flex col-span-1 flex-col gap-4">
            <TemplateCard template={templates[3]} index={3} />
            <TemplateCard template={templates[4]} index={4} />
          </div>
        </div>
      </div>
    </section>
  );
}
