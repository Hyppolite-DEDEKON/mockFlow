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

const S = DEVICE_SPECS.pixel;
const bezelRadius = S.frameRadius - S.bezelInset;

const CSSPixel = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative transform-style-3d shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${className}`}
        style={{ width: S.width, height: S.height, borderRadius: S.frameRadius }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#3d3f44] via-[#2a2b2f] to-[#1c1d20] border border-white/15 shadow-[inset_0_2px_3px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.5)]"
          style={{ borderRadius: S.frameRadius }}
        >
          <div className="absolute top-[110px] -right-[2px] w-[3px] h-[36px] bg-[#252628] rounded-r-sm shadow-[inset_-1px_0_1px_rgba(255,255,255,0.15)]" />
          <div className="absolute top-[158px] -right-[2px] w-[3px] h-[58px] bg-[#252628] rounded-r-sm shadow-[inset_-1px_0_1px_rgba(255,255,255,0.15)]" />

          <div
            className="absolute bg-black shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
            style={{ inset: S.bezelInset, borderRadius: bezelRadius }}
          >
            <div
              className="absolute bg-[#06070a] overflow-hidden"
              style={{ inset: S.screenInset, borderRadius: S.screenRadius }}
            >
              <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[11px] h-[11px] bg-black rounded-full z-20 shadow-[0_0_0_1px_rgba(255,255,255,0.08),inset_0_0_3px_rgba(0,0,0,1)] flex items-center justify-center">
                <div className="w-[3px] h-[3px] bg-blue-800/50 rounded-full" />
              </div>

              {videoUrl ? (
                <SyncedVideo videoUrl={videoUrl} videoTime={videoTime} videoPlaying={videoPlaying} />
              ) : (
                <PlaceholderScreen />
              )}

              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-white/[0.02] pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/50 blur-2xl rounded-full transform -translate-z-10 pointer-events-none" />
      </div>
    );
  }
);

CSSPixel.displayName = "CSSPixel";
export default CSSPixel;
