"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import BackgroundLayer from "./BackgroundLayer";
import {
  type MockflowTemplate,
  getTemplateMeta,
  STYLE_LABELS,
} from "../lib/templates";

interface TemplateCardProps {
  template: MockflowTemplate;
  compact?: boolean;
}

function MiniDevice({ device, light }: { device: string; light: boolean }) {
  const isDesktop = device === "desktop";
  const isIpad = device === "ipad";
  const w = isDesktop ? 120 : isIpad ? 88 : 52;
  const h = isDesktop ? 72 : isIpad ? 64 : 108;
  const radius = isDesktop ? 6 : isIpad ? 8 : 14;

  return (
    <div
      className="relative mx-auto shadow-2xl"
      style={{ width: w, height: h }}
    >
      <div
        className="w-full h-full overflow-hidden"
        style={{
          borderRadius: radius,
          background: light
            ? "linear-gradient(160deg, #fff, #e8e8ed)"
            : "linear-gradient(160deg, #1A1D2E, #080A12)",
          border: `1.5px solid ${light ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.12)"}`,
        }}
      >
        <div
          className="absolute inset-[3px] overflow-hidden"
          style={{
            borderRadius: radius - 3,
            background: light ? "#f5f5f7" : "linear-gradient(160deg, #0F172A, #020817)",
          }}
        >
          <div className="p-1.5 flex flex-col gap-1">
            <div
              className="rounded w-2/3 mx-auto"
              style={{
                height: 3,
                marginTop: isIpad ? 4 : 6,
                background: light ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)",
              }}
            />
            <div
              className="rounded-md flex-1 min-h-[24px]"
              style={{
                background: light ? "rgba(59,123,255,0.15)" : "rgba(59,123,255,0.25)",
              }}
            />
            {[70, 55, 65].map((width, i) => (
              <div
                key={i}
                className="rounded"
                style={{
                  width: `${width}%`,
                  height: 2,
                  background: light ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)",
                }}
              />
            ))}
          </div>
        </div>
        {!isIpad && !isDesktop && (
          <div
            className="absolute z-10 left-1/2 -translate-x-1/2"
            style={{
              width: 20,
              height: 5,
              top: 4,
              borderRadius: 3,
              background: light ? "#fff" : "#000",
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function TemplateCard({ template, compact = false }: TemplateCardProps) {
  const meta = getTemplateMeta(template);
  const aspectCss = template.aspectRatio.replace(":", " / ");
  const isLight = template.style === "light" || template.style === "color";

  return (
    <Link
      href={`/dashboard/editor?template=${template.id}`}
      className="group block rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden hover:border-[#3B7BFF]/40 hover:bg-white/[0.04] transition-all duration-300"
    >
      <div
        className="relative overflow-hidden"
        style={{
          aspectRatio: aspectCss,
          maxHeight: compact ? 200 : undefined,
        }}
      >
        <BackgroundLayer backgroundId={template.backgroundId} />
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-1">
            <MiniDevice device={template.device} light={isLight} />
          </div>
        </div>
        {template.featured && (
          <span className="absolute top-3 left-3 flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full bg-[#3B7BFF]/20 text-[#93c5fd] border border-[#3B7BFF]/30">
            <Sparkles size={10} />
            Populaire
          </span>
        )}
      </div>

      <div className="p-4 border-t border-white/5">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-white truncate group-hover:text-[#93c5fd] transition-colors">
              {template.name}
            </h3>
            <p className="text-[11px] text-white/40 mt-0.5 line-clamp-2">{template.description}</p>
          </div>
          <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 text-white/40 group-hover:bg-[#3B7BFF] group-hover:text-white transition-all">
            <ArrowRight size={14} />
          </span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/5">
            {meta.aspectLabel}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/5">
            {meta.deviceLabel}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-white/50 border border-white/5">
            {meta.motionLabel}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300/80 border border-purple-500/20">
            {STYLE_LABELS[template.style]}
          </span>
        </div>
      </div>
    </Link>
  );
}
