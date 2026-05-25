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

const S = DEVICE_SPECS.ipad;
const bezelRadius = S.frameRadius - S.bezelInset;

const CSSiPad = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative transform-style-3d shadow-[0_40px_80px_rgba(0,0,0,0.5)] ${className}`}
        style={{ width: S.width, height: S.height, borderRadius: S.frameRadius }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#e5e7eb] via-[#b0b8c4] to-[#8b95a5] border border-white/40 shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),inset_0_-1px_3px_rgba(0,0,0,0.15)]"
          style={{ borderRadius: S.frameRadius }}
        >
          <div
            className="absolute inset-[1px] border border-black/10 pointer-events-none"
            style={{ borderRadius: S.frameRadius - 1 }}
          />
          <div className="absolute -top-[2px] right-[40px] w-[40px] h-[3px] bg-[#9ca3af] rounded-t-sm" />

          <div
            className="absolute bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.1)]"
            style={{ inset: S.bezelInset, borderRadius: bezelRadius }}
          >
            <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[8px] h-[8px] bg-[#111] rounded-full z-20 flex items-center justify-center border border-white/5">
              <div className="w-[3px] h-[3px] bg-blue-900/30 rounded-full" />
            </div>

            <div
              className="absolute bg-[#06070a] overflow-hidden"
              style={{ inset: S.screenInset, borderRadius: S.screenRadius }}
            >
              {videoUrl ? (
                <SyncedVideo videoUrl={videoUrl} videoTime={videoTime} videoPlaying={videoPlaying} />
              ) : (
                <PlaceholderScreen variant="tablet" />
              )}

              <div className="absolute inset-0 bg-gradient-to-bl from-white/[0.04] via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-[90%] h-12 bg-black/40 blur-2xl rounded-full transform -translate-z-10 pointer-events-none" />
      </div>
    );
  }
);

CSSiPad.displayName = "CSSiPad";
export default CSSiPad;
