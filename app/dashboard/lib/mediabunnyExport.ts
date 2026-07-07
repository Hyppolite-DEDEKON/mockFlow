import {
  ALL_FORMATS,
  AudioBufferSource,
  BlobSource,
  BufferTarget,
  CanvasSource,
  Input,
  Mp4OutputFormat,
  Output,
  WebMOutputFormat,
  AudioSampleSink,
  canEncodeAudio,
  type InputAudioTrack,
} from "mediabunny";
import { registerAacEncoder } from "@mediabunny/aac-encoder";
import type { ExportOptions } from "./exportVideo";
import { drawMockupFrame } from "./canvasRenderer";
import { getExportDimensions, getPoseAtTime, getPreset } from "./motionPresets";
import type { Pose } from "./motionPresets";

const FPS = 30;
const AUDIO_BITRATE = 128_000;

let aacEncoderReady = false;

export async function ensureAacEncoder(): Promise<void> {
  if (aacEncoderReady) return;
  if (!(await canEncodeAudio("aac"))) {
    registerAacEncoder();
  }
  aacEncoderReady = true;
}

export class ExportCancelledError extends Error {
  constructor() {
    super("Export annulé");
    this.name = "ExportCancelledError";
  }
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new ExportCancelledError();
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

async function createExportContext(options: ExportOptions) {
  const { aspectRatio, videoFile, cropElement, totalDuration, presetId } = options;
  const { width, height } = getExportDimensions(aspectRatio);
  const introDuration = getPreset(presetId).duration;
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
  ctx: Awaited<ReturnType<typeof createExportContext>>,
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

async function pipeAudioFromFile(
  audioSource: AudioBufferSource,
  audioTrack: InputAudioTrack,
  durationSec: number,
  signal?: AbortSignal
) {
  const sink = new AudioSampleSink(audioTrack);
  for await (const sample of sink.samples(0, durationSec)) {
    throwIfAborted(signal);
    try {
      await audioSource.add(sample.toAudioBuffer());
    } finally {
      sample.close();
    }
  }
}

export async function exportMockupVideoMediabunny(
  options: ExportOptions,
  format: "mp4" | "webm"
): Promise<Blob> {
  const { signal, onProgress, videoFile, totalDuration } = options;
  throwIfAborted(signal);

  if (format === "mp4") {
    await ensureAacEncoder();
  }

  const ctx = await createExportContext(options);

  const output = new Output({
    format: format === "mp4" ? new Mp4OutputFormat() : new WebMOutputFormat(),
    target: new BufferTarget(),
  });

  const videoSource = new CanvasSource(ctx.canvas, {
    codec: format === "mp4" ? "avc" : "vp9",
    bitrate: 8_000_000,
  });
  output.addVideoTrack(videoSource, { frameRate: FPS });

  let audioSource: AudioBufferSource | null = null;
  let audioTrack: InputAudioTrack | null = null;

  if (videoFile) {
    const input = new Input({
      formats: ALL_FORMATS,
      source: new BlobSource(videoFile),
    });
    audioTrack = await input.getPrimaryAudioTrack();
    if (audioTrack && (await audioTrack.canDecode())) {
      const audioCodec = format === "mp4" ? "aac" : "opus";
      if (format === "mp4" || (await canEncodeAudio("opus"))) {
        audioSource = new AudioBufferSource({
          codec: audioCodec,
          bitrate: AUDIO_BITRATE,
        });
        output.addAudioTrack(audioSource);
      }
    }
  }

  const audioDuration = Math.min(
    totalDuration,
    ctx.video?.duration || totalDuration
  );

  try {
    await output.start();

    const audioTask =
      audioSource && audioTrack
        ? pipeAudioFromFile(audioSource, audioTrack, audioDuration, signal)
        : Promise.resolve();

    for (let frame = 0; frame < ctx.totalFrames; frame++) {
      throwIfAborted(signal);

      const elapsed = frame / FPS;

      if (ctx.video) {
        await seekVideo(
          ctx.video,
          Math.min(elapsed, ctx.video.duration || elapsed),
          signal
        );
      }

      drawFrame(ctx, options, elapsed);
      await videoSource.add(elapsed, 1 / FPS);
      onProgress?.((frame + 1) / ctx.totalFrames);
    }

    await audioTask;
    throwIfAborted(signal);
    await output.finalize();
    onProgress?.(1);

    const buffer = output.target.buffer;
    if (!buffer) {
      throw new Error("Échec de la génération du fichier vidéo");
    }

    return new Blob([buffer], {
      type: format === "mp4" ? "video/mp4" : "video/webm",
    });
  } catch (err) {
    if (signal?.aborted) throw new ExportCancelledError();
    throw err;
  } finally {
    cleanupVideo(ctx.video);
  }
}
