"use client";

import { forwardRef } from "react";
import SyncedVideo, { PlaceholderScreen } from "./SyncedVideo";
import { DEVICE_SPECS } from "../../lib/deviceSpecs";
import {
  MACBOOK_KEYBOARD_TILT_DEG,
  MACBOOK_LID_OPEN_DEG,
  MACBOOK_VIEW_TILT_DEG,
} from "../../lib/macbookGeometry";

interface DeviceProps {
  videoUrl: string | null;
  className?: string;
  videoTime?: number;
  videoPlaying?: boolean;
}

const S = DEVICE_SPECS.desktop;
const screen = S.screenRect!;
const LID_HEIGHT = S.height - (S.keyboardHeight ?? 128);
const KB_HEIGHT = S.keyboardHeight ?? 128;

const KEYBOARD_ROWS = [
  { flexes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { flexes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { flexes: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] },
  { flexes: [1.4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1.4] },
  { flexes: [1.2, 1, 1, 1, 4.5, 1, 1, 1, 1.2] },
];

function MacBookKey({ flex = 1 }: { flex?: number }) {
  return (
    <div
      className="h-full min-h-[7px] rounded-[3px] border border-black/50 shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_1px_1px_rgba(0,0,0,0.25)]"
      style={{
        flex,
        background: "linear-gradient(180deg, #2a2a2c 0%, #1a1a1c 100%)",
      }}
    />
  );
}

function LidContent({
  videoUrl,
  videoTime,
  videoPlaying,
}: {
  videoUrl: string | null;
  videoTime?: number;
  videoPlaying?: boolean;
}) {
  return (
    <>
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
    </>
  );
}

function KeyboardContent() {
  return (
    <>
      <div
        className="absolute inset-x-[5%] top-[8px] bottom-[54px] rounded-md p-[5px] flex flex-col gap-[3px]"
        style={{
          background: "linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.02) 100%)",
          boxShadow: "inset 0 1px 3px rgba(0,0,0,0.12)",
        }}
      >
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div key={rowIdx} className="flex gap-[3px] flex-1 min-h-0">
            {row.flexes.map((flex, keyIdx) => (
              <MacBookKey key={keyIdx} flex={flex} />
            ))}
          </div>
        ))}
      </div>
      <div
        className="absolute top-[10px] right-[6%] w-[10px] h-[10px] rounded-full border border-white/20"
        style={{
          background: "linear-gradient(145deg, #3a3a3c, #1a1a1c)",
          boxShadow: "inset 0 1px 2px rgba(0,0,0,0.5)",
        }}
      />
      <div
        className="absolute bottom-[10px] left-1/2 -translate-x-1/2 rounded-xl border border-white/30"
        style={{
          width: "44%",
          height: 44,
          background:
            "linear-gradient(145deg, rgba(255,255,255,0.22) 0%, rgba(180,188,200,0.35) 40%, rgba(140,150,165,0.45) 100%)",
          boxShadow:
            "inset 0 2px 6px rgba(255,255,255,0.35), inset 0 -1px 3px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.15)",
        }}
      />
      <div className="absolute bottom-[22px] left-[4%] flex flex-col gap-[2px] opacity-30">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-[28px] h-[1.5px] rounded-full bg-black/40" />
        ))}
      </div>
      <div className="absolute bottom-[22px] right-[4%] flex flex-col gap-[2px] opacity-30">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="w-[28px] h-[1.5px] rounded-full bg-black/40" />
        ))}
      </div>
    </>
  );
}

const CSSDesktop = forwardRef<HTMLDivElement, DeviceProps>(
  ({ videoUrl, className, videoTime, videoPlaying }, ref) => {
    return (
      <div
        ref={ref}
        className={`relative ${className}`}
        style={{
          width: S.width,
          height: S.height,
          perspective: "1100px",
          perspectiveOrigin: "50% 35%",
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="relative w-full"
          style={{
            height: LID_HEIGHT + KB_HEIGHT,
            transformStyle: "preserve-3d",
            transform: `rotateX(${MACBOOK_VIEW_TILT_DEG}deg)`,
          }}
        >
          {/* Écran — légère inclinaison arrière, bien face caméra */}
          <div
            className="absolute left-0 top-0 w-full overflow-hidden border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-1px_2px_rgba(0,0,0,0.08)]"
            style={{
              height: LID_HEIGHT,
              borderRadius: `${S.frameRadius}px ${S.frameRadius}px 4px 4px`,
              background: "linear-gradient(145deg, #e8ebf0 0%, #c2cad6 45%, #a3aec0 100%)",
              transformOrigin: "50% 100%",
              transform: `rotateX(-${MACBOOK_LID_OPEN_DEG}deg)`,
              transformStyle: "preserve-3d",
            }}
          >
            <LidContent videoUrl={videoUrl} videoTime={videoTime} videoPlaying={videoPlaying} />
          </div>

          {/* Charnière */}
          <div
            className="absolute left-[6%] right-[6%] h-[3px] bg-gradient-to-b from-[#5c6370] to-[#3d4450] z-20"
            style={{ top: LID_HEIGHT - 1 }}
          />

          {/* Clavier — incliné vers la caméra (pas 90°) */}
          <div
            className="absolute left-0 w-full border border-white/20 overflow-hidden z-10"
            style={{
              top: LID_HEIGHT - 1,
              height: KB_HEIGHT,
              borderRadius: `4px 4px ${S.frameRadius}px ${S.frameRadius}px`,
              background: "linear-gradient(180deg, #c8ced8 0%, #a8b0bc 40%, #949eb0 100%)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 8px 20px rgba(0,0,0,0.15)",
              transformOrigin: "50% 0%",
              transform: `rotateX(${MACBOOK_KEYBOARD_TILT_DEG}deg) translateZ(2px)`,
              transformStyle: "preserve-3d",
            }}
          >
            <KeyboardContent />
          </div>
        </div>

        <div
          className="absolute left-1/2 -translate-x-1/2 w-[85%] h-12 bg-black/35 blur-2xl rounded-full pointer-events-none"
          style={{ bottom: -48 }}
        />
      </div>
    );
  }
);

CSSDesktop.displayName = "CSSDesktop";
export default CSSDesktop;
