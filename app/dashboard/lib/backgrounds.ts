import {
  COLOR_BACKGROUND_SPECS,
  drawColorBlobBackground,
  isColorBackground,
} from "./colorBackgrounds";

export type BackgroundCategory = "studio" | "light" | "color";

export interface BackgroundPreset {
  id: string;
  name: string;
  category: BackgroundCategory;
  fallbackColor: string;
}

export const BACKGROUND_CATEGORIES: { id: BackgroundCategory; label: string }[] = [
  { id: "studio", label: "Studio" },
  { id: "light", label: "Clair" },
  { id: "color", label: "Coloré" },
];

export const BACKGROUNDS: BackgroundPreset[] = [
  { id: "studio-pro", name: "Studio Pro", category: "studio", fallbackColor: "#06070a" },
  { id: "spotlight", name: "Spotlight", category: "studio", fallbackColor: "#050505" },
  { id: "slate-studio", name: "Slate Studio", category: "studio", fallbackColor: "#1a1d24" },
  { id: "carbon", name: "Carbon", category: "studio", fallbackColor: "#0c0c0e" },
  { id: "neon-noir", name: "Neon Noir", category: "studio", fallbackColor: "#09090b" },
  { id: "ocean-deep", name: "Ocean Deep", category: "studio", fallbackColor: "#041018" },
  { id: "apple-clean", name: "Apple Clean", category: "light", fallbackColor: "#f5f5f7" },
  { id: "concrete", name: "Concrete", category: "light", fallbackColor: "#e8e6e3" },
  { id: "paper-white", name: "Paper White", category: "light", fallbackColor: "#fafafa" },
  { id: "apple-dawn", name: "Apple Dawn", category: "color", fallbackColor: "#ffc8d8" },
  { id: "apple-wave", name: "Apple Wave", category: "color", fallbackColor: "#a8d8ff" },
  { id: "apple-bloom", name: "Apple Bloom", category: "color", fallbackColor: "#ffd0c4" },
  { id: "apple-dusk", name: "Apple Dusk", category: "color", fallbackColor: "#d4c4ff" },
  { id: "apple-silk", name: "Apple Silk", category: "color", fallbackColor: "#ffe8f5" },
  { id: "aurora-mesh", name: "Aurora Mesh", category: "color", fallbackColor: "#c7d2fe" },
  { id: "sunset-warm", name: "Sunset Warm", category: "color", fallbackColor: "#ffd4a8" },
  { id: "sage-minimal", name: "Sage Minimal", category: "color", fallbackColor: "#b8f0d8" },
];

export const DEFAULT_BACKGROUND_ID = "studio-pro";

export function getBackground(id: string): BackgroundPreset {
  return BACKGROUNDS.find((b) => b.id === id) ?? BACKGROUNDS[0];
}

/** Fonds clairs : catégories Clair + Coloré (tous les colorés sont lumineux style iOS) */
export function isLightBackground(id: string): boolean {
  const bg = getBackground(id);
  return bg.category === "light" || bg.category === "color";
}

export { isColorBackground };

export function drawBackground(
  ctx: CanvasRenderingContext2D,
  id: string,
  width: number,
  height: number
) {
  const preset = getBackground(id);
  ctx.fillStyle = preset.fallbackColor;
  ctx.fillRect(0, 0, width, height);

  switch (id) {
    case "studio-pro":
      drawStudioPro(ctx, width, height);
      break;
    case "spotlight":
      drawSpotlight(ctx, width, height);
      break;
    case "slate-studio":
      drawSlateStudio(ctx, width, height);
      break;
    case "carbon":
      drawCarbon(ctx, width, height);
      break;
    case "apple-clean":
      drawAppleClean(ctx, width, height);
      break;
    case "concrete":
      drawConcrete(ctx, width, height);
      break;
    case "paper-white":
      drawPaperWhite(ctx, width, height);
      break;
    case "neon-noir":
      drawNeonNoir(ctx, width, height);
      break;
    case "ocean-deep":
      drawOceanDeep(ctx, width, height);
      break;
    case "aurora-mesh":
    case "sunset-warm":
    case "sage-minimal":
    case "apple-dawn":
    case "apple-wave":
    case "apple-bloom":
    case "apple-dusk":
    case "apple-silk": {
      const spec = COLOR_BACKGROUND_SPECS[id];
      if (spec) drawColorBlobBackground(ctx, width, height, spec);
      break;
    }
    default:
      drawStudioPro(ctx, width, height);
  }

  drawNoise(ctx, width, height, id);
}

