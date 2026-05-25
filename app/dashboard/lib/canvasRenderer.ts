import type { DeviceId } from "../components/Scene2D";
import type { AspectRatio, Pose } from "./motionPresets";
import { getFinalPose, getPoseAtTime, getPreset } from "./motionPresets";
import { drawBackground } from "./backgrounds";
import {
  DEVICE_SPECS,
  getScreenRect,
  type DeviceSpec,
  type SideButtonSpec,
} from "./deviceSpecs";

export type { DeviceSpec };
export { DEVICE_SPECS, getScreenRect };

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

/** Capsule — équivalent CSS `rounded-full` (demi-cercles parfaits) */
function drawCapsulePath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + r, r, Math.PI / 2, (Math.PI * 3) / 2);
  ctx.closePath();
}

/** Encoche — équivalent CSS `rounded-b-[Npx]` (coins bas uniquement) */
function drawNotchPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  bottomRadius: number
) {
  const r = Math.min(bottomRadius, w / 2, h);
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w, y + h - r);
  ctx.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
  ctx.lineTo(x + r, y + h);
  ctx.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI);
  ctx.lineTo(x, y);
  ctx.closePath();
}

function createFrameGradient(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const { width, height, frameGradient } = spec;
  if (frameGradient.type === "horizontal") {
    const g = ctx.createLinearGradient(0, 0, width, 0);
    g.addColorStop(0, frameGradient.stops[0]);
    g.addColorStop(0.5, frameGradient.stops[1]);
    g.addColorStop(1, frameGradient.stops[2]);
    return g;
  }
  const g = ctx.createLinearGradient(0, 0, width, height);
  g.addColorStop(0, frameGradient.stops[0]);
  g.addColorStop(0.5, frameGradient.stops[1]);
  g.addColorStop(1, frameGradient.stops[2]);
  return g;
}

function drawTopShine(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const { width, topShine } = spec;
  const x1 = width * topShine.startPct;
  const x2 = width * topShine.endPct;
  const shine = ctx.createLinearGradient(x1, 0, x2, 0);
  shine.addColorStop(0, "transparent");
  shine.addColorStop(0.5, `rgba(255,255,255,${topShine.opacity})`);
  shine.addColorStop(1, "transparent");
  ctx.fillStyle = shine;
  ctx.fillRect(x1, 0, x2 - x1, 1);
}

function drawInnerEdgeBorder(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const inset = 1;
  roundRect(
    ctx,
    inset,
    inset,
    spec.width - inset * 2,
    spec.height - inset * 2,
    spec.frameRadius - inset
  );
  ctx.strokeStyle = spec.innerEdgeBorder;
  ctx.lineWidth = 1;
  ctx.stroke();
}

function drawSideButton(ctx: CanvasRenderingContext2D, spec: DeviceSpec, btn: SideButtonSpec) {
  let x: number;
  let y = btn.top;
  const w = btn.width;
  const h = btn.height;

  if (btn.side === "left") {
    x = -2;
  } else if (btn.side === "right") {
    x = spec.width - 1;
  } else {
    x = spec.width - (btn.right ?? 0) - btn.width;
    y = btn.top;
  }

  ctx.fillStyle = btn.color;
  if (btn.side === "left") {
    roundRect(ctx, x, y, w, h, 2);
  } else if (btn.side === "right") {
    roundRect(ctx, x, y, w, h, 2);
  } else {
    roundRect(ctx, x, y, w, h, 1);
  }
  ctx.fill();

  if (btn.highlight === "left") {
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(x + 1, y, 1, h);
  } else if (btn.highlight === "right") {
    ctx.fillStyle = "rgba(255,255,255,0.2)";
    ctx.fillRect(x + w - 2, y, 1, h);
  }
}

function drawAntennaBands(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  for (const band of spec.antennaBands ?? []) {
    const x = band.side === "left" ? -1 : spec.width - 1;
    ctx.fillStyle = band.color;
    roundRect(ctx, x, band.top, band.width, band.height, 1);
    ctx.fill();
  }
}

function drawBezel(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const { width, height, bezelInset, frameRadius } = spec;
  const bezelRadius = frameRadius - bezelInset;
  const screen = getScreenRect(spec);

  roundRect(ctx, bezelInset, bezelInset, width - bezelInset * 2, height - bezelInset * 2, bezelRadius);
  ctx.fillStyle = "#000000";
  ctx.fill();

  ctx.save();
  roundRect(ctx, bezelInset, bezelInset, width - bezelInset * 2, height - bezelInset * 2, bezelRadius);
  ctx.clip();
  ctx.strokeStyle = spec.bezelInnerStroke;
  ctx.lineWidth = 2;
  roundRect(
    ctx,
    bezelInset + 1,
    bezelInset + 1,
    width - bezelInset * 2 - 2,
    height - bezelInset * 2 - 2,
    bezelRadius - 1
  );
  ctx.stroke();
  ctx.restore();

  roundRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.radius);
  ctx.fillStyle = "#06070a";
  ctx.fill();
}

