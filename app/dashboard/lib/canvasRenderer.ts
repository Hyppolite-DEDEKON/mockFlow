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
import {
  bilinearInQuad,
  getMacBookLayout,
  quadPath,
  type Point2D,
} from "./macbookGeometry";

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
    case "desktop": {
      const glare = ctx.createLinearGradient(
        screen.x,
        screen.y,
        screen.x + screen.width * 0.6,
        screen.y + screen.height
      );
      glare.addColorStop(0, "rgba(255,255,255,0.06)");
      glare.addColorStop(0.4, "transparent");
      glare.addColorStop(1, "transparent");
      ctx.fillStyle = glare;
      ctx.fillRect(screen.x, screen.y, screen.width, screen.height);
      break;
    }
    case "pc": {
      const glare = ctx.createLinearGradient(
        screen.x,
        screen.y,
        screen.x + screen.width,
        screen.y + screen.height * 0.5
      );
      glare.addColorStop(0, "rgba(255,255,255,0.05)");
      glare.addColorStop(0.35, "transparent");
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
    case "desktop":
      break;
    case "pc": {
      const cx = spec.width / 2;
      const cy = screen.y - 4;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fillStyle = "#0a0a0c";
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.lineWidth = 0.5;
      ctx.stroke();
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
      const isWideScreen = spec.id === "desktop" || spec.id === "pc";
      const scale = isWideScreen
        ? Math.min(screen.width / vw, screen.height / vh)
        : Math.max(screen.width / vw, screen.height / vh);
      const dw = vw * scale;
      const dh = vh * scale;
      const dx = screen.x + (screen.width - dw) / 2;
      const dy = isWideScreen ? screen.y : screen.y + (screen.height - dh) / 2;
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

function fillQuad(
  ctx: CanvasRenderingContext2D,
  quad: [Point2D, Point2D, Point2D, Point2D],
  fill: string | CanvasGradient
) {
  quadPath(ctx, quad);
  ctx.fillStyle = fill;
  ctx.fill();
}

function drawImageInQuad(
  ctx: CanvasRenderingContext2D,
  source: HTMLVideoElement,
  quad: [Point2D, Point2D, Point2D, Point2D]
) {
  const iw = source.videoWidth;
  const ih = source.videoHeight;
  if (!iw || !ih) return;

  const strips = 36;
  ctx.save();
  quadPath(ctx, quad);
  ctx.clip();

  for (let i = 0; i < strips; i++) {
    const v0 = i / strips;
    const v1 = (i + 1) / strips;
    const tl = bilinearInQuad(quad, 0, v0);
    const tr = bilinearInQuad(quad, 1, v0);
    const bl = bilinearInQuad(quad, 0, v1);
    const br = bilinearInQuad(quad, 1, v1);

    const minX = Math.min(tl.x, tr.x, bl.x, br.x);
    const maxX = Math.max(tl.x, tr.x, bl.x, br.x);
    const minY = Math.min(tl.y, tr.y, bl.y, br.y);
    const maxY = Math.max(tl.y, tr.y, bl.y, br.y);

    ctx.drawImage(source, 0, v0 * ih, iw, ih / strips, minX, minY, maxX - minX, maxY - minY);
  }

  ctx.restore();
}

function drawMacBookKeyboardPerspective(
  ctx: CanvasRenderingContext2D,
  kbQuad: [Point2D, Point2D, Point2D, Point2D]
) {
  const rows = [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4],
    [1.2, 1, 1, 1, 4.5, 1, 1, 1, 1.2],
  ];

  const uPad = 0.06;
  const vKey0 = 0.07;
  const vKey1 = 0.5;
  const gap = 0.006;

  rows.forEach((flexes, rowIdx) => {
    const v0 = vKey0 + ((vKey1 - vKey0) * rowIdx) / rows.length + gap;
    const v1 = vKey0 + ((vKey1 - vKey0) * (rowIdx + 1)) / rows.length - gap;
    const totalFlex = flexes.reduce((a, b) => a + b, 0);
    let u = uPad;

    flexes.forEach((flex) => {
      const u1 = u + ((1 - uPad * 2) * flex) / totalFlex - gap;
      const keyQuad: [Point2D, Point2D, Point2D, Point2D] = [
        bilinearInQuad(kbQuad, u, v0),
        bilinearInQuad(kbQuad, u1, v0),
        bilinearInQuad(kbQuad, u1, v1),
        bilinearInQuad(kbQuad, u, v1),
      ];
      quadPath(ctx, keyQuad);
      const cx = (keyQuad[0].x + keyQuad[2].x) / 2;
      const cy = (keyQuad[0].y + keyQuad[2].y) / 2;
      const g = ctx.createLinearGradient(cx, cy - 4, cx, cy + 4);
      g.addColorStop(0, "#2a2a2c");
      g.addColorStop(1, "#1a1a1c");
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "rgba(0,0,0,0.45)";
      ctx.lineWidth = 0.4;
      ctx.stroke();
      u = u1 + gap;
    });
  });

  const tpQuad: [Point2D, Point2D, Point2D, Point2D] = [
    bilinearInQuad(kbQuad, 0.28, 0.58),
    bilinearInQuad(kbQuad, 0.72, 0.58),
    bilinearInQuad(kbQuad, 0.72, 0.9),
    bilinearInQuad(kbQuad, 0.28, 0.9),
  ];
  quadPath(ctx, tpQuad);
  const tcx = (tpQuad[0].x + tpQuad[2].x) / 2;
  const tcy = (tpQuad[0].y + tpQuad[2].y) / 2;
  const tpGrad = ctx.createLinearGradient(tcx - 40, tcy - 20, tcx + 40, tcy + 20);
  tpGrad.addColorStop(0, "rgba(255,255,255,0.22)");
  tpGrad.addColorStop(0.5, "rgba(180,188,200,0.35)");
  tpGrad.addColorStop(1, "rgba(140,150,165,0.45)");
  ctx.fillStyle = tpGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.28)";
  ctx.lineWidth = 0.8;
  ctx.stroke();
}

