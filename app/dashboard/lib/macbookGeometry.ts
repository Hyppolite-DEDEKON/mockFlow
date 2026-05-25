import type { DeviceSpec } from "./deviceSpecs";

/** Inclinaison de l'écran vers l'arrière (depuis face caméra) — léger */
export const MACBOOK_LID_OPEN_DEG = 11;
/** Inclinaison du plateau clavier vers la caméra (charnière en haut) */
export const MACBOOK_KEYBOARD_TILT_DEG = 50;
/** Vue globale légèrement plongeante */
export const MACBOOK_VIEW_TILT_DEG = 12;

export interface Point2D {
  x: number;
  y: number;
}

export interface MacBookLayout {
  hingeY: number;
  lidH: number;
  kbH: number;
  screenQuad: [Point2D, Point2D, Point2D, Point2D];
  keyboardQuad: [Point2D, Point2D, Point2D, Point2D];
  videoQuad: [Point2D, Point2D, Point2D, Point2D];
}

export function bilinearInQuad(
  quad: [Point2D, Point2D, Point2D, Point2D],
  u: number,
  v: number
): Point2D {
  const [tl, tr, br, bl] = quad;
  const top = lerpPt(tl, tr, u);
  const bottom = lerpPt(bl, br, u);
  return lerpPt(top, bottom, v);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function lerpPt(a: Point2D, b: Point2D, t: number): Point2D {
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) };
}

/** Projection 2D — écran quasi face caméra, clavier en trapèze visible */
export function getMacBookLayout(spec: DeviceSpec): MacBookLayout {
  const w = spec.width;
  const kbH = spec.keyboardHeight ?? 128;
  const lidH = spec.height - kbH;

  const hingeY = lidH - 2;
  const recline = (MACBOOK_LID_OPEN_DEG * Math.PI) / 180;

  const screenBottomY = hingeY;
  const screenTopY = hingeY - lidH * Math.cos(recline) + 4;
  const topInset = 10 + MACBOOK_LID_OPEN_DEG * 0.4;
  const bottomOutset = 4;

  const screenQuad: [Point2D, Point2D, Point2D, Point2D] = [
    { x: topInset, y: screenTopY },
    { x: w - topInset, y: screenTopY },
    { x: w - bottomOutset, y: screenBottomY },
    { x: bottomOutset, y: screenBottomY },
  ];

  const kbDepth = kbH * 0.92;
  const kbBackY = hingeY + 6;
  const kbFrontY = kbBackY + kbDepth;
  const kbBackInset = 22;
  const kbFrontInset = 2;

  const keyboardQuad: [Point2D, Point2D, Point2D, Point2D] = [
    { x: kbBackInset, y: kbBackY },
    { x: w - kbBackInset, y: kbBackY },
    { x: w - kbFrontInset, y: kbFrontY },
    { x: kbFrontInset, y: kbFrontY },
  ];

  const screen = spec.screenRect ?? {
    x: 14,
    y: 14,
    width: w - 28,
    height: lidH - 28,
    radius: 8,
  };

  const u0 = screen.x / w;
  const u1 = (screen.x + screen.width) / w;
  const v0 = screen.y / lidH;
  const v1 = (screen.y + screen.height) / lidH;

  const videoQuad: [Point2D, Point2D, Point2D, Point2D] = [
    bilinearInQuad(screenQuad, u0, v0),
    bilinearInQuad(screenQuad, u1, v0),
    bilinearInQuad(screenQuad, u1, v1),
    bilinearInQuad(screenQuad, u0, v1),
  ];

  return { hingeY, lidH, kbH, screenQuad, keyboardQuad, videoQuad };
}

export function quadPath(
  ctx: CanvasRenderingContext2D,
  quad: [Point2D, Point2D, Point2D, Point2D]
) {
  const [tl, tr, br, bl] = quad;
  ctx.beginPath();
  ctx.moveTo(tl.x, tl.y);
  ctx.lineTo(tr.x, tr.y);
  ctx.lineTo(br.x, br.y);
  ctx.lineTo(bl.x, bl.y);
  ctx.closePath();
}