function drawDynamicIsland(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const island = spec.dynamicIsland;
  if (!island) return;

  const { width: islandW, height: islandH, offsetTop } = island;
  const x = (spec.width - islandW) / 2;
  const y = spec.bezelInset + offsetTop;

  drawCapsulePath(ctx, x, y, islandW, islandH);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.05)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + 18, y + islandH / 2, 5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  ctx.fill();

  ctx.save();
  ctx.shadowColor = "rgba(59,130,246,0.5)";
  ctx.shadowBlur = 4;
  ctx.beginPath();
  ctx.arc(x + islandW - 18, y + islandH / 2, 5, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(59,130,246,0.2)";
  ctx.fill();
  ctx.restore();
}

function drawNotch(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const notch = spec.notch;
  if (!notch) return;

  const { width: notchW, height: notchH, bottomRadius } = notch;
  const x = (spec.width - notchW) / 2;
  const y = spec.bezelInset;

  drawNotchPath(ctx, x, y, notchW, notchH, bottomRadius);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + 27, y + 13, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = "#0d1117";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 0.5;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + notchW - 27, y + 13, 5.5, 0, Math.PI * 2);
  ctx.fillStyle = "#0a0c10";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.stroke();
}

function drawPunchHole(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  lensRadius: number
) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fillStyle = "#000000";
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.08)";
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, lensRadius, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(30,58,138,0.45)";
  ctx.fill();
}

function drawHomeIndicator(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const screen = getScreenRect(spec);
  const barW = 110;
  const barH = 4;
  const x = screen.x + (screen.width - barW) / 2;
  const y = screen.y + screen.height - 6 - barH;

  roundRect(ctx, x, y, barW, barH, barH / 2);
  ctx.fillStyle = "rgba(255,255,255,0.3)";
  ctx.fill();
}

function drawScreenGlare(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const screen = getScreenRect(spec);

  ctx.save();
  roundRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.radius);
  ctx.clip();

  switch (spec.screenGlare) {
    case "samsung-edges": {
      const left = ctx.createLinearGradient(screen.x, 0, screen.x + 10, 0);
      left.addColorStop(0, "rgba(255,255,255,0.05)");
      left.addColorStop(1, "transparent");
      ctx.fillStyle = left;
      ctx.fillRect(screen.x, screen.y, 10, screen.height);

      const right = ctx.createLinearGradient(screen.x + screen.width - 10, 0, screen.x + screen.width, 0);
      right.addColorStop(0, "transparent");
      right.addColorStop(1, "rgba(255,255,255,0.05)");
      ctx.fillStyle = right;
      ctx.fillRect(screen.x + screen.width - 10, screen.y, 10, screen.height);
      break;
    }
    case "ipad": {
      const glare = ctx.createLinearGradient(
        screen.x + screen.width,
        screen.y,
        screen.x,
        screen.y + screen.height
      );
      glare.addColorStop(0, "rgba(255,255,255,0.04)");
      glare.addColorStop(0.5, "transparent");
      glare.addColorStop(1, "transparent");
      ctx.fillStyle = glare;
      ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
      break;
    }
    case "iphone11": {
      const glare = ctx.createLinearGradient(
        screen.x,
        screen.y,
        screen.x + screen.width,
        screen.y + screen.height
      );
      glare.addColorStop(0, "transparent");
      glare.addColorStop(0.5, "rgba(255,255,255,0.06)");
      glare.addColorStop(1, "transparent");
      ctx.fillStyle = glare;
      ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
      break;
    }
    case "pixel": {
      const glare = ctx.createLinearGradient(
        screen.x,
        screen.y,
        screen.x + screen.width,
        screen.y + screen.height
      );
      glare.addColorStop(0, "transparent");
      glare.addColorStop(0.5, "rgba(255,255,255,0.06)");
      glare.addColorStop(1, "rgba(255,255,255,0.02)");
      ctx.fillStyle = glare;
      ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
      break;
    }
    default: {
      const glare = ctx.createLinearGradient(
        screen.x,
        screen.y,
        screen.x + screen.width,
        screen.y + screen.height
      );
      glare.addColorStop(0, "transparent");
      glare.addColorStop(0.5, "rgba(255,255,255,0.07)");
      glare.addColorStop(1, "transparent");
      ctx.fillStyle = glare;
      ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
    }
  }

  ctx.restore();
}

function drawDeviceOverlays(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const screen = getScreenRect(spec);

  switch (spec.id) {
    case "iphone15":
      drawDynamicIsland(ctx, spec);
      drawHomeIndicator(ctx, spec);
      break;
    case "iphone11":
      drawNotch(ctx, spec);
      drawHomeIndicator(ctx, spec);
      break;
    case "samsung":
      drawPunchHole(ctx, screen.x + screen.width / 2, screen.y + 17, 7, 2);
      break;
    case "pixel":
      drawPunchHole(ctx, screen.x + screen.width / 2, screen.y + 17.5, 5.5, 1.5);
      break;
    case "ipad": {
      const cx = spec.width / 2;
      const cy = spec.bezelInset + 16;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fillStyle = "#111111";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.05)";
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(30,58,138,0.3)";
      ctx.fill();
      break;
    }
  }
}

