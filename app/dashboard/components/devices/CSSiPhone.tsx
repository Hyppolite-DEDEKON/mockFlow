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

const S = DEVICE_SPECS.iphone15;
const bezelRadius = S.frameRadius - S.bezelInset;

const CSSiPhone = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative transform-style-3d shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${className}`}
        style={{ width: S.width, height: S.height, borderRadius: S.frameRadius }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#5a5c64] via-[#3a3b3e] to-[#1a1b1e] border border-white/20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.5)]"
          style={{ borderRadius: S.frameRadius }}
        >
          <div
            className="absolute inset-[1px] border border-white/10 pointer-events-none"
            style={{ borderRadius: S.frameRadius - 1 }}
          />
          <div className="absolute top-0 left-[20%] right-[20%] h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

          <div className="absolute top-[30px] -left-[1px] w-[2px] h-[5px] bg-[#1a1b1e] rounded-l-sm" />
          <div className="absolute top-[30px] -right-[1px] w-[2px] h-[5px] bg-[#1a1b1e] rounded-r-sm" />

          <div className="absolute top-[100px] -left-[2px] w-[3px] h-[25px] bg-[#2a2b2e] rounded-l-sm shadow-[inset_1px_0_1px_rgba(255,255,255,0.2)]" />
          <div className="absolute top-[140px] -left-[2px] w-[3px] h-[45px] bg-[#2a2b2e] rounded-l-sm shadow-[inset_1px_0_1px_rgba(255,255,255,0.2)]" />
          <div className="absolute top-[195px] -left-[2px] w-[3px] h-[45px] bg-[#2a2b2e] rounded-l-sm shadow-[inset_1px_0_1px_rgba(255,255,255,0.2)]" />
          <div className="absolute top-[150px] -right-[2px] w-[3px] h-[70px] bg-[#2a2b2e] rounded-r-sm shadow-[inset_-1px_0_1px_rgba(255,255,255,0.2)]" />

          <div
            className="absolute bg-black shadow-[inset_0_0_0_2px_rgba(255,255,255,0.05)]"
            style={{ inset: S.bezelInset, borderRadius: bezelRadius }}
          >
            <div
              className="absolute left-1/2 -translate-x-1/2 bg-black z-20 shadow-[0_0_1px_1px_rgba(255,255,255,0.05)] flex items-center justify-between px-2"
              style={{
                top: S.dynamicIsland!.offsetTop,
                width: S.dynamicIsland!.width,
                height: S.dynamicIsland!.height,
                borderRadius: S.dynamicIsland!.height / 2,
              }}
            >
              <div className="w-[10px] h-[10px] rounded-full bg-white/10" />
              <div className="w-[10px] h-[10px] rounded-full bg-blue-500/20 shadow-[0_0_4px_rgba(59,130,246,0.5)]" />
            </div>

            <div
              className="absolute bg-[#06070a] overflow-hidden"
              style={{ inset: S.screenInset, borderRadius: S.screenRadius }}
            >
              {videoUrl ? (
                <SyncedVideo videoUrl={videoUrl} videoTime={videoTime} videoPlaying={videoPlaying} />
              ) : (
                <PlaceholderScreen />
              )}

              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.07] to-transparent pointer-events-none" />
              <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[110px] h-[4px] bg-white/30 rounded-full z-10 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/50 blur-2xl rounded-full transform -translate-z-10 pointer-events-none" />
      </div>
    );
  }
);

CSSiPhone.displayName = "CSSiPhone";
export default CSSiPhone;
