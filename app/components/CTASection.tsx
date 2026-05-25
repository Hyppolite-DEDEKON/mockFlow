"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Antigravity interactive particles
function AntigravityParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    let mouseX = width / 2;
    let mouseY = height / 2;

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: 1 + Math.random() * 2,
      alpha: 0.1 + Math.random() * 0.4,
      color: Math.random() > 0.5 ? "59,123,255" : "139,92,246",
    }));

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener("mousemove", onMouseMove);

    let rafId: number;
    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        // Antigravity - particles move away from mouse
        const dx = p.x - mouseX;
        const dy = p.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repelRadius = 100;

        if (dist < repelRadius) {
          const force = (repelRadius - dist) / repelRadius;
          p.vx += (dx / dist) * force * 0.3;
          p.vy += (dy / dist) * force * 0.3;
        }

        // Damping
        p.vx *= 0.97;
        p.vy *= 0.97;

        // Drift back
        p.vx += (Math.random() - 0.5) * 0.05;
        p.vy += (Math.random() - 0.5) * 0.05;

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
        ctx.fill();
      });

      // Draw connections
      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 80) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(59,123,255,${0.06 * (1 - dist / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      rafId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto"
      style={{ opacity: 0.8 }}
    />
  );
}

export default function CTASection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 60, scale: 0.97 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
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
    <section
      ref={sectionRef}
      id="cta"
      className="section-padding relative overflow-hidden"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 50% 100%, rgba(59, 123, 255, 0.08), transparent),
            radial-gradient(ellipse 40% 40% at 20% 50%, rgba(139, 92, 246, 0.06), transparent)
          `,
        }}
      />

      {/* Antigravity particles */}
      <AntigravityParticles />

      <div className="container-wide relative z-10">
        <div
          ref={contentRef}
          className="relative rounded-[32px] overflow-hidden mx-auto max-w-[900px]"
          style={{
            background: "rgba(11, 16, 32, 0.7)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 40px 100px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.07)",
            padding: "clamp(48px, 7vw, 90px) clamp(32px, 5vw, 80px)",
            opacity: 0,
          }}
        >
          {/* Inner background glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(59,123,255,0.06), transparent)",
            }}
          />

          <div className="relative z-10 flex flex-col items-center text-center gap-8">
            {/* Tag */}
            <div className="tag">
              <span
                className="rounded-full inline-block"
                style={{ width: "6px", height: "6px", background: "#3B7BFF", boxShadow: "0 0 8px #3B7BFF" }}
              />
              Start for free — no credit card needed
            </div>

            {/* Headline */}
            <div>
              <h2 className="text-display max-w-[700px]">
                <span className="gradient-text block">Your recordings</span>
                <span
                  className="block"
                  style={{
                    background: "linear-gradient(135deg, #6EB3FF, #8B5CF6)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  deserve better.
                </span>
              </h2>
            </div>

            {/* Sub */}
            <p
              className="text-body-lg max-w-[460px]"
              style={{ color: "var(--text-secondary)" }}
            >
              Join thousands of creators who ship beautiful app presentations every day with MockFlow.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <a href="#" className="btn-primary !px-8 !py-4 !text-base" data-cursor-hover>
                Start Creating Free
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <a href="#" className="btn-secondary !px-8 !py-4 !text-base" data-cursor-hover>
                View pricing
              </a>
            </div>

            {/* Fine print */}
            <div
              className="flex flex-wrap items-center justify-center gap-6 pt-2"
              style={{ color: "var(--text-muted)" }}
            >
              {[
                "Free 14-day trial",
                "Cancel anytime",
                "4K export included",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2 text-sm">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7l3 3 6-6" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
