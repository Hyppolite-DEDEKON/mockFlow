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

const S = DEVICE_SPECS.iphone11;
const bezelRadius = S.frameRadius - S.bezelInset;

const CSSiPhone11 = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative transform-style-3d shadow-[0_30px_60px_rgba(0,0,0,0.55)] ${className}`}
        style={{ width: S.width, height: S.height, borderRadius: S.frameRadius }}
      >
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#4a4a4e] via-[#2c2c30] to-[#141416] border border-white/15 shadow-[inset_0_2px_4px_rgba(255,255,255,0.25),inset_0_-2px_4px_rgba(0,0,0,0.45)]"
          style={{ borderRadius: S.frameRadius }}
        >
          <div
            className="absolute inset-[1px] border border-white/8 pointer-events-none"
            style={{ borderRadius: S.frameRadius - 1 }}
          />
          <div className="absolute top-0 left-[18%] right-[18%] h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

          <div className="absolute top-[96px] -left-[2px] w-[3px] h-[22px] bg-[#252528] rounded-l-sm shadow-[inset_1px_0_1px_rgba(255,255,255,0.15)]" />
          <div className="absolute top-[128px] -left-[2px] w-[3px] h-[42px] bg-[#252528] rounded-l-sm shadow-[inset_1px_0_1px_rgba(255,255,255,0.15)]" />
          <div className="absolute top-[178px] -left-[2px] w-[3px] h-[42px] bg-[#252528] rounded-l-sm shadow-[inset_1px_0_1px_rgba(255,255,255,0.15)]" />
          <div className="absolute top-[130px] -right-[2px] w-[3px] h-[64px] bg-[#252528] rounded-r-sm shadow-[inset_-1px_0_1px_rgba(255,255,255,0.15)]" />

          <div
            className="absolute bg-black shadow-[inset_0_0_0_2px_rgba(255,255,255,0.04)]"
            style={{ inset: S.bezelInset, borderRadius: bezelRadius }}
          >
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 bg-black z-20 shadow-[0_1px_0_rgba(255,255,255,0.04)]"
              style={{
                width: S.notch!.width,
                height: S.notch!.height,
                borderBottomLeftRadius: S.notch!.bottomRadius,
                borderBottomRightRadius: S.notch!.bottomRadius,
              }}
            >
              <div className="absolute top-[8px] left-[18px] w-[9px] h-[9px] rounded-full bg-[#0d1117] ring-1 ring-white/10" />
              <div className="absolute top-[8px] right-[18px] w-[11px] h-[11px] rounded-full bg-[#0a0c10] ring-1 ring-white/8 shadow-[inset_0_0_3px_rgba(59,130,246,0.35)]" />
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

              <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[110px] h-[4px] bg-white/30 rounded-full z-10 pointer-events-none" />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-10 bg-black/45 blur-2xl rounded-full transform -translate-z-10 pointer-events-none" />
      </div>
    );
  }
);

CSSiPhone11.displayName = "CSSiPhone11";
export default CSSiPhone11;
