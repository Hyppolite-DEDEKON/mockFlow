import type { DeviceId } from "../components/Scene2D";
import type { AspectRatio } from "./motionPresets";
import {
  exportMockupVideoMediabunny,
  ensureAacEncoder,
  ExportCancelledError,
} from "./mediabunnyExport";

export type ExportFormat = "webm" | "mp4";

export { ExportCancelledError };

export function isExportCancelled(error: unknown): boolean {
  return error instanceof ExportCancelledError;
}

export interface ExportOptions {
  cropElement: HTMLElement;
  deviceId: DeviceId;
  presetId: string;
  backgroundId: string;
  aspectRatio: AspectRatio;
  totalDuration: number;
  videoFile: File | null;
  format?: ExportFormat;
  onProgress?: (progress: number) => void;
  signal?: AbortSignal;
}

export function canExportMp4(): boolean {
  return typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";
}

export async function exportMockupVideo(options: ExportOptions): Promise<Blob> {
  if (!options.totalDuration || options.totalDuration <= 0) {
    throw new Error("Durée invalide — ajoutez une vidéo ou relancez la preview.");
  }

  if (options.signal?.aborted) {
    throw new ExportCancelledError();
  }

  options.onProgress?.(0);

  const format = options.format ?? "webm";

  if (format === "mp4" && !canExportMp4()) {
    throw new Error("MP4 non supporté — utilisez Chrome ou Edge récent");
  }

  return exportMockupVideoMediabunny(options, format);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// Précharge l'encodeur AAC WASM (Brave/Linux) dès l'ouverture de l'éditeur.
export function preloadExportEncoders(): void {
  void ensureAacEncoder();
}
