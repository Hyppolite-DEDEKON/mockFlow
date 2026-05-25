"use client";

import { useRef, useEffect } from "react";
import { Play } from "lucide-react";

interface SyncedVideoProps {
  videoUrl: string;
  videoTime?: number;
  videoPlaying?: boolean;
}

export default function SyncedVideo({ videoUrl, videoTime, videoPlaying }: SyncedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || videoTime === undefined) return;
    if (Math.abs(vid.currentTime - videoTime) > 0.15) {
      vid.currentTime = videoTime;
    }
    if (videoPlaying) {
      vid.play().catch(() => {});
    } else {
      vid.pause();
    }
  }, [videoTime, videoPlaying]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      loop
      muted
      playsInline
      preload="auto"
      className="w-full h-full object-cover"
    />
  );
}

interface PlaceholderScreenProps {
  variant?: "phone" | "tablet" | "samsung" | "desktop";
}

export function PlaceholderScreen({ variant = "phone" }: PlaceholderScreenProps) {
  const isTablet = variant === "tablet";
  const isSamsung = variant === "samsung";
  const isDesktop = variant === "desktop";

  return (
    <div
      className={`w-full h-full relative ${
        isDesktop
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950"
          : isSamsung
            ? "bg-gradient-to-b from-slate-900 to-slate-800"
            : "bg-gradient-to-b from-indigo-900 to-blue-900"
      }`}
    >
      <div
        className={`absolute bg-white/10 animate-pulse ${
          isDesktop
            ? "top-8 left-8 right-8 h-24 rounded-lg"
            : isTablet
              ? "top-16 left-6 right-6 h-40 rounded-xl"
              : isSamsung
                ? "top-16 left-4 right-4 h-28 rounded-sm"
                : "top-16 left-4 right-4 h-32 rounded-xl"
        }`}
      />
      <div
        className={`absolute bg-white/10 animate-pulse ${
          isDesktop
            ? "top-36 left-8 w-[45%] h-16 rounded-lg"
            : isTablet
              ? "top-64 left-6 right-6 h-20 rounded-xl"
              : isSamsung
                ? "top-48 left-4 right-4 h-14 rounded-sm"
                : "top-52 left-4 right-4 h-16 rounded-xl"
        }`}
        style={{ animationDelay: "0.2s" }}
      />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
        <div
          className={`rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 ${
            isDesktop ? "w-14 h-14" : isTablet ? "w-16 h-16" : "w-12 h-12"
          }`}
        >
          <Play
            size={isDesktop ? 24 : isTablet ? 28 : 20}
            className={`text-white ${isDesktop || isTablet ? "ml-1.5" : "ml-1"}`}
          />
        </div>
      </div>
    </div>
  );
}
