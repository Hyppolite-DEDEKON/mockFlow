"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, LayoutGrid } from "lucide-react";
import TemplateCard from "../components/TemplateCard";
import {
  MOCKFLOW_TEMPLATES,
  PLATFORM_LABELS,
  STYLE_LABELS,
  type MockflowTemplate,
  type TemplatePlatform,
  type TemplateStyle,
} from "../lib/templates";
import type { AspectRatio } from "../lib/motionPresets";

type FormatFilter = "all" | AspectRatio;
type StyleFilter = "all" | TemplateStyle;
type PlatformFilter = "all" | TemplatePlatform;

const FORMAT_OPTIONS: { id: FormatFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "9:16", label: "Portrait" },
  { id: "16:9", label: "Paysage" },
  { id: "1:1", label: "Carré" },
];

const STYLE_OPTIONS: { id: StyleFilter; label: string }[] = [
  { id: "all", label: "Tous" },
  { id: "dark", label: STYLE_LABELS.dark },
  { id: "light", label: STYLE_LABELS.light },
  { id: "color", label: STYLE_LABELS.color },
];

const PLATFORM_OPTIONS: { id: PlatformFilter; label: string }[] = [
  { id: "all", label: "Toutes" },
  { id: "tiktok", label: PLATFORM_LABELS.tiktok },
  { id: "youtube", label: PLATFORM_LABELS.youtube },
  { id: "instagram", label: PLATFORM_LABELS.instagram },
  { id: "linkedin", label: PLATFORM_LABELS.linkedin },
  { id: "app-store", label: PLATFORM_LABELS["app-store"] },
  { id: "general", label: PLATFORM_LABELS.general },
];

function filterTemplates(
  templates: MockflowTemplate[],
  query: string,
  format: FormatFilter,
  style: StyleFilter,
  platform: PlatformFilter
) {
  const q = query.trim().toLowerCase();
  return templates.filter((t) => {
    if (format !== "all" && t.aspectRatio !== format) return false;
    if (style !== "all" && t.style !== style) return false;
    if (platform !== "all" && t.platform !== platform) return false;
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.tags.some((tag) => tag.includes(q))
    );
  });
}

function FilterPills<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.id}
          type="button"
          onClick={() => onChange(opt.id)}
          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
            value === opt.id
              ? "bg-[#3B7BFF] text-white"
              : "bg-white/5 text-white/50 hover:text-white hover:bg-white/10"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

export default function TemplatesPage() {
  const [query, setQuery] = useState("");
  const [format, setFormat] = useState<FormatFilter>("all");
  const [style, setStyle] = useState<StyleFilter>("all");
  const [platform, setPlatform] = useState<PlatformFilter>("all");

  const filtered = useMemo(
    () => filterTemplates(MOCKFLOW_TEMPLATES, query, format, style, platform),
    [query, format, style, platform]
  );

  const featured = useMemo(
    () => MOCKFLOW_TEMPLATES.filter((t) => t.featured),
    []
  );

  const showFeatured = !query && format === "all" && style === "all" && platform === "all";

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium text-[#3B7BFF] mb-3 px-3 py-1 rounded-full bg-[#3B7BFF]/10 border border-[#3B7BFF]/20">
            <LayoutGrid size={12} />
            Starter kits
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Templates</h1>
          <p className="text-white/50 max-w-xl">
            Choisis un look complet — appareil, fond, intro et format — puis uploade ta capture dans
            l&apos;éditeur.
          </p>
        </div>
        <Link
          href="/dashboard/editor"
          className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <Plus size={16} />
          Partir de zéro
        </Link>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un template…"
          className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#3B7BFF]/50 transition-colors"
        />
      </div>

      <div className="space-y-6 bg-white/[0.02] border border-white/5 rounded-2xl p-5">
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Format</p>
          <FilterPills options={FORMAT_OPTIONS} value={format} onChange={setFormat} />
        </div>
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Style</p>
          <FilterPills options={STYLE_OPTIONS} value={style} onChange={setStyle} />
        </div>
        <div>
          <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-3">Plateforme</p>
          <FilterPills options={PLATFORM_OPTIONS} value={platform} onChange={setPlatform} />
        </div>
      </div>

      {showFeatured && (
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">À la une</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((template) => (
              <TemplateCard key={template.id} template={template} compact />
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            {showFeatured ? "Tous les templates" : "Résultats"}
          </h2>
          <span className="text-xs text-white/40">{filtered.length} template{filtered.length !== 1 ? "s" : ""}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-white/10 bg-white/[0.02]">
            <p className="text-white/60 mb-2">Aucun template ne correspond à vos filtres.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setFormat("all");
                setStyle("all");
                setPlatform("all");
              }}
              className="text-sm text-[#3B7BFF] hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>

      <div className="rounded-2xl border border-white/5 bg-gradient-to-br from-[#1A1D2E]/80 to-[#0D0F1A]/80 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-white mb-1">Démos web & SaaS</p>
          <p className="text-xs text-white/45">
            Utilise le template MacBook Pro en paysage pour présenter ton app desktop ou dashboard.
          </p>
        </div>
        <Link
          href="/dashboard/editor?template=desktop-saas"
          className="inline-flex items-center justify-center gap-2 text-sm font-medium text-[#3B7BFF] hover:text-[#93c5fd] transition-colors shrink-0"
        >
          Essayer SaaS Desktop →
        </Link>
      </div>
    </div>
  );
}
