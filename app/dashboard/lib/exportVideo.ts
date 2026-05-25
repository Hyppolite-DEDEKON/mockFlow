import { Muxer, ArrayBufferTarget } from "mp4-muxer";
import type { DeviceId } from "../components/Scene2D";
import type { AspectRatio, Pose } from "./motionPresets";
import { getExportDimensions, getPoseAtTime, getPreset } from "./motionPresets";
import { drawMockupFrame } from "./canvasRenderer";

export type ExportFormat = "webm" | "mp4";

export class ExportCancelledError extends Error {
  constructor() {
    super("Export annulé");
    this.name = "ExportCancelledError";
  }
}

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

const FPS = 30;
const MAX_ENCODER_QUEUE = 4;

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new ExportCancelledError();
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  throwIfAborted(signal);
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      signal?.removeEventListener("abort", onAbort);
      resolve();
    }, ms);
    const onAbort = () => {
      window.clearTimeout(timer);
      signal?.removeEventListener("abort", onAbort);
      reject(new ExportCancelledError());
    };
    signal?.addEventListener("abort", onAbort);
  });
}

export function canExportMp4(): boolean {
  return typeof VideoEncoder !== "undefined" && typeof VideoFrame !== "undefined";
}

function getDimensionScale(cropElement: HTMLElement, exportHeight: number): number {
  const cropHeight = cropElement.offsetHeight || cropElement.clientHeight;
  if (cropHeight > 2) return exportHeight / cropHeight;
  return 1;
}

function scalePose(pose: Pose, factor: number): Pose {
  return {
    ...pose,
    x: pose.x * factor,
    y: pose.y * factor,
    scale: pose.scale * factor,
  };
}

function waitForVideoMetadata(video: HTMLVideoElement): Promise<void> {
  return new Promise((resolve, reject) => {
    if (video.readyState >= 1) {
      resolve();
      return;
    }
    video.onloadedmetadata = () => resolve();
    video.onerror = () => reject(new Error("Impossible de charger la vidéo"));
  });
}

function seekVideo(video: HTMLVideoElement, time: number, signal?: AbortSignal): Promise<void> {
  throwIfAborted(signal);
  return new Promise((resolve, reject) => {
    const t = Math.min(time, video.duration || time);
    if (Math.abs(video.currentTime - t) < 0.04) {
      resolve();
      return;
    }
    const onAbort = () => {
      video.removeEventListener("seeked", onSeeked);
      reject(new ExportCancelledError());
    };
    const onSeeked = () => {
      signal?.removeEventListener("abort", onAbort);
      video.removeEventListener("seeked", onSeeked);
      resolve();
    };
    signal?.addEventListener("abort", onAbort);
    video.addEventListener("seeked", onSeeked);
    video.currentTime = t;
  });
}

async function pickH264Codec(width: number, height: number): Promise<string> {
  const candidates = ["avc1.640028", "avc1.42E01E", "avc1.4D401E"];
  for (const codec of candidates) {
    const { supported } = await VideoEncoder.isConfigSupported({
      codec,
      width,
      height,
      bitrate: 8_000_000,
      framerate: FPS,
    });
    if (supported) return codec;
  }
  throw new Error("Encodage H.264 non supporté par ce navigateur");
}

async function waitForEncoderQueue(encoder: VideoEncoder, signal?: AbortSignal) {
  while (encoder.encodeQueueSize > MAX_ENCODER_QUEUE) {
    throwIfAborted(signal);
    await sleep(5, signal);
  }
}

interface ExportContext {
  width: number;
  height: number;
  dimensionScale: number;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  video: HTMLVideoElement | null;
}

async function createExportContext(
  options: ExportOptions
): Promise<ExportContext & { totalFrames: number; introDuration: number }> {
  const { aspectRatio, videoFile, cropElement, totalDuration } = options;
  const { width, height } = getExportDimensions(aspectRatio);
  const introDuration = getPreset(options.presetId).duration;
  const dimensionScale = getDimensionScale(cropElement, height);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas non supporté");

  let video: HTMLVideoElement | null = null;
  if (videoFile) {
    video = document.createElement("video");
    video.muted = true;
    video.playsInline = true;
    video.preload = "auto";
    video.src = URL.createObjectURL(videoFile);
    await waitForVideoMetadata(video);
  }

  const totalFrames = Math.max(1, Math.ceil(totalDuration * FPS));

  return {
    width,
    height,
    dimensionScale,
    canvas,
    ctx,
    video,
    totalFrames,
    introDuration,
  };
}

function cleanupVideo(video: HTMLVideoElement | null) {
  if (video?.src.startsWith("blob:")) URL.revokeObjectURL(video.src);
}

function drawFrame(
  ctx: ExportContext,
  options: ExportOptions,
  elapsed: number
) {
  const pose = scalePose(
    getPoseAtTime(options.presetId, elapsed, options.aspectRatio, options.deviceId),
    ctx.dimensionScale
  );

  const videoTime = ctx.video
    ? Math.min(elapsed, ctx.video.duration || elapsed)
    : 0;

  drawMockupFrame(ctx.ctx, {
    width: ctx.width,
    height: ctx.height,
    deviceId: options.deviceId,
    pose,
    backgroundId: options.backgroundId,
    video: ctx.video,
    videoTime,
  });
}

