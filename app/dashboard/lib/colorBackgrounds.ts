export interface ColorBlob {
  hex: string;
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

export interface ColorBackgroundSpec {
  base: string;
  blobs: ColorBlob[];
}

/** Dégradés iOS — base teintée + blobs saturés */
export const COLOR_BACKGROUND_SPECS: Record<string, ColorBackgroundSpec> = {
  "apple-dawn": {
    base: "linear-gradient(145deg, #ffc8d8 0%, #ffe0ec 35%, #fff0f6 70%, #fff8fb 100%)",
    blobs: [
      { hex: "#FF2D55", x: 0.12, y: 0.28, radius: 0.52, alpha: 0.72 },
      { hex: "#FF9F0A", x: 0.88, y: 0.18, radius: 0.46, alpha: 0.65 },
      { hex: "#BF5AF2", x: 0.58, y: 0.78, radius: 0.48, alpha: 0.58 },
      { hex: "#FF6482", x: 0.45, y: 0.48, radius: 0.55, alpha: 0.4 },
    ],
  },
  "apple-wave": {
    base: "linear-gradient(160deg, #a8d8ff 0%, #cce9ff 40%, #e8f4ff 75%, #f5faff 100%)",
    blobs: [
      { hex: "#007AFF", x: 0.18, y: 0.25, radius: 0.5, alpha: 0.7 },
      { hex: "#5AC8FA", x: 0.82, y: 0.38, radius: 0.44, alpha: 0.68 },
      { hex: "#32ADE6", x: 0.4, y: 0.82, radius: 0.46, alpha: 0.55 },
      { hex: "#64D2FF", x: 0.62, y: 0.12, radius: 0.38, alpha: 0.5 },
    ],
  },
  "apple-bloom": {
    base: "linear-gradient(135deg, #ffd0c4 0%, #ffe8dc 40%, #fff5f0 100%)",
    blobs: [
      { hex: "#FF375F", x: 0.78, y: 0.22, radius: 0.48, alpha: 0.75 },
      { hex: "#FF9500", x: 0.1, y: 0.48, radius: 0.44, alpha: 0.7 },
      { hex: "#FF6482", x: 0.48, y: 0.08, radius: 0.38, alpha: 0.55 },
      { hex: "#FF6B35", x: 0.35, y: 0.85, radius: 0.42, alpha: 0.5 },
    ],
  },
  "apple-dusk": {
    base: "linear-gradient(150deg, #d4c4ff 0%, #e8deff 40%, #f5f0ff 100%)",
    blobs: [
      { hex: "#5E5CE6", x: 0.22, y: 0.2, radius: 0.5, alpha: 0.72 },
      { hex: "#BF5AF2", x: 0.85, y: 0.48, radius: 0.46, alpha: 0.68 },
      { hex: "#AF52DE", x: 0.12, y: 0.72, radius: 0.42, alpha: 0.58 },
      { hex: "#5856D6", x: 0.52, y: 0.38, radius: 0.52, alpha: 0.42 },
    ],
  },
  "apple-silk": {
    base: "linear-gradient(180deg, #ffe8f5 0%, #e8f4ff 45%, #fff5e8 100%)",
    blobs: [
      { hex: "#FF9FF3", x: 0.15, y: 0.25, radius: 0.42, alpha: 0.62 },
      { hex: "#5AC8FA", x: 0.78, y: 0.2, radius: 0.4, alpha: 0.6 },
      { hex: "#FFD60A", x: 0.55, y: 0.72, radius: 0.44, alpha: 0.45 },
      { hex: "#C4B5FD", x: 0.35, y: 0.42, radius: 0.38, alpha: 0.55 },
      { hex: "#6EE7B7", x: 0.68, y: 0.55, radius: 0.32, alpha: 0.4 },
    ],
  },
  "aurora-mesh": {
    base: "linear-gradient(135deg, #c7d2fe 0%, #ddd6fe 50%, #e0f2fe 100%)",
    blobs: [
      { hex: "#6366F1", x: 0.12, y: 0.22, radius: 0.46, alpha: 0.65 },
      { hex: "#3B82F6", x: 0.88, y: 0.15, radius: 0.4, alpha: 0.6 },
      { hex: "#A855F7", x: 0.55, y: 0.88, radius: 0.48, alpha: 0.58 },
      { hex: "#38BDF8", x: 0.28, y: 0.62, radius: 0.36, alpha: 0.52 },
    ],
  },
  "sunset-warm": {
    base: "linear-gradient(145deg, #ffd4a8 0%, #ffe4cc 45%, #fff5eb 100%)",
    blobs: [
      { hex: "#FF9500", x: 0.78, y: 0.18, radius: 0.46, alpha: 0.7 },
      { hex: "#FF6482", x: 0.15, y: 0.68, radius: 0.42, alpha: 0.62 },
      { hex: "#FFCC00", x: 0.48, y: 0.42, radius: 0.5, alpha: 0.45 },
    ],
  },
  "sage-minimal": {
    base: "linear-gradient(160deg, #b8f0d8 0%, #d4f5e4 50%, #ecfdf5 100%)",
    blobs: [
      { hex: "#34C759", x: 0.48, y: 0.25, radius: 0.46, alpha: 0.6 },
      { hex: "#30D158", x: 0.82, y: 0.72, radius: 0.38, alpha: 0.52 },
      { hex: "#86EFAC", x: 0.18, y: 0.55, radius: 0.4, alpha: 0.45 },
    ],
  },
};

export const COLOR_BACKGROUND_IDS = new Set(Object.keys(COLOR_BACKGROUND_SPECS));

export function isColorBackground(id: string): boolean {
  return COLOR_BACKGROUND_IDS.has(id);
}

function hexToRgb(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function drawColorBlobBackground(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  spec: ColorBackgroundSpec
) {
  fillBaseGradient(ctx, w, h, spec.base);

  const size = Math.max(w, h);
  for (const blob of spec.blobs) {
    const { r, g: gv, b } = hexToRgb(blob.hex);
    const cx = blob.x * w;
    const cy = blob.y * h;
    const radius = blob.radius * size;
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
    grad.addColorStop(0, `rgba(${r},${gv},${b},${Math.min(1, blob.alpha * 1.1)})`);
    grad.addColorStop(0.25, `rgba(${r},${gv},${b},${blob.alpha * 0.85})`);
    grad.addColorStop(0.5, `rgba(${r},${gv},${b},${blob.alpha * 0.45})`);
    grad.addColorStop(0.75, `rgba(${r},${gv},${b},${blob.alpha * 0.12})`);
    grad.addColorStop(1, "transparent");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }
}

/** Parse linear-gradient CSS into canvas linear gradient */
export function fillBaseGradient(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cssGradient: string
) {
  const colors = cssGradient.match(/#[0-9a-fA-F]{6}/g) ?? ["#ffffff", "#f0f0f0"];
  const grad = ctx.createLinearGradient(0, 0, w * 0.7, h);
  colors.forEach((color, i) => {
    grad.addColorStop(i / (colors.length - 1), color);
  });
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}
