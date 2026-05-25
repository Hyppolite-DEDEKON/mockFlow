"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "MockFlow completely changed how I present my apps. What used to take half a day in After Effects now takes three minutes.",
    name: "Kaito Nakamura",
    role: "Lead Product Designer",
    company: "Notion",
    avatar: "KN",
    color: "#3B7BFF",
  },
  {
    quote:
      "The quality is honestly indistinguishable from what our motion team produces. I use it for every App Store submission.",
    name: "Sara Lindqvist",
    role: "Indie iOS Developer",
    company: "Solarspark",
    avatar: "SL",
    color: "#8B5CF6",
  },
  {
    quote:
      "We replaced our entire mockup workflow with MockFlow. It's that good. Our engagement rate on app previews doubled.",
    name: "Marcus Chen",
    role: "Growth Engineer",
    company: "Linear",
    avatar: "MC",
    color: "#10b981",
  },
];

export default function TestimonialsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

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

    if (!cardsRef.current) return;
    const cards = cardsRef.current.querySelectorAll(".testimonial-card");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardsRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, []);

  return (
    <section ref={sectionRef} id="testimonials" className="section-padding" style={{ background: "var(--bg-secondary)" }}>
      <div className="container-wide">
        {/* Headline */}
        <div ref={headlineRef} className="mb-16 max-w-[460px]" style={{ opacity: 0 }}>
          <div className="tag w-fit mb-6">
            <span className="rounded-full inline-block" style={{ width: "6px", height: "6px", background: "#ec4899" }} />
            Creators Love It
          </div>
          <h2 className="text-headline">
            <span className="gradient-text">Trusted by the</span>
            <br />
            <span className="gradient-text">best builders.</span>
          </h2>
        </div>

        {/* Testimonials */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="testimonial-card relative glass-card p-8 flex flex-col gap-6 transition-all duration-400 group"
              style={{
                borderRadius: "20px",
                opacity: 0,
                transform: i === 1 ? "translateY(-12px)" : "none",
              }}
              data-cursor-hover
            >
              {/* Quote mark */}
              <span className="quote-mark">&ldquo;</span>

              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="12" height="12" viewBox="0 0 12 12" fill={t.color}>
                    <path d="M6 1l1.545 3.09L11 4.635l-2.5 2.41.59 3.41L6 9l-3.09 1.455L3.5 7.045 1 4.635l3.455-.545L6 1z" />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p
                className="text-sm leading-relaxed flex-1"
                style={{ color: "var(--text-secondary)", lineHeight: "1.7" }}
              >
                {t.quote}
              </p>

              {/* Author */}
              <div
                className="flex items-center gap-3 pt-4"
                style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}33` }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    {t.name}
                  </p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {t.role} · {t.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Company logos strip */}
        <div
          className="mt-16 flex flex-col items-center gap-8"
        >
          <p className="text-label" style={{ color: "var(--text-muted)" }}>
            Trusted at leading companies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 opacity-30">
            {["Linear", "Raycast", "Vercel", "Framer", "Notion", "Figma"].map((name) => (
              <span
                key={name}
                className="text-lg font-semibold tracking-tight"
                style={{ color: "var(--text-primary)", fontVariantNumeric: "tabular-nums" }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