function requestCaptureFrame(stream: MediaStream) {
  const track = stream.getVideoTracks()[0] as MediaStreamTrack & {
    requestFrame?: () => void;
  };
  track.requestFrame?.();
}

async function exportMockupVideoWebm(options: ExportOptions): Promise<Blob> {
  const { signal } = options;
  throwIfAborted(signal);

  const ctx = await createExportContext(options);
  const { onProgress } = options;
  const frameDelayMs = Math.round(1000 / FPS);

  const stream = ctx.canvas.captureStream(FPS);
  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm";

  if (!MediaRecorder.isTypeSupported(mimeType)) {
    cleanupVideo(ctx.video);
    throw new Error("Export WebM non supporté par ce navigateur — essayez MP4.");
  }

  const recorder = new MediaRecorder(stream, { mimeType, videoBitsPerSecond: 8_000_000 });
  const chunks: Blob[] = [];

  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };

  const recordingDone = new Promise<Blob>((resolve, reject) => {
    recorder.onstop = () => {
      cleanupVideo(ctx.video);
      if (signal?.aborted) {
        reject(new ExportCancelledError());
        return;
      }
      resolve(new Blob(chunks, { type: mimeType }));
    };
    recorder.onerror = () => reject(new Error("Erreur d'enregistrement WebM"));
  });

  recorder.start(100);

  try {
    for (let frame = 0; frame < ctx.totalFrames; frame++) {
      throwIfAborted(signal);

      const elapsed = frame / FPS;

      if (ctx.video) {
        await seekVideo(ctx.video, Math.min(elapsed, ctx.video.duration || elapsed), signal);
      }

      drawFrame(ctx, options, elapsed);
      requestCaptureFrame(stream);
      onProgress?.((frame + 1) / ctx.totalFrames);
      await sleep(frameDelayMs, signal);
    }
  } catch (err) {
    cleanupVideo(ctx.video);
    try {
      recorder.stop();
    } catch {
      // ignore
    }
    throw err;
  }

  throwIfAborted(signal);
  recorder.stop();
  onProgress?.(1);
  return recordingDone;
}

async function exportMockupVideoMp4(options: ExportOptions): Promise<Blob> {
  if (!canExportMp4()) {
    throw new Error("MP4 non supporté — utilisez Chrome ou Edge récent");
  }

  const { signal, onProgress } = options;
  throwIfAborted(signal);

  const ctx = await createExportContext(options);
  const frameDurationUs = Math.round(1_000_000 / FPS);

  const muxer = new Muxer({
    target: new ArrayBufferTarget(),
    video: { codec: "avc", width: ctx.width, height: ctx.height, frameRate: FPS },
    fastStart: "in-memory",
  });

  const codec = await pickH264Codec(ctx.width, ctx.height);

  let encoderError: Error | null = null;

  const encoder = new VideoEncoder({
    output: (chunk, meta) => muxer.addVideoChunk(chunk, meta),
    error: (e) => {
      encoderError = e instanceof Error ? e : new Error(String(e));
    },
  });

  encoder.configure({
    codec,
    width: ctx.width,
    height: ctx.height,
    bitrate: 8_000_000,
    framerate: FPS,
  });

  try {
    for (let frame = 0; frame < ctx.totalFrames; frame++) {
      throwIfAborted(signal);
      if (encoderError) throw encoderError;

      const elapsed = frame / FPS;

      if (ctx.video) {
        await seekVideo(ctx.video, Math.min(elapsed, ctx.video.duration || elapsed), signal);
      }

      await waitForEncoderQueue(encoder, signal);
      drawFrame(ctx, options, elapsed);

      const videoFrame = new VideoFrame(ctx.canvas, {
        timestamp: frame * frameDurationUs,
        duration: frameDurationUs,
      });

      encoder.encode(videoFrame, { keyFrame: frame % FPS === 0 });
      videoFrame.close();

      onProgress?.((frame + 1) / ctx.totalFrames);

      if (frame % 10 === 0) {
        await sleep(0, signal);
      }
    }

    throwIfAborted(signal);
    if (encoderError) throw encoderError;

    await encoder.flush();
    muxer.finalize();

    const buffer = muxer.target.buffer;
    if (!buffer) throw new Error("Échec de la génération MP4");

    return new Blob([buffer], { type: "video/mp4" });
  } catch (err) {
    if (!signal?.aborted) throw err;
    throw new ExportCancelledError();
  } finally {
    cleanupVideo(ctx.video);
    if (encoder.state !== "closed") encoder.close();
  }
}

export async function exportMockupVideo(options: ExportOptions): Promise<Blob> {
  if (!options.totalDuration || options.totalDuration <= 0) {
    throw new Error("Durée invalide — ajoutez une vidéo ou relancez la preview.");
  }

  throwIfAborted(options.signal);
  options.onProgress?.(0);

  const format = options.format ?? "webm";
  if (format === "mp4") {
    return exportMockupVideoMp4(options);
  }
  return exportMockupVideoWebm(options);
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