function radial(ctx: CanvasRenderingContext2D, stops: [number, string][], cx: number, cy: number, r: number) {
  const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
  stops.forEach(([pos, color]) => g.addColorStop(pos, color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function linear(ctx: CanvasRenderingContext2D, stops: [number, string][], x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1);
  stops.forEach(([pos, color]) => g.addColorStop(pos, color));
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function drawStudioPro(ctx: CanvasRenderingContext2D, w: number, h: number) {
  linear(ctx, [[0, "#0c0e14"], [0.55, "#06070a"], [1, "#030405"]], 0, 0, 0, h);
  radial(ctx, [[0, "rgba(255,255,255,0.04)"], [0.45, "transparent"]], w / 2, h * 0.28, w * 0.55);
  radial(ctx, [[0, "rgba(59,123,255,0.1)"], [0.6, "transparent"]], w / 2, h * 1.05, w * 0.65);
  radial(ctx, [[0, "rgba(0,0,0,0.5)"], [0.7, "transparent"]], w / 2, h / 2, w * 0.85);
}

function drawSpotlight(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#030303";
  ctx.fillRect(0, 0, w, h);
  radial(ctx, [[0, "rgba(255,255,255,0.09)"], [0.35, "rgba(255,255,255,0.02)"], [1, "transparent"]], w / 2, h * 0.38, w * 0.42);
  radial(ctx, [[0, "rgba(0,0,0,0)"], [0.6, "rgba(0,0,0,0.55)"], [1, "rgba(0,0,0,0.85)"]], w / 2, h / 2, w * 0.75);
}

function drawSlateStudio(ctx: CanvasRenderingContext2D, w: number, h: number) {
  linear(ctx, [[0, "#2a2f3a"], [0.4, "#1e222b"], [1, "#14171e"]], 0, 0, w * 0.2, h);
  radial(ctx, [[0, "rgba(255,255,255,0.08)"], [0.5, "transparent"]], w / 2, 0, w * 0.7);
  radial(ctx, [[0, "rgba(100,116,139,0.15)"], [1, "transparent"]], w / 2, h, w * 0.8);
}

function drawCarbon(ctx: CanvasRenderingContext2D, w: number, h: number) {
  linear(ctx, [[0, "#141416"], [0.5, "#0c0c0e"], [1, "#080809"]], 0, 0, w, h);
  radial(ctx, [[0, "rgba(255,255,255,0.025)"], [1, "transparent"]], w * 0.3, h * 0.2, w * 0.5);
}

function drawAppleClean(ctx: CanvasRenderingContext2D, w: number, h: number) {
  linear(ctx, [[0, "#fafafa"], [0.45, "#f5f5f7"], [1, "#ebebef"]], 0, 0, 0, h);
  radial(ctx, [[0, "rgba(255,255,255,0.9)"], [0.6, "transparent"]], w / 2, h * 0.15, w * 0.6);
  radial(ctx, [[0, "rgba(0,0,0,0.04)"], [1, "transparent"]], w / 2, h, w * 0.55);
}

function drawConcrete(ctx: CanvasRenderingContext2D, w: number, h: number) {
  linear(ctx, [[0, "#eceae7"], [0.5, "#e2dfdb"], [1, "#d8d4cf"]], 0, 0, w, h);
  radial(ctx, [[0, "rgba(255,255,255,0.5)"], [1, "transparent"]], w * 0.5, h * 0.3, w * 0.45);
}

function drawPaperWhite(ctx: CanvasRenderingContext2D, w: number, h: number) {
  linear(ctx, [[0, "#ffffff"], [1, "#f4f4f5"]], 0, 0, 0, h);
  radial(ctx, [[0, "rgba(59,123,255,0.04)"], [1, "transparent"]], w / 2, h / 2, w * 0.5);
}

function drawNeonNoir(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "#09090b";
  ctx.fillRect(0, 0, w, h);
  radial(ctx, [[0, "rgba(59,123,255,0.22)"], [0.55, "transparent"]], 0, h, w * 0.55);
  radial(ctx, [[0, "rgba(139,92,246,0.18)"], [0.55, "transparent"]], w, 0, w * 0.5);
  radial(ctx, [[0, "rgba(0,0,0,0)"], [0.65, "rgba(0,0,0,0.6)"]], w / 2, h / 2, w * 0.7);
}

function drawOceanDeep(ctx: CanvasRenderingContext2D, w: number, h: number) {
  linear(ctx, [[0, "#041018"], [0.45, "#062032"], [1, "#030a10"]], 0, 0, 0, h);
  radial(ctx, [[0, "rgba(56,189,248,0.12)"], [0.5, "transparent"]], w * 0.7, h * 0.25, w * 0.4);
  radial(ctx, [[0, "rgba(14,165,233,0.08)"], [0.6, "transparent"]], w * 0.2, h * 0.7, w * 0.45);
  radial(ctx, [[0, "rgba(255,255,255,0.03)"], [1, "transparent"]], w / 2, h * 0.35, w * 0.3);
}

function drawNoise(ctx: CanvasRenderingContext2D, w: number, h: number, id: string) {
  if (isColorBackground(id)) return;

  const light = isLightBackground(id);
  const opacity = light ? 0.01 : 0.018;
  const count = light ? (id === "concrete" ? 400 : 120) : id === "carbon" ? 500 : 200;
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = light
      ? `rgba(0,0,0,${Math.random() * opacity * 2})`
      : `rgba(255,255,255,${Math.random() * opacity * 2})`;
    ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
  }
}
