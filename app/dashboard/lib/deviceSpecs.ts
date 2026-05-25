import type { DeviceId } from "../components/Scene2D";

export interface SideButtonSpec {
  side: "left" | "right" | "top";
  top: number;
  right?: number;
  width: number;
  height: number;
  color: string;
  highlight?: "left" | "right";
}

export interface AntennaBandSpec {
  side: "left" | "right";
  top: number;
  width: number;
  height: number;
  color: string;
}

export interface DeviceSpec {
  id: DeviceId;
  width: number;
  height: number;
  frameRadius: number;
  bezelInset: number;
  screenInset: number;
  screenRadius: number;
  frameGradient: {
    type: "diagonal" | "horizontal";
    stops: [string, string, string];
  };
  frameBorder: string;
  innerEdgeBorder: string;
  topShine: { startPct: number; endPct: number; opacity: number };
  bezelInnerStroke: string;
  buttons: SideButtonSpec[];
  antennaBands?: AntennaBandSpec[];
  floorShadow: { opacity: number; offsetY: number; height: number; widthPct: number };
  screenGlare: "iphone" | "iphone11" | "samsung-edges" | "pixel" | "ipad";
  dynamicIsland?: { width: number; height: number; offsetTop: number };
  notch?: { width: number; height: number; bottomRadius: number };
}

export const DEVICE_SPECS: Record<DeviceId, DeviceSpec> = {
  iphone15: {
    id: "iphone15",
    width: 260,
    height: 536,
    frameRadius: 42,
    bezelInset: 4,
    screenInset: 6,
    screenRadius: 32,
    frameGradient: {
      type: "diagonal",
      stops: ["#5a5c64", "#3a3b3e", "#1a1b1e"],
    },
    frameBorder: "rgba(255,255,255,0.2)",
    innerEdgeBorder: "rgba(255,255,255,0.1)",
    topShine: { startPct: 0.2, endPct: 0.8, opacity: 0.3 },
    bezelInnerStroke: "rgba(255,255,255,0.05)",
    antennaBands: [
      { side: "left", top: 30, width: 2, height: 5, color: "#1a1b1e" },
      { side: "right", top: 30, width: 2, height: 5, color: "#1a1b1e" },
    ],
    buttons: [
      { side: "left", top: 100, width: 3, height: 25, color: "#2a2b2e", highlight: "left" },
      { side: "left", top: 140, width: 3, height: 45, color: "#2a2b2e", highlight: "left" },
      { side: "left", top: 195, width: 3, height: 45, color: "#2a2b2e", highlight: "left" },
      { side: "right", top: 150, width: 3, height: 70, color: "#2a2b2e", highlight: "right" },
    ],
    floorShadow: { opacity: 0.5, offsetY: 10, height: 10, widthPct: 0.8 },
    screenGlare: "iphone",
    dynamicIsland: { width: 85, height: 25, offsetTop: 10 },
  },
  iphone11: {
    id: "iphone11",
    width: 258,
    height: 528,
    frameRadius: 40,
    bezelInset: 5,
    screenInset: 7,
    screenRadius: 28,
    frameGradient: {
      type: "diagonal",
      stops: ["#4a4a4e", "#2c2c30", "#141416"],
    },
    frameBorder: "rgba(255,255,255,0.15)",
    innerEdgeBorder: "rgba(255,255,255,0.08)",
    topShine: { startPct: 0.18, endPct: 0.82, opacity: 0.25 },
    bezelInnerStroke: "rgba(255,255,255,0.04)",
    buttons: [
      { side: "left", top: 96, width: 3, height: 22, color: "#252528", highlight: "left" },
      { side: "left", top: 128, width: 3, height: 42, color: "#252528", highlight: "left" },
      { side: "left", top: 178, width: 3, height: 42, color: "#252528", highlight: "left" },
      { side: "right", top: 130, width: 3, height: 64, color: "#252528", highlight: "right" },
    ],
    floorShadow: { opacity: 0.45, offsetY: 10, height: 10, widthPct: 0.8 },
    screenGlare: "iphone11",
    notch: { width: 126, height: 28, bottomRadius: 18 },
  },
  samsung: {
    id: "samsung",
    width: 270,
    height: 556,
    frameRadius: 6,
    bezelInset: 3,
    screenInset: 4,
    screenRadius: 2,
    frameGradient: {
      type: "horizontal",
      stops: ["#181818", "#404040", "#181818"],
    },
    frameBorder: "rgba(255,255,255,0.08)",
    innerEdgeBorder: "rgba(255,255,255,0.08)",
    topShine: { startPct: 0.2, endPct: 0.8, opacity: 0.2 },
    bezelInnerStroke: "rgba(255,255,255,0.1)",
    buttons: [
      { side: "right", top: 120, width: 3, height: 40, color: "#2a2b2e", highlight: "right" },
      { side: "right", top: 180, width: 3, height: 70, color: "#2a2b2e", highlight: "right" },
    ],
    floorShadow: { opacity: 0.5, offsetY: 10, height: 10, widthPct: 0.8 },
    screenGlare: "samsung-edges",
  },
  pixel: {
    id: "pixel",
    width: 264,
    height: 540,
    frameRadius: 32,
    bezelInset: 4,
    screenInset: 5,
    screenRadius: 24,
    frameGradient: {
      type: "diagonal",
      stops: ["#3d3f44", "#2a2b2f", "#1c1d20"],
    },
    frameBorder: "rgba(255,255,255,0.15)",
    innerEdgeBorder: "rgba(255,255,255,0.08)",
    topShine: { startPct: 0.2, endPct: 0.8, opacity: 0.25 },
    bezelInnerStroke: "rgba(255,255,255,0.06)",
    buttons: [
      { side: "right", top: 110, width: 3, height: 36, color: "#252628", highlight: "right" },
      { side: "right", top: 158, width: 3, height: 58, color: "#252628", highlight: "right" },
    ],
    floorShadow: { opacity: 0.5, offsetY: 10, height: 10, widthPct: 0.8 },
    screenGlare: "pixel",
  },
  ipad: {
    id: "ipad",
    width: 380,
    height: 506,
    frameRadius: 24,
    bezelInset: 3,
    screenInset: 24,
    screenRadius: 6,
    frameGradient: {
      type: "diagonal",
      stops: ["#e5e7eb", "#b0b8c4", "#8b95a5"],
    },
    frameBorder: "rgba(255,255,255,0.4)",
    innerEdgeBorder: "rgba(0,0,0,0.1)",
    topShine: { startPct: 0.2, endPct: 0.8, opacity: 0.35 },
    bezelInnerStroke: "rgba(255,255,255,0.1)",
    buttons: [{ side: "top", top: -2, right: 40, width: 40, height: 3, color: "#9ca3af" }],
    floorShadow: { opacity: 0.4, offsetY: 12, height: 12, widthPct: 0.9 },
    screenGlare: "ipad",
  },
};

export function getScreenRect(spec: DeviceSpec) {
  const x = spec.bezelInset + spec.screenInset;
  const y = spec.bezelInset + spec.screenInset;
  return {
    x,
    y,
    width: spec.width - x * 2,
    height: spec.height - y * 2,
    radius: spec.screenRadius,
  };
}

export function specToCssSize(spec: DeviceSpec) {
  return {
    width: `${spec.width}px`,
    height: `${spec.height}px`,
    borderRadius: `${spec.frameRadius}px`,
  };
}
