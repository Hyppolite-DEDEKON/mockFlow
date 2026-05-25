"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import CSSiPhone from "./devices/CSSiPhone";
import CSSiPhone11 from "./devices/CSSiPhone11";
import CSSSamsung from "./devices/CSSSamsung";
import CSSiPad from "./devices/CSSiPad";
import CSSPixel from "./devices/CSSPixel";
import CSSDesktop from "./devices/CSSDesktop";
import CSSPC from "./devices/CSSPC";
import {
  type AspectRatio,
  getFinalPose,
  getPoseAtTime,
  getPreset,
} from "../lib/motionPresets";
import { isLightBackground, isColorBackground } from "../lib/backgrounds";

export type DeviceId = "iphone15" | "iphone11" | "samsung" | "ipad" | "pixel" | "desktop" | "pc";

interface Scene2DProps {
  videoUrl: string | null;
  animation: string;
  device: string;
  aspectRatio: AspectRatio;
  playhead: number;
  isPlaying: boolean;
  videoTime?: number;
  videoPlaying?: boolean;
  backgroundId?: string;
  isExporting?: boolean;
}

const DEVICE_COMPONENTS: Record<DeviceId, typeof CSSiPhone> = {
  iphone15: CSSiPhone,
  iphone11: CSSiPhone11,
  samsung: CSSSamsung,
  ipad: CSSiPad,
  pixel: CSSPixel,
  desktop: CSSDesktop,
  pc: CSSPC,
};

function AmbientGlow({
  backgroundId,
  isExporting = false,
}: {
  backgroundId: string;
  isExporting?: boolean;
}) {
  if (isLightBackground(backgroundId) || isExporting) return null;

  return (
    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[50%] h-[30%] bg-[#3B7BFF]/6 rounded-full blur-[80px] pointer-events-none" />
  );
}

export default function Scene2D({
  videoUrl,
  animation,
  device,
  aspectRatio,
  playhead,
  isPlaying,
  videoTime = 0,
  videoPlaying = false,
  backgroundId = "studio-pro",
  isExporting = false,
}: Scene2DProps) {
  const deviceId = (DEVICE_COMPONENTS[device as DeviceId] ? device : "iphone15") as DeviceId;
  const DeviceComponent = DEVICE_COMPONENTS[deviceId];

  const pose = useMemo(() => {
    if (isPlaying || isExporting || playhead > 0) {
      return getPoseAtTime(animation, playhead, aspectRatio, deviceId);
    }

    const preset = getPreset(animation);
    if (preset.id === "static" || preset.duration === 0) {
      return getFinalPose(aspectRatio, deviceId);
    }

    return getPoseAtTime(animation, 0, aspectRatio, deviceId);
  }, [isPlaying, isExporting, playhead, animation, aspectRatio, deviceId]);

  const deviceShadowStyle = isColorBackground(backgroundId)
    ? isExporting
      ? { boxShadow: "0 32px 64px rgba(0,0,0,0.28), 0 12px 24px rgba(0,0,0,0.12)" }
      : { filter: "drop-shadow(0 32px 64px rgba(0,0,0,0.28)) drop-shadow(0 12px 24px rgba(0,0,0,0.12))" }
    : {};

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      <AmbientGlow backgroundId={backgroundId} isExporting={isExporting} />

      <div
        className="relative z-10"
        style={{
          perspective: "1200px",
          perspectiveOrigin: "50% 50%",
        }}
      >
        <motion.div
          className="transform-style-3d"
          animate={{
            x: pose.x,
            y: pose.y,
            rotateX: pose.rotateX,
            rotateY: pose.rotateY,
            rotateZ: pose.rotateZ,
            scale: pose.scale,
            opacity: pose.opacity,
          }}
          transition={{ duration: isPlaying || isExporting ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
          style={{
            transformStyle: "preserve-3d",
            ...deviceShadowStyle,
          }}
        >
          <DeviceComponent videoUrl={videoUrl} videoTime={videoTime} videoPlaying={videoPlaying} />
        </motion.div>
      </div>
    </div>
  );
}
