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

const S = DEVICE_SPECS.samsung;
const bezelRadius = S.frameRadius - S.bezelInset;

const CSSSamsung = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative transform-style-3d shadow-[0_30px_60px_rgba(0,0,0,0.6)] ${className}`}
        style={{ width: S.width, height: S.height, borderRadius: S.frameRadius }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#181818] via-[#404040] to-[#181818] shadow-[inset_0_1px_2px_rgba(255,255,255,0.25),inset_0_-1px_2px_rgba(0,0,0,0.4)]"
          style={{ borderRadius: S.frameRadius }}
        >
          <div
            className="absolute inset-[1px] border border-white/8 pointer-events-none"
            style={{ borderRadius: S.frameRadius - 1 }}
          />

          <div className="absolute top-[120px] -right-[2px] w-[3px] h-[40px] bg-[#2a2b2e] rounded-r-sm" />
          <div className="absolute top-[180px] -right-[2px] w-[3px] h-[70px] bg-[#2a2b2e] rounded-r-sm" />

          <div
            className="absolute bg-black shadow-[inset_0_0_2px_rgba(255,255,255,0.1)]"
            style={{ inset: S.bezelInset, borderRadius: bezelRadius }}
          >
            <div
              className="absolute bg-[#06070a] overflow-hidden"
              style={{ inset: S.screenInset, borderRadius: S.screenRadius }}
            >
              <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[14px] h-[14px] bg-black rounded-full z-20 shadow-[0_0_1px_1px_rgba(255,255,255,0.05),inset_0_0_4px_rgba(0,0,0,1)] flex items-center justify-center">
                <div className="w-[4px] h-[4px] bg-blue-900/40 rounded-full" />
              </div>

              {videoUrl ? (
                <SyncedVideo videoUrl={videoUrl} videoTime={videoTime} videoPlaying={videoPlaying} />
              ) : (
                <PlaceholderScreen variant="samsung" />
              )}

              <div className="absolute inset-y-0 left-0 w-[10px] bg-gradient-to-r from-white/[0.05] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-[10px] bg-gradient-to-l from-white/[0.05] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/50 blur-2xl rounded-full transform -translate-z-10 pointer-events-none" />
      </div>
    );
  }
);

CSSSamsung.displayName = "CSSSamsung";
export default CSSSamsung;