function drawDesktopDevice(
  ctx: CanvasRenderingContext2D,
  spec: DeviceSpec,
  video: HTMLVideoElement | null
) {
  const layout = getMacBookLayout(spec);
  const { screenQuad, keyboardQuad, videoQuad, hingeY } = layout;

  // Capot aluminium
  const lidGrad = ctx.createLinearGradient(screenQuad[0].x, screenQuad[0].y, screenQuad[3].x, screenQuad[3].y);
  lidGrad.addColorStop(0, "#e8ebf0");
  lidGrad.addColorStop(0.5, "#c2cad6");
  lidGrad.addColorStop(1, "#a3aec0");
  fillQuad(ctx, screenQuad, lidGrad);
  ctx.strokeStyle = "rgba(255,255,255,0.3)";
  ctx.lineWidth = 1;
  quadPath(ctx, screenQuad);
  ctx.stroke();

  // Bezel écran
  const bezelQuad: [Point2D, Point2D, Point2D, Point2D] = [
    bilinearInQuad(screenQuad, 0.02, 0.02),
    bilinearInQuad(screenQuad, 0.98, 0.02),
    bilinearInQuad(screenQuad, 0.98, 0.98),
    bilinearInQuad(screenQuad, 0.02, 0.98),
  ];
  fillQuad(ctx, bezelQuad, "#0a0a0c");

  // Vidéo
  if (video && video.readyState >= 2) {
    drawImageInQuad(ctx, video, videoQuad);
  } else {
    fillQuad(ctx, videoQuad, "#06070a");
    const grad = ctx.createLinearGradient(videoQuad[0].x, videoQuad[0].y, videoQuad[3].x, videoQuad[3].y);
    grad.addColorStop(0, "#1e1b4b");
    grad.addColorStop(1, "#1e3a8a");
    fillQuad(ctx, videoQuad, grad);
  }

  // Reflet écran
  ctx.save();
  quadPath(ctx, videoQuad);
  ctx.clip();
  const glare = ctx.createLinearGradient(
    videoQuad[0].x,
    videoQuad[0].y,
    videoQuad[2].x,
    videoQuad[2].y
  );
  glare.addColorStop(0, "rgba(255,255,255,0.06)");
  glare.addColorStop(0.4, "transparent");
  ctx.fillStyle = glare;
  ctx.fillRect(videoQuad[0].x, videoQuad[0].y, spec.width, spec.height);
  ctx.restore();

  // Charnière
  ctx.fillStyle = "#4b5563";
  ctx.fillRect(spec.width * 0.06, hingeY - 1, spec.width * 0.88, 3);

  // Plateau clavier
  const kbGrad = ctx.createLinearGradient(keyboardQuad[3].x, keyboardQuad[3].y, keyboardQuad[0].x, keyboardQuad[0].y);
  kbGrad.addColorStop(0, "#c8ced8");
  kbGrad.addColorStop(0.5, "#a8b0bc");
  kbGrad.addColorStop(1, "#949eb0");
  fillQuad(ctx, keyboardQuad, kbGrad);
  ctx.strokeStyle = "rgba(255,255,255,0.2)";
  ctx.lineWidth = 1;
  quadPath(ctx, keyboardQuad);
  ctx.stroke();

  drawMacBookKeyboardPerspective(ctx, keyboardQuad);
}

