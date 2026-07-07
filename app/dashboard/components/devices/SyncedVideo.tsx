"use client";

import { useRef, useEffect } from "react";
import { Play } from "lucide-react";
import { usePlaybackVideoRef } from "../PlaybackVideoContext";

interface SyncedVideoProps {
  videoUrl: string;
  videoTime?: number;
  videoPlaying?: boolean;
  objectFit?: "cover" | "contain";
  objectPosition?: "center" | "top";
}

export default function SyncedVideo({
  videoUrl,
  videoTime,
  videoPlaying = false,
  objectFit = "cover",
  objectPosition = "center",
}: SyncedVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackVideoRef = usePlaybackVideoRef();

  useEffect(() => {
    const display = videoRef.current;
    if (!display) return;

    if (videoPlaying && playbackVideoRef?.current) {
      let raf = 0;
      const sync = () => {
        const master = playbackVideoRef.current;
        if (master && display) {
          if (Math.abs(display.currentTime - master.currentTime) > 0.05) {
            display.currentTime = master.currentTime;
          }
        }
        raf = requestAnimationFrame(sync);
      };
      raf = requestAnimationFrame(sync);
      return () => cancelAnimationFrame(raf);
    }

    if (!videoPlaying && videoTime !== undefined) {
      display.currentTime = videoTime;
    }
  }, [videoPlaying, videoTime, playbackVideoRef]);

  useEffect(() => {
    const display = videoRef.current;
    if (!display) return;
    if (videoPlaying) {
      display.pause();
    }
  }, [videoPlaying]);

  return (
    <video
      ref={videoRef}
      src={videoUrl}
      muted
      playsInline
      preload="auto"
      className={`w-full h-full ${objectFit === "contain" ? "object-contain" : "object-cover"} ${
        objectPosition === "top" ? "object-top" : "object-center"
      }`}
    />
  );
}

interface PlaceholderScreenProps {
  variant?: "phone" | "tablet" | "samsung" | "desktop" | "pc";
}

export function PlaceholderScreen({ variant = "phone" }: PlaceholderScreenProps) {
  const isTablet = variant === "tablet";
  const isSamsung = variant === "samsung";
  const isDesktop = variant === "desktop";
  const isPC = variant === "pc";
  const isWide = isDesktop || isPC;

  return (
    <div
      className={`w-full h-full relative ${
        isWide
          ? "bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950"
          : isSamsung
            ? "bg-gradient-to-b from-slate-900 to-slate-800"
            : "bg-gradient-to-b from-indigo-900 to-blue-900"
      }`}
    >
      <div
        className={`absolute bg-white/10 animate-pulse ${
          isWide
            ? "top-6 left-6 right-6 h-20 rounded-md"
            : isTablet
              ? "top-16 left-6 right-6 h-40 rounded-xl"
              : isSamsung
                ? "top-16 left-4 right-4 h-28 rounded-sm"
                : "top-16 left-4 right-4 h-32 rounded-xl"
        }`}
      />
      <div
        className={`absolute bg-white/10 animate-pulse ${
          isWide
            ? "top-32 left-6 w-[42%] h-14 rounded-md"
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
            isWide ? "w-14 h-14" : isTablet ? "w-16 h-16" : "w-12 h-12"
          }`}
        >
          <Play
            size={isWide ? 24 : isTablet ? 28 : 20}
            className={`text-white ${isWide || isTablet ? "ml-1.5" : "ml-1"}`}
          />
        </div>
      </div>
    </div>
  );
}
