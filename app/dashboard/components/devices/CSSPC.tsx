"use client";

import { forwardRef } from "react";
import SyncedVideo, { PlaceholderScreen } from "./SyncedVideo";
import { DEVICE_SPECS } from "../../lib/deviceSpecs";

interface DeviceProps {
  videoUrl: string | null;
  className?: string;
  videoTime?: number;
  videoPlaying?: boolean;
}

const S = DEVICE_SPECS.pc;
const screen = S.screenRect!;
const MONITOR_HEIGHT = S.height - (S.keyboardHeight ?? 96);

const CSSPC = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative transform-style-3d shadow-[0_40px_80px_rgba(0,0,0,0.5)] ${className}`}
        style={{ width: S.width, height: S.height }}
      >
        {/* Monitor panel */}
        <div
          className="absolute top-0 left-0 right-0 overflow-hidden border border-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          style={{
            height: MONITOR_HEIGHT,
            borderRadius: `${S.frameRadius}px ${S.frameRadius}px 2px 2px`,
            background: "linear-gradient(180deg, #2d2d30 0%, #1a1a1c 100%)",
          }}
        >
          {/* Webcam */}
          <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[6px] h-[6px] rounded-full bg-[#0a0a0c] border border-white/10 z-20" />

          <div
            className="absolute bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.04)]"
            style={{
              left: screen.x - 2,
              top: screen.y - 2,
              width: screen.width + 4,
              height: screen.height + 4,
              borderRadius: screen.radius + 2,
            }}
          >
            <div
              className="absolute bg-[#06070a] overflow-hidden"
              style={{
                left: 2,
                top: 2,
                width: screen.width,
                height: screen.height,
                borderRadius: screen.radius,
              }}
            >
              {videoUrl ? (
                <SyncedVideo
                  videoUrl={videoUrl}
                  videoTime={videoTime}
                  videoPlaying={videoPlaying}
                  objectFit="contain"
                  objectPosition="top"
                />
              ) : (
                <PlaceholderScreen variant="pc" />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>

          {/* Bottom chin brand strip */}
          <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-white/10" />
        </div>

        {/* Stand neck */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#3a3a3c] to-[#2a2a2c] border-x border-white/5"
          style={{
            top: MONITOR_HEIGHT - 1,
            width: 52,
            height: 48,
            clipPath: "polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)",
          }}
        />

        {/* Stand base */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gradient-to-b from-[#3a3a3c] to-[#222224] border border-white/10 shadow-lg"
          style={{
            width: 180,
            height: 14,
            borderRadius: "0 0 8px 8px",
          }}
        />

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[70%] h-12 bg-black/40 blur-2xl rounded-full pointer-events-none" />
      </div>
    );
  }
);

CSSPC.displayName = "CSSPC";
export default CSSPC;