function drawPCDevice(ctx: CanvasRenderingContext2D, spec: DeviceSpec) {
  const monitorH = spec.height - (spec.keyboardHeight ?? 96);
  const r = spec.frameRadius;
  const screen = getScreenRect(spec);

  const panelGrad = ctx.createLinearGradient(0, 0, 0, monitorH);
  panelGrad.addColorStop(0, "#2d2d30");
  panelGrad.addColorStop(1, "#1a1a1c");
  roundRect(ctx, 0, 0, spec.width, monitorH, r);
  ctx.fillStyle = panelGrad;
  ctx.fill();
  ctx.strokeStyle = spec.frameBorder;
  ctx.lineWidth = 1;
  ctx.stroke();

  roundRect(ctx, screen.x - 2, screen.y - 2, screen.width + 4, screen.height + 4, screen.radius + 2);
  ctx.fillStyle = "#000000";
  ctx.fill();

  // Chin indicator
  ctx.fillStyle = "rgba(255,255,255,0.1)";
  roundRect(ctx, spec.width / 2 - 16, monitorH - 12, 32, 3, 1.5);
  ctx.fill();

  // Stand neck
  const neckW = 52;
  const neckX = (spec.width - neckW) / 2;
  ctx.fillStyle = "#3a3a3c";
  ctx.beginPath();
  ctx.moveTo(neckX + neckW * 0.15, monitorH - 1);
  ctx.lineTo(neckX + neckW * 0.85, monitorH - 1);
  ctx.lineTo(neckX + neckW, monitorH + 47);
  ctx.lineTo(neckX, monitorH + 47);
  ctx.closePath();
  ctx.fill();

  // Stand base
  const baseW = 180;
  const baseX = (spec.width - baseW) / 2;
  const baseY = spec.height - 14;
  const baseGrad = ctx.createLinearGradient(0, baseY, 0, spec.height);
  baseGrad.addColorStop(0, "#3a3a3c");
  baseGrad.addColorStop(1, "#222224");
  roundRect(ctx, baseX, baseY, baseW, 14, 4);
  ctx.fillStyle = baseGrad;
  ctx.fill();
  ctx.strokeStyle = "rgba(255,255,255,0.1)";
  ctx.lineWidth = 1;
  ctx.stroke();
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
  const { width, height, deviceId, pose, backgroundId, video, videoTime } = options;
  const spec = DEVICE_SPECS[deviceId];

  if (video && Number.isFinite(videoTime) && Math.abs(video.currentTime - videoTime) > 0.04) {
    video.currentTime = videoTime;
  }

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

  if (spec.id === "desktop") {
    drawDesktopDevice(ctx, spec, video);
  } else if (spec.id === "pc") {
    drawPCDevice(ctx, spec);
    drawVideoInScreen(ctx, spec, video);
    drawScreenGlare(ctx, spec);
    drawDeviceOverlays(ctx, spec);
  } else {
    drawDeviceBody(ctx, spec);
    drawVideoInScreen(ctx, spec, video);
    drawScreenGlare(ctx, spec);
    drawDeviceOverlays(ctx, spec);
  }

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