function drawVideoInScreen(
  ctx: CanvasRenderingContext2D,
  spec: DeviceSpec,
  video: HTMLVideoElement | null
) {
  const screen = getScreenRect(spec);

  ctx.save();
  roundRect(ctx, screen.x, screen.y, screen.width, screen.height, screen.radius);
  ctx.clip();

  if (video && video.readyState >= 2) {
    const vw = video.videoWidth;
    const vh = video.videoHeight;
    if (vw && vh) {
      const scale = Math.max(screen.width / vw, screen.height / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = screen.x + (screen.width - dw) / 2;
      const dy = screen.y + (screen.height - dh) / 2;
      ctx.drawImage(video, dx, dy, dw, dh);
    }
  } else {
    const grad = ctx.createLinearGradient(screen.x, screen.y, screen.x, screen.y + screen.height);
    grad.addColorStop(0, "#1e1b4b");
    grad.addColorStop(1, "#1e3a8a");
    ctx.fillStyle = grad;
    ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
  }

  ctx.restore();
}

function drawFloorShadow(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const { floorShadow } = spec;
  ctx.save();
  ctx.filter = "blur(18px)";
  ctx.fillStyle = `rgba(0,0,0,${floorShadow.opacity})`;
  ctx.beginPath();
  ctx.ellipse(
    spec.width / 2,
    spec.height + floorShadow.offsetY,
    spec.width * (floorShadow.widthPct / 2) * 0.5,
    floorShadow.height / 2,
    0,
    0,
    Math.PI * 2
  );
  ctx.fill();
  ctx.restore();
}

function drawDeviceBody(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  roundRect(ctx, 0, 0, spec.width, spec.height, spec.frameRadius);
  ctx.fillStyle = createFrameGradient(ctx, spec);
  ctx.fill();

  ctx.strokeStyle = spec.frameBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  drawInnerEdgeBorder(ctx, spec);
  drawTopShine(ctx, spec);

  for (const btn of spec.buttons) {
    drawSideButton(ctx, spec, btn);
  }

  drawAntennaBands(ctx, spec);
  drawBezel(ctx, spec);
}

export function drawMockupFrame(
  ctx: CanvasRenderingContext2D,
  options: {
    width: number;
    height: number;
    deviceId: DeviceId;
    pose: Pose;
    backgroundId: string;
    video: HTMLVideoElement | null;
    videoTime: number;
  }
) {
  const { width, height, deviceId, pose, backgroundId, video } = options;
  const spec = DEVICE_SPECS[deviceId];

  drawBackground(ctx, backgroundId, width, height);

  ctx.save();
  ctx.translate(width / 2 + pose.x, height / 2 + pose.y);
  ctx.rotate((pose.rotateZ * Math.PI) / 180);
  ctx.transform(1, 0, pose.rotateY / 90, 1, 0, 0);
  ctx.scale(pose.scale, pose.scale);
  ctx.globalAlpha = pose.opacity;
  ctx.translate(-spec.width / 2, -spec.height / 2);

  drawFloorShadow(ctx, spec);

  ctx.save();
  ctx.translate(spec.width / 2, spec.height / 2);
  ctx.rotate((pose.rotateX * Math.PI) / 180);
  ctx.translate(-spec.width / 2, -spec.height / 2);

  drawDeviceBody(ctx, spec);
  drawVideoInScreen(ctx, spec, video);
  drawScreenGlare(ctx, spec);
  drawDeviceOverlays(ctx, spec);

  ctx.restore();
  ctx.restore();
}

/** @deprecated Use DEVICE_SPECS — kept for type compat */
export const DEVICE_LAYOUTS = Object.fromEntries(
  Object.entries(DEVICE_SPECS).map(([id, spec]) => [
    id,
    {
      width: spec.width,
      height: spec.height,
      frameRadius: spec.frameRadius,
      bezelInset: spec.bezelInset,
      screenInset: spec.screenInset,
      screen: getScreenRect(spec),
      frameColors: { outer: spec.frameGradient.stops[0], inner: spec.frameGradient.stops[1], bezel: "#000000" },
    },
  ])
) as Record<DeviceId, unknown>;

export function getVideoTimeForExport(globalTime: number, introDuration: number): number {
  return Math.max(0, globalTime - introDuration);
}

export function getPoseForExport(
  presetId: string,
  globalTime: number,
  aspectRatio: AspectRatio,
  deviceId: DeviceId
): Pose {
  const config = getPreset(presetId);
  if (globalTime >= config.duration) {
    return getFinalPose(aspectRatio, deviceId);
  }
  return getPoseAtTime(presetId, globalTime, aspectRatio, deviceId);
}
