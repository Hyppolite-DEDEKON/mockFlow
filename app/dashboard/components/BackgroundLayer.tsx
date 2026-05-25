"use client";

import { isLightBackground, isColorBackground } from "../lib/backgrounds";
import { COLOR_BACKGROUND_SPECS } from "../lib/colorBackgrounds";

interface BackgroundLayerProps {
  backgroundId: string;
  isExporting?: boolean;
}

const BACKGROUND_STYLES: Record<string, React.CSSProperties> = {
  "studio-pro": {
    background: `
      radial-gradient(ellipse 80% 50% at 50% 100%, rgba(59,123,255,0.1) 0%, transparent 55%),
      radial-gradient(ellipse 55% 40% at 50% 25%, rgba(255,255,255,0.035) 0%, transparent 70%),
      radial-gradient(ellipse 90% 70% at 50% 50%, transparent 35%, rgba(0,0,0,0.45) 100%),
      linear-gradient(180deg, #0c0e14 0%, #06070a 55%, #030405 100%)
    `,
  },
  spotlight: {
    background: `
      radial-gradient(ellipse 45% 38% at 50% 38%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.02) 40%, transparent 70%),
      radial-gradient(ellipse 75% 65% at 50% 50%, transparent 40%, rgba(0,0,0,0.55) 75%, rgba(0,0,0,0.88) 100%),
      #030303
    `,
  },
  "slate-studio": {
    background: `
      radial-gradient(ellipse 70% 35% at 50% 0%, rgba(255,255,255,0.07) 0%, transparent 70%),
      radial-gradient(ellipse 80% 40% at 50% 100%, rgba(100,116,139,0.14) 0%, transparent 60%),
      linear-gradient(145deg, #2a2f3a 0%, #1e222b 45%, #14171e 100%)
    `,
  },
  carbon: {
    background: `
      radial-gradient(ellipse 50% 40% at 30% 20%, rgba(255,255,255,0.025) 0%, transparent 60%),
      linear-gradient(160deg, #141416 0%, #0c0c0e 50%, #080809 100%)
    `,
  },
  "neon-noir": {
    background: `
      radial-gradient(ellipse 55% 45% at 0% 100%, rgba(59,123,255,0.22) 0%, transparent 55%),
      radial-gradient(ellipse 50% 40% at 100% 0%, rgba(139,92,246,0.18) 0%, transparent 55%),
      radial-gradient(ellipse 70% 60% at 50% 50%, transparent 35%, rgba(0,0,0,0.55) 100%),
      #09090b
    `,
  },
  "ocean-deep": {
    background: `
      radial-gradient(ellipse 40% 35% at 70% 25%, rgba(56,189,248,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 45% 38% at 20% 70%, rgba(14,165,233,0.1) 0%, transparent 55%),
      radial-gradient(ellipse 30% 25% at 50% 35%, rgba(255,255,255,0.035) 0%, transparent 70%),
      linear-gradient(180deg, #041018 0%, #062032 50%, #030a10 100%)
    `,
  },
  "apple-clean": {
    background: `
      radial-gradient(ellipse 60% 35% at 50% 12%, rgba(255,255,255,0.95) 0%, transparent 70%),
      radial-gradient(ellipse 55% 25% at 50% 100%, rgba(0,0,0,0.04) 0%, transparent 70%),
      linear-gradient(180deg, #fafafa 0%, #f5f5f7 45%, #ebebef 100%)
    `,
  },
  concrete: {
    background: `
      radial-gradient(ellipse 45% 35% at 50% 30%, rgba(255,255,255,0.45) 0%, transparent 70%),
      linear-gradient(160deg, #eceae7 0%, #e2dfdb 50%, #d8d4cf 100%)
    `,
  },
  "paper-white": {
    background: `
      radial-gradient(ellipse 50% 45% at 50% 50%, rgba(59,123,255,0.04) 0%, transparent 70%),
      linear-gradient(180deg, #ffffff 0%, #f4f4f5 100%)
    `,
  },
};

const TEXTURED_IDS = new Set(["carbon", "concrete"]);

function ColorBlobLayer({
  backgroundId,
  isExporting = false,
}: {
  backgroundId: string;
  isExporting?: boolean;
}) {
  const spec = COLOR_BACKGROUND_SPECS[backgroundId];
  if (!spec) return null;

  return (
    <>
      <div className="absolute inset-0" style={{ background: spec.base }} />
      {spec.blobs.map((blob, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: `${blob.x * 100}%`,
            top: `${blob.y * 100}%`,
            width: `${blob.radius * 200}%`,
            height: `${blob.radius * 200}%`,
            transform: "translate(-50%, -50%)",
            backgroundColor: blob.hex,
            opacity: blob.alpha,
            filter: isExporting ? "blur(40px)" : "blur(60px)",
          }}
        />
      ))}
    </>
  );
}

export default function BackgroundLayer({ backgroundId, isExporting = false }: BackgroundLayerProps) {
  const isColor = isColorBackground(backgroundId);
  const style = !isColor ? (BACKGROUND_STYLES[backgroundId] ?? BACKGROUND_STYLES["studio-pro"]) : undefined;
  const light = isLightBackground(backgroundId);
  const showGrid = ["studio-pro", "spotlight", "slate-studio", "carbon"].includes(backgroundId);

  return (
    <div className="absolute inset-0 overflow-hidden" style={style}>
      {isColor && <ColorBlobLayer backgroundId={backgroundId} isExporting={isExporting} />}

      {showGrid && !isExporting && (
        <div
          className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(ellipse 65% 55% at 50% 45%, black, transparent)",
          }}
        />
      )}

      {TEXTURED_IDS.has(backgroundId) && !isExporting && (
        <div
          className="absolute inset-0 pointer-events-none mix-blend-overlay"
          style={{
            opacity: backgroundId === "carbon" ? 0.35 : 0.2,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {!light && !isExporting && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.04,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            mixBlendMode: "overlay",
          }}
        />
      )}

      {light && !isColor && !isExporting && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            mixBlendMode: "multiply",
          }}
        />
      )}

      {backgroundId === "spotlight" && (
        <div
          className="absolute bottom-0 left-0 right-0 h-[35%] pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 100%)" }}
        />
      )}

      {backgroundId === "studio-pro" && (
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[20%] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse, rgba(59,123,255,0.06) 0%, transparent 70%)",
            filter: "blur(20px)",
          }}
        />
      )}
    </div>
  );
}

export { isLightBackground };
