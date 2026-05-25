import type { DeviceId } from "../components/Scene2D";

export type AnimationPreset = "reveal" | "focus" | "zoom" | "slide" | "static";
export type AspectRatio = "16:9" | "9:16" | "1:1";

export interface Pose {
  x: number;
  y: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
  scale: number;
  opacity: number;
}

export interface MotionPresetConfig {
  id: AnimationPreset;
  label: string;
  description: string;
  duration: number;
  initial: Pose;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function getFinalScale(
  aspectRatio: AspectRatio,
  deviceId: DeviceId,
): number {
  const scales: Record<AspectRatio, Record<DeviceId, number>> = {
    "9:16": {
      iphone15: 1.05,
      iphone11: 1.04,
      samsung: 1.02,
      pixel: 1.03,
      ipad: 0.82,
      desktop: 0.56,
      pc: 0.46,
    },
    "16:9": {
      iphone15: 0.68,
      iphone11: 0.67,
      samsung: 0.66,
      pixel: 0.67,
      ipad: 0.58,
      desktop: 0.82,
      pc: 0.76,
    },
    "1:1": {
      iphone15: 0.82,
      iphone11: 0.81,
      samsung: 0.8,
      pixel: 0.81,
      ipad: 0.68,
      desktop: 0.64,
      pc: 0.52,
    },
  };
  return scales[aspectRatio][deviceId];
}

/** Pose finale : téléphone face caméra, écran bien lisible pour tuto */
export function getFinalPose(
  aspectRatio: AspectRatio,
  deviceId: DeviceId,
): Pose {
  return {
    x: 0,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: getFinalScale(aspectRatio, deviceId),
    opacity: 1,
  };
}

export const MOTION_PRESETS: MotionPresetConfig[] = [
  {
    id: "reveal",
    label: "Reveal",
    description: "Montée depuis le bas",
    duration: 1.8,
    initial: {
      x: 0,
      y: 120,
      rotateX: 18,
      rotateY: -6,
      rotateZ: 0,
      scale: 0.62,
      opacity: 1,
    },
  },
  {
    id: "focus",
    label: "Focus",
    description: "Rotation vers la caméra",
    duration: 1.6,
    initial: {
      x: 0,
      y: 10,
      rotateX: 10,
      rotateY: -38,
      rotateZ: 0,
      scale: 0.68,
      opacity: 1,
    },
  },
  {
    id: "zoom",
    label: "Zoom",
    description: "Zoom sur l'écran",
    duration: 1.5,
    initial: {
      x: 0,
      y: 0,
      rotateX: 6,
      rotateY: 0,
      rotateZ: 0,
      scale: 0.48,
      opacity: 1,
    },
  },
  {
    id: "slide",
    label: "Slide",
    description: "Entrée latérale",
    duration: 1.7,
    initial: {
      x: -160,
      y: 0,
      rotateX: 0,
      rotateY: 28,
      rotateZ: -2,
      scale: 0.72,
      opacity: 1,
    },
  },
  {
    id: "static",
    label: "Static",
    description: "Aucune animation",
    duration: 0,
    initial: {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      opacity: 1,
    },
  },
];

export function getPreset(id: string): MotionPresetConfig {
  return MOTION_PRESETS.find((p) => p.id === id) ?? MOTION_PRESETS[0];
}

export function getPoseAtTime(
  presetId: string,
  time: number,
  aspectRatio: AspectRatio,
  deviceId: DeviceId,
): Pose {
  const preset = getPreset(presetId);
  const final = getFinalPose(aspectRatio, deviceId);

  if (preset.id === "static" || preset.duration === 0) {
    return final;
  }

  if (time >= preset.duration) {
    return final;
  }

  const t = easeOutQuart(time / preset.duration);

  return {
    x: lerp(preset.initial.x, final.x, t),
    y: lerp(preset.initial.y, final.y, t),
    rotateX: lerp(preset.initial.rotateX, final.rotateX, t),
    rotateY: lerp(preset.initial.rotateY, final.rotateY, t),
    rotateZ: lerp(preset.initial.rotateZ, final.rotateZ, t),
    scale: lerp(preset.initial.scale, final.scale, t),
    opacity: lerp(
      preset.initial.opacity,
      final.opacity,
      easeOutCubic(time / preset.duration),
    ),
  };
}

export const INTRO_MAX_DURATION = 2;

export function getExportDimensions(aspectRatio: AspectRatio): {
  width: number;
  height: number;
} {
  switch (aspectRatio) {
    case "9:16":
      return { width: 1080, height: 1920 };
    case "1:1":
      return { width: 1080, height: 1080 };
    default:
      return { width: 1920, height: 1080 };
  }
}

export function getAspectRatioValue(aspectRatio: AspectRatio): number {
  switch (aspectRatio) {
    case "9:16":
      return 9 / 16;
    case "1:1":
      return 1;
    default:
      return 16 / 9;
  }
}
