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

const S = DEVICE_SPECS.desktop;
const screen = S.screenRect!;
const LID_HEIGHT = S.height - (S.keyboardHeight ?? 68);

const CSSDesktop = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative transform-style-3d shadow-[0_40px_80px_rgba(0,0,0,0.45)] ${className}`}
        style={{ width: S.width, height: S.height }}
      >
        {/* Lid */}
        <div
          className="absolute top-0 left-0 right-0 overflow-hidden border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_2px_rgba(0,0,0,0.08)]"
          style={{
            height: LID_HEIGHT,
            borderRadius: `${S.frameRadius}px ${S.frameRadius}px 4px 4px`,
            background: "linear-gradient(145deg, #e8ebf0 0%, #c2cad6 45%, #a3aec0 100%)",
          }}
        >
          {/* Notch on aluminum — above screen, does not cover video */}
          <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[96px] h-[10px] bg-[#a3aec0] rounded-b-[5px] z-10 border border-white/20" />

          <div
            className="absolute bg-[#0a0a0c] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
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
                <PlaceholderScreen variant="desktop" />
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div
          className="absolute left-[6%] right-[6%] h-[3px] bg-gradient-to-b from-[#6b7280] to-[#4b5563] z-10"
          style={{ top: LID_HEIGHT - 1 }}
        />

        {/* Base */}
        <div
          className="absolute bottom-0 left-0 right-0 border border-white/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]"
          style={{
            height: S.keyboardHeight,
            borderRadius: `4px 4px ${S.frameRadius}px ${S.frameRadius}px`,
            background: "linear-gradient(180deg, #b0b8c4 0%, #949eb0 55%, #8892a4 100%)",
          }}
        >
          <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[38%] h-[38px] rounded-lg bg-[#8e98a8]/50 border border-white/15 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)]" />
          <div className="absolute top-[6px] left-[8%] right-[8%] flex flex-col gap-[3px] opacity-25">
            {[88, 80, 72].map((w) => (
              <div key={w} className="h-[3px] rounded-full bg-black/30 mx-auto" style={{ width: `${w}%` }} />
            ))}
          </div>
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/35 blur-2xl rounded-full pointer-events-none" />
      </div>
    );
  }
);

CSSDesktop.displayName = "CSSDesktop";
export default CSSDesktop;
