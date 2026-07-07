"use client";

import { createContext, useContext } from "react";

export const PlaybackVideoContext =
  createContext<React.RefObject<HTMLVideoElement | null> | null>(null);

export function usePlaybackVideoRef() {
  return useContext(PlaybackVideoContext);
}
