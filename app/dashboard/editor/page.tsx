"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { flushSync } from "react-dom";
import {
  Upload,
  Smartphone,
  Image as ImageIcon,
  Sparkles,
  Play,
  Pause,
  MonitorPlay,
  Download,
  Video,
  Move3D,
  RotateCcw,
  Loader2,
  X,
  Monitor,
} from "lucide-react";
import BackgroundLayer from "../components/BackgroundLayer";
import Scene2D from "../components/Scene2D";
import type { DeviceId } from "../components/Scene2D";
import type { AspectRatio } from "../lib/motionPresets";
import { MOTION_PRESETS, getExportDimensions, getPreset } from "../lib/motionPresets";
import { exportMockupVideo, downloadBlob, canExportMp4, isExportCancelled } from "../lib/exportVideo";
import {
  BACKGROUNDS,
  BACKGROUND_CATEGORIES,
  DEFAULT_BACKGROUND_ID,
  type BackgroundCategory,
  isLightBackground,
} from "../lib/backgrounds";
import { applyTemplateToEditor, getTemplate } from "../lib/templates";

type ExportFormat = "webm" | "mp4";

export default function EditorPage() {
  const [activeTabLeft, setActiveTabLeft] = useState("media");
  const [activeTabRight, setActiveTabRight] = useState("animate");

  const [backgroundId, setBackgroundId] = useState(DEFAULT_BACKGROUND_ID);
  const [bgCategory, setBgCategory] = useState<BackgroundCategory>("studio");
  const [device, setDevice] = useState("iphone15");
  const [animation, setAnimation] = useState("reveal");
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("9:16");
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoDuration, setVideoDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [exportFormat, setExportFormat] = useState<ExportFormat>(() =>
    typeof window !== "undefined" && canExportMp4() ? "mp4" : "webm"
  );
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [loadedTemplateName, setLoadedTemplateName] = useState<string | null>(null);

  const cropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const timingVideoRef = useRef<HTMLVideoElement | null>(null);
  const playIntervalRef = useRef<number | null>(null);
  const exportAbortRef = useRef<AbortController | null>(null);

  const introDuration = getPreset(animation).duration;
  const totalDuration = introDuration + (videoDuration || 4);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (videoUrl) URL.revokeObjectURL(videoUrl);
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
      setPlayhead(0);
    }
  };

  useEffect(() => {
    if (!videoUrl) {
      timingVideoRef.current = null;
      setVideoDuration(0);
      return;
    }

    const vid = document.createElement("video");
    vid.muted = true;
    vid.playsInline = true;
    vid.preload = "auto";
    vid.src = videoUrl;
    timingVideoRef.current = vid;

    const onMeta = () => setVideoDuration(vid.duration || 0);
    vid.addEventListener("loadedmetadata", onMeta);
    if (vid.readyState >= 1) onMeta();

    return () => {
      vid.removeEventListener("loadedmetadata", onMeta);
      vid.pause();
      vid.removeAttribute("src");
      vid.load();
      timingVideoRef.current = null;
    };
  }, [videoUrl]);

  const stopPlayback = useCallback(() => {
    if (playIntervalRef.current) {
      cancelAnimationFrame(playIntervalRef.current);
      playIntervalRef.current = null;
    }
    timingVideoRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const startPlayback = useCallback(() => {
    stopPlayback();
    setPlayhead(0);

    const vid = timingVideoRef.current;
    if (vid && videoUrl) {
      vid.currentTime = 0;
    }

    setIsPlaying(true);
    const start = performance.now();

    const tick = () => {
      const elapsed = (performance.now() - start) / 1000;
      if (elapsed >= totalDuration) {
        setPlayhead(totalDuration);
        stopPlayback();
        return;
      }
      setPlayhead(elapsed);
      playIntervalRef.current = requestAnimationFrame(tick);
    };
    playIntervalRef.current = requestAnimationFrame(tick);
  }, [stopPlayback, totalDuration, videoUrl]);

  useEffect(() => () => stopPlayback(), [stopPlayback]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const templateId = params.get("template");
    if (!templateId) return;

    const template = getTemplate(templateId);
    if (!template) return;

    const applied = applyTemplateToEditor(template);
    setDevice(applied.device);
    setAnimation(applied.animation);
    setAspectRatio(applied.aspectRatio);
    setBackgroundId(applied.backgroundId);
    setBgCategory(applied.bgCategory);
    setLoadedTemplateName(template.name);
    setPlayhead(0);
    stopPlayback();
  }, [stopPlayback]);

  const handleCancelExport = useCallback(() => {
    exportAbortRef.current?.abort();
  }, []);

  const handleExport = async () => {
    if (!cropRef.current) return;

    exportAbortRef.current?.abort();
    const abortController = new AbortController();
    exportAbortRef.current = abortController;

    stopPlayback();
    flushSync(() => setIsExporting(true));
    setExportProgress(0);

    try {
      const blob = await exportMockupVideo({
        cropElement: cropRef.current,
        deviceId: device as DeviceId,
        presetId: animation,
        backgroundId,
        aspectRatio,
        totalDuration,
        videoFile,
        format: exportFormat,
        onProgress: setExportProgress,
        signal: abortController.signal,
      });
      const dims = getExportDimensions(aspectRatio);
      const ratioLabel = aspectRatio.replace(":", "x");
      const ext = exportFormat === "mp4" ? "mp4" : "webm";
      downloadBlob(blob, `mockflow-${ratioLabel}-${dims.width}x${dims.height}.${ext}`);
    } catch (err) {
      if (isExportCancelled(err)) return;
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Erreur inconnue lors de l'export.";
      alert(message);
    } finally {
      if (exportAbortRef.current === abortController) {
        exportAbortRef.current = null;
      }
      setPlayhead(0);
      setIsPlaying(false);
      setIsExporting(false);
      setExportProgress(0);
    }
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const backgrounds = BACKGROUNDS.filter((b) => b.category === bgCategory);

  const exportDims = getExportDimensions(aspectRatio);

  return (
    <div className="flex h-[calc(100vh-68px-64px)] gap-6 animate-in fade-in duration-500">
      {/* LEFT COLUMN */}
      <div className="w-[320px] flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTabLeft("media")}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 ${activeTabLeft === "media" ? "bg-white/5 text-white border-b-2 border-[#3B7BFF]" : "text-white/40 hover:text-white/70"}`}
          >
            <Video size={14} /> Media
          </button>
          <button
            onClick={() => setActiveTabLeft("env")}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 ${activeTabLeft === "env" ? "bg-white/5 text-white border-b-2 border-[#3B7BFF]" : "text-white/40 hover:text-white/70"}`}
          >
            <ImageIcon size={14} /> Environment
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {activeTabLeft === "media" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <Upload size={16} className="text-[#3B7BFF]" /> Upload Recording
                </h3>
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-white/[0.02] hover:border-[#3B7BFF]/50 transition-colors cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Upload size={18} className="text-white/60" />
                  </div>
                  <p className="text-sm text-white font-medium mb-1">
                    {videoFile ? videoFile.name : "Click or drag video"}
                  </p>
                  <p className="text-xs text-white/40">MP4, MOV, WebM up to 50MB</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Device Model</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: "iphone15", label: "iPhone 15 Pro", icon: Smartphone },
                    { id: "iphone11", label: "iPhone 11", icon: Smartphone },
                    { id: "samsung", label: "Samsung S24", icon: Smartphone },
                    { id: "pixel", label: "Pixel 8 Pro", icon: Smartphone },
                    { id: "ipad", label: "iPad Mini", icon: Smartphone },
                    { id: "desktop", label: "MacBook Pro", icon: Monitor },
                    { id: "pc", label: "PC Monitor", icon: Monitor },
                  ].map((d) => {
                    const Icon = d.icon;
                    const isWide = d.id === "desktop" || d.id === "pc";
                    return (
                    <button
                      key={d.id}
                      onClick={() => {
                        setDevice(d.id);
                        setPlayhead(0);
                      }}
                      className={`py-2.5 px-3 rounded-lg text-xs font-medium border text-left flex items-center gap-2 transition-colors ${
                        device === d.id
                          ? "bg-[#3B7BFF]/10 border-[#3B7BFF]/50 text-white"
                          : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5"
                      } ${isWide ? "col-span-2" : ""}`}
                    >
                      <Icon size={14} className={device === d.id ? "text-[#3B7BFF]" : ""} />
                      {d.label}
                    </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTabLeft === "env" && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-2">
                  <Sparkles size={16} className="text-purple-400" /> Background
                </h3>
                <p className="text-[11px] text-white/40 mb-3">
                  {bgCategory === "color"
                    ? "Dégradés lumineux style iOS — parfaits pour les tutos app."
                    : bgCategory === "light"
                      ? "Fonds neutres clairs, minimalistes."
                      : "Fonds studio sombres pour un rendu product shot."}
                </p>

                <div className="flex gap-1 p-1 bg-white/[0.03] rounded-lg border border-white/5 mb-4">
                  {BACKGROUND_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setBgCategory(cat.id)}
                      className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-colors ${
                        bgCategory === cat.id
                          ? "bg-white/10 text-white"
                          : "text-white/40 hover:text-white/70"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  {backgrounds.map((bg) => {
                    const thumbLight = isLightBackground(bg.id);
                    return (
                    <button
                      key={bg.id}
                      onClick={() => setBackgroundId(bg.id)}
                      className={`group relative aspect-video rounded-lg border-2 overflow-hidden transition-all ${
                        backgroundId === bg.id
                          ? "border-[#3B7BFF] shadow-[0_0_15px_rgba(59,123,255,0.3)]"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <BackgroundLayer backgroundId={bg.id} />
                      <div
                        className={`absolute inset-0 bg-gradient-to-t ${
                          thumbLight ? "from-white/80 via-transparent" : "from-black/60 via-transparent"
                        } to-transparent`}
                      />
                      <div className="absolute bottom-0 left-0 right-0 px-2 py-1.5">
                        <span
                          className={`text-[10px] font-medium drop-shadow-sm ${
                            thumbLight ? "text-gray-800" : "text-white"
                          }`}
                        >
                          {bg.name}
                        </span>
                      </div>
                      {backgroundId === bg.id && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#3B7BFF] flex items-center justify-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        </div>
                      )}
                    </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MIDDLE COLUMN: Crop Preview */}
      <div className="flex-1 flex flex-col relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#030408]">
        {loadedTemplateName && (
          <div className="absolute top-16 left-4 right-4 z-20 flex justify-center pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-3 bg-[#3B7BFF]/15 border border-[#3B7BFF]/30 backdrop-blur-md rounded-lg px-4 py-2 max-w-md">
              <Sparkles size={14} className="text-[#93c5fd] shrink-0" />
              <p className="text-xs text-white/90 flex-1">
                Template <span className="font-semibold text-white">{loadedTemplateName}</span>
                {" "}— uploade ta capture pour commencer.
              </p>
              <button
                type="button"
                onClick={() => setLoadedTemplateName(null)}
                className="text-white/40 hover:text-white transition-colors shrink-0"
                aria-label="Fermer"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="pointer-events-auto bg-black/50 backdrop-blur-md border border-white/10 rounded-lg px-3 py-1.5 flex items-center gap-2">
            <span className="text-[10px] text-white/50 uppercase tracking-wider">Crop</span>
            <span className="text-xs font-mono text-white">{exportDims.width}×{exportDims.height}</span>
          </div>

          <div className="pointer-events-auto bg-black/50 backdrop-blur-md border border-white/10 rounded-lg p-1 flex gap-1">
            {(["16:9", "9:16", "1:1"] as AspectRatio[]).map((ratio) => (
              <button
                key={ratio}
                onClick={() => {
                  setAspectRatio(ratio);
                  setPlayhead(0);
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-colors ${
                  aspectRatio === ratio ? "text-white bg-white/10" : "text-white/70 hover:text-white"
                }`}
              >
                {ratio}
              </button>
            ))}
          </div>
        </div>

        {/* Letterboxed crop frame */}
        <div className="flex-1 flex items-center justify-center p-6 pt-16 pb-2">
          <div
            className="relative shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_24px_80px_rgba(0,0,0,0.5)]"
            style={{
              aspectRatio: aspectRatio.replace(":", " / "),
              width: aspectRatio === "16:9" ? "100%" : "auto",
              height: aspectRatio === "16:9" ? "auto" : "100%",
              maxWidth: "100%",
              maxHeight: "100%",
            }}
          >
            <div
              ref={cropRef}
              data-exporting={isExporting ? "true" : undefined}
              className="absolute inset-0 overflow-hidden"
            >
              <BackgroundLayer backgroundId={backgroundId} isExporting={isExporting} />
              <Scene2D
                videoUrl={videoUrl}
                animation={animation}
                device={device}
                aspectRatio={aspectRatio}
                playhead={playhead}
                isPlaying={isPlaying}
                videoTime={playhead}
                videoPlaying={isPlaying && !isExporting}
                backgroundId={backgroundId}
                isExporting={isExporting}
              />
            </div>

            {isExporting && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/55">
                <Loader2 size={28} className="text-white animate-spin mb-3" />
                <p className="text-sm font-medium text-white">Export en cours…</p>
                <p className="text-xs text-white/60 mt-1 font-mono mb-4">
                  {Math.round(exportProgress * 100)}%
                </p>
                <button
                  type="button"
                  onClick={handleCancelExport}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium transition-colors"
                >
                  <X size={16} />
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="h-14 bg-black/60 backdrop-blur-xl border-t border-white/10 flex items-center px-4 gap-4">
          <button
            onClick={isPlaying ? stopPlayback : startPlayback}
            className="text-white hover:text-[#3B7BFF] transition-colors"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button
            onClick={() => {
              stopPlayback();
              setPlayhead(0);
            }}
            className="text-white/50 hover:text-white transition-colors"
            title="Rejouer l'intro"
          >
            <RotateCcw size={16} />
          </button>
          <span className="text-xs text-white/50 font-mono min-w-[90px]">
            {formatTime(playhead)} / {formatTime(totalDuration)}
          </span>
          <div
            className="flex-1 h-1.5 bg-white/10 rounded-full relative overflow-hidden cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const ratio = (e.clientX - rect.left) / rect.width;
              setPlayhead(ratio * totalDuration);
            }}
          >
            <div
              className={`absolute left-0 top-0 bottom-0 bg-[#3B7BFF] rounded-full ${
                isPlaying ? "" : "transition-[width] duration-150"
              }`}
              style={{ width: `${totalDuration > 0 ? (playhead / totalDuration) * 100 : 0}%` }}
            />
            {introDuration > 0 && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-purple-400/80"
                style={{ left: `${(introDuration / totalDuration) * 100}%` }}
                title="Fin de l'intro"
              />
            )}
          </div>
          <span className="text-[10px] text-white/30 hidden sm:block">
            Intro {introDuration}s
          </span>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-[280px] flex flex-col bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="flex border-b border-white/5">
          <button
            onClick={() => setActiveTabRight("animate")}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 ${activeTabRight === "animate" ? "bg-white/5 text-white border-b-2 border-purple-500" : "text-white/40 hover:text-white/70"}`}
          >
            <Move3D size={14} /> Animate
          </button>
          <button
            onClick={() => setActiveTabRight("export")}
            className={`flex-1 py-3 text-xs font-medium flex items-center justify-center gap-2 ${activeTabRight === "export" ? "bg-white/5 text-white border-b-2 border-emerald-500" : "text-white/40 hover:text-white/70"}`}
          >
            <Download size={14} /> Export
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
          {activeTabRight === "animate" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold text-white mb-1">Motion Preset</h3>
                <p className="text-[11px] text-white/40 mb-3">
                  Intro ≤ 2 s — le téléphone se place face caméra pour lire votre tuto.
                </p>
                <div className="space-y-2">
                  {MOTION_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        stopPlayback();
                        setAnimation(preset.id);
                        setPlayhead(0);
                      }}
                      className={`w-full py-2.5 px-3 rounded-lg text-left border transition-colors ${
                        animation === preset.id
                          ? "bg-purple-500/10 border-purple-500/50"
                          : "bg-white/[0.02] border-white/10 hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-xs font-semibold ${animation === preset.id ? "text-purple-300" : "text-white/80"}`}>
                          {preset.label}
                        </span>
                        {preset.duration > 0 && (
                          <span className="text-[10px] text-white/40 font-mono">{preset.duration}s</span>
                        )}
                      </div>
                      <p className="text-[10px] text-white/40 mt-0.5">{preset.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTabRight === "export" && (
            <div className="space-y-6 flex flex-col h-full">
              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Format d&apos;export</h3>
                <div className="grid grid-cols-2 gap-2">
                  {(["mp4", "webm"] as ExportFormat[]).map((fmt) => {
                    const mp4Supported = canExportMp4();
                    const disabled = fmt === "mp4" && !mp4Supported;
                    return (
                    <button
                      key={fmt}
                      onClick={() => !disabled && setExportFormat(fmt)}
                      disabled={disabled}
                      className={`py-2 px-2 rounded-lg text-xs font-bold border text-center uppercase transition-colors ${
                        exportFormat === fmt
                          ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400"
                          : disabled
                            ? "bg-white/[0.02] border-white/10 text-white/30 cursor-not-allowed"
                            : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5"
                      }`}
                    >
                      {fmt}
                    </button>
                    );
                  })}
                </div>
                {!canExportMp4() && (
                  <p className="text-[10px] text-white/30 mt-2">
                    MP4 nécessite Chrome ou Edge récent. WebM disponible partout.
                  </p>
                )}
                {exportFormat === "mp4" && canExportMp4() && (
                  <p className="text-[10px] text-white/30 mt-2">
                    H.264 — compatible Instagram, TikTok, YouTube.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white mb-3">Rognage</h3>
                <div className="space-y-2">
                  {(["9:16", "16:9", "1:1"] as AspectRatio[]).map((ratio) => {
                    const dims = getExportDimensions(ratio);
                    return (
                      <button
                        key={ratio}
                        onClick={() => {
                          setAspectRatio(ratio);
                          setPlayhead(0);
                        }}
                        className={`w-full py-2 px-3 rounded-lg text-xs border flex items-center justify-between transition-colors ${
                          aspectRatio === ratio
                            ? "bg-white/10 border-white/30 text-white"
                            : "bg-white/[0.02] border-white/10 text-white/60 hover:bg-white/5"
                        }`}
                      >
                        <span className="font-semibold">
                          {ratio === "9:16" ? "Portrait" : ratio === "16:9" ? "Paysage" : "Carré"}
                        </span>
                        <span className={aspectRatio === ratio ? "text-white/60" : "text-white/40"}>
                          {dims.width}×{dims.height}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-auto pt-4 border-t border-white/10">
                {isExporting && (
                  <div className="mb-3">
                    <div className="flex justify-between text-xs text-white/60 mb-1">
                      <span>Export en cours…</span>
                      <span>{Math.round(exportProgress * 100)}%</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all"
                        style={{ width: `${exportProgress * 100}%` }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCancelExport}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-white/10 hover:bg-white/15 text-white/80 text-sm transition-colors"
                    >
                      <X size={14} />
                      Annuler l&apos;export
                    </button>
                  </div>
                )}
                <button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-[#06070A] font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {isExporting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Export…
                    </>
                  ) : (
                    <>
                      <MonitorPlay size={16} /> Exporter {aspectRatio}
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
