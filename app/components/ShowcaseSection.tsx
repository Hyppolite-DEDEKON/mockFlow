"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const showcaseItems = [
  {
    id: 1,
    label: "Finance App",
    color: "from-blue-950 to-slate-900",
    accent: "#3B7BFF",
    stats: "2.1M views",
    tag: "Banking",
  },
  {
    id: 2,
    label: "Social Platform",
    color: "from-violet-950 to-slate-900",
    accent: "#8B5CF6",
    stats: "890K views",
    tag: "Social",
  },
  {
    id: 3,
    label: "Productivity Suite",
    color: "from-emerald-950 to-slate-900",
    accent: "#10b981",
    stats: "1.4M views",
    tag: "Productivity",
  },
  {
    id: 4,
    label: "E-Commerce",
    color: "from-orange-950 to-slate-900",
    accent: "#f59e0b",
    stats: "3.2M views",
    tag: "Commerce",
  },
  {
    id: 5,
    label: "Health & Fitness",
    color: "from-pink-950 to-slate-900",
    accent: "#ec4899",
    stats: "780K views",
    tag: "Health",
  },
];

function ShowcaseCard({ item, index }: { item: typeof showcaseItems[0]; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={cardRef}
      data-cursor-hover
      className="relative flex-shrink-0 group"
      style={{
        width: "340px",
        height: "560px",
      }}
    >
      {/* Card */}
      <div
        className="relative w-full h-full rounded-[28px] overflow-hidden transition-all duration-500"
        style={{
          background: `linear-gradient(160deg, rgba(${
            index % 2 === 0 ? "59,123,255" : "139,92,246"
          }, 0.08), rgba(6,7,10,0.95))`,
          border: "1px solid rgba(255,255,255,0.07)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.5)",
          transform: `rotate(${(index % 3) - 1}deg)`,
        }}
      >
        <style>{`
          .showcase-card-${index}:hover { transform: rotate(0deg) scale(1.02) !important; }
        `}</style>

        <div className={`showcase-card-${index} w-full h-full`}>
          {/* Phone in card */}
          <div
            className="absolute top-[40px] left-1/2 -translate-x-1/2"
            style={{
              width: "180px",
              height: "360px",
            }}
          >
            {/* Mini phone body */}
            <div
              className="w-full h-full rounded-[28px] overflow-hidden"
              style={{
                background: "linear-gradient(160deg, #1A1D2E, #080A12)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: `0 20px 60px rgba(0,0,0,0.7), 0 0 0 0.5px rgba(255,255,255,0.05)`,
              }}
            >
              {/* Mini screen */}
              <div
                className="absolute inset-[6px] rounded-[24px] overflow-hidden"
                style={{ background: "linear-gradient(160deg, #0F172A, #020817)" }}
              >
                {/* Mini app content */}
                <div className="w-full h-full flex flex-col gap-2 p-3">
                  {/* Mini header */}
                  <div className="flex items-center justify-between">
                    <div className="rounded" style={{ width: "40px", height: "8px", background: "rgba(255,255,255,0.15)" }} />
                    <div className="rounded-full" style={{ width: "20px", height: "20px", background: item.accent, opacity: 0.8 }} />
                  </div>
                  {/* Mini card */}
                  <div
                    className="rounded-xl p-2 flex flex-col gap-1"
                    style={{ background: `${item.accent}22`, border: `1px solid ${item.accent}33` }}
                  >
                    <div className="rounded" style={{ width: "60%", height: "6px", background: `${item.accent}88` }} />
                    <div className="rounded" style={{ width: "80%", height: "10px", background: `${item.accent}cc` }} />
                  </div>
                  {/* Mini stats */}
                  <div className="flex gap-2">
                    {[60, 40].map((w, i) => (
                      <div key={i} className="flex-1 rounded-lg p-2" style={{ background: "rgba(255,255,255,0.04)" }}>
                        <div className="rounded" style={{ width: `${w}%`, height: "5px", background: "rgba(255,255,255,0.12)", marginBottom: "4px" }} />
                        <div className="rounded" style={{ width: "80%", height: "8px", background: "rgba(255,255,255,0.2)" }} />
                      </div>
                    ))}
                  </div>
                  {/* Mini list */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2 py-1" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="rounded-full flex-shrink-0" style={{ width: "16px", height: "16px", background: `${item.accent}44` }} />
                      <div className="flex-1">
                        <div className="rounded" style={{ width: `${50 + i * 15}%`, height: "5px", background: "rgba(255,255,255,0.15)", marginBottom: "3px" }} />
                        <div className="rounded" style={{ width: `${30 + i * 10}%`, height: "4px", background: "rgba(255,255,255,0.07)" }} />
                      </div>
                    </div>
                  ))}
                  {/* Mini chart */}
                  <div className="flex items-end gap-0.5 mt-auto" style={{ height: "32px" }}>
                    {[45, 65, 50, 80, 60, 90, 70].map((h, i) => (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: `${h}%`,
                          background: i === 6 ? item.accent : `${item.accent}44`,
                          borderRadius: "2px",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              {/* Dynamic island mini */}
              <div
                className="absolute top-[8px] left-1/2 -translate-x-1/2"
                style={{
                  width: "52px",
                  height: "14px",
                  background: "#000",
                  borderRadius: "7px",
                  zIndex: 10,
                }}
              />
            </div>

            {/* Phone shadow */}
            <div
              className="absolute bottom-[-20px] left-1/2 -translate-x-1/2"
              style={{
                width: "120px",
                height: "20px",
                background: "radial-gradient(ellipse, rgba(0,0,0,0.5), transparent 70%)",
                filter: "blur(10px)",
              }}
            />
          </div>

          {/* Card bottom info */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div
              className="flex items-center justify-between"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)", paddingTop: "16px" }}
            >
              <div>
                <p className="text-label text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>
                  {item.tag}
                </p>
                <p
                  className="font-semibold text-sm tracking-tight"
                  style={{ color: "var(--text-primary)" }}
                >
                  {item.label}
                </p>
              </div>
              <div className="text-right">
                <p className="text-label text-[10px] mb-1" style={{ color: "var(--text-muted)" }}>
                  Avg. reach
                </p>
                <p
                  className="font-bold text-sm"
                  style={{ color: item.accent }}
                >
                  {item.stats}
                </p>
              </div>
            </div>
          </div>

          {/* Accent light */}
          <div
            className="absolute top-[-20px] left-1/2 -translate-x-1/2 pointer-events-none"
            style={{
              width: "200px",
              height: "100px",
              background: `radial-gradient(ellipse, ${item.accent}18, transparent 70%)`,
              filter: "blur(20px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default function ShowcaseSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const headline = headlineRef.current;
    if (!section || !track || !headline) return;

    // Headline reveal
    gsap.fromTo(
      headline,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      }
    );

    // Horizontal scroll
    const trackWidth = track.scrollWidth - track.clientWidth;

    gsap.to(track, {
      x: -trackWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        pin: true,
        scrub: 1.2,
        start: "top top",
        end: `+=${trackWidth + 600}`,
        anticipatePin: 1,
      },
    });

    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.trigger === section) t.kill();
      });
    };
  }, []);

  return (
    <section ref={sectionRef} id="showcase" className="overflow-hidden" style={{ background: "var(--bg-primary)" }}>
      <div className="container-wide pt-24 pb-12">
        <div ref={headlineRef} className="flex items-end justify-between" style={{ opacity: 0 }}>
          <div>
            <div className="tag w-fit mb-6">
              <span className="rounded-full inline-block" style={{ width: "6px", height: "6px", background: "#8B5CF6" }} />
              Showcase Gallery
            </div>
            <h2 className="text-headline max-w-[500px]">
              <span className="gradient-text">Mockups that</span>
              <br />
              <span className="gradient-text">stop the scroll.</span>
            </h2>
          </div>
          <p
            className="hidden lg:block text-body-lg max-w-[280px] text-right pb-2"
            style={{ color: "var(--text-secondary)" }}
          >
            Real mockups crafted by our community of creators.
          </p>
        </div>
      </div>

      <div
        ref={trackRef}
        className="h-scroll-track"
        style={{ paddingLeft: "clamp(24px, 5vw, 80px)", paddingRight: "80px" }}
      >
        {showcaseItems.map((item, i) => (
          <ShowcaseCard key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
