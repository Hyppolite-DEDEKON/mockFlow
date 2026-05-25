import type { DeviceId } from "../components/Scene2D";
import type { AnimationPreset, AspectRatio } from "./motionPresets";
import { getBackground } from "./backgrounds";
import { getPreset } from "./motionPresets";

export type TemplatePlatform =
  | "tiktok"
  | "youtube"
  | "instagram"
  | "linkedin"
  | "app-store"
  | "general";

export type TemplateStyle = "dark" | "light" | "color";

export interface MockflowTemplate {
  id: string;
  name: string;
  description: string;
  device: DeviceId;
  backgroundId: string;
  animation: AnimationPreset;
  aspectRatio: AspectRatio;
  platform: TemplatePlatform;
  style: TemplateStyle;
  featured?: boolean;
  tags: string[];
}

export const PLATFORM_LABELS: Record<TemplatePlatform, string> = {
  tiktok: "TikTok",
  youtube: "YouTube",
  instagram: "Instagram",
  linkedin: "LinkedIn",
  "app-store": "App Store",
  general: "Général",
};

export const STYLE_LABELS: Record<TemplateStyle, string> = {
  dark: "Sombre",
  light: "Clair",
  color: "Coloré",
};

export const DEVICE_LABELS: Record<DeviceId, string> = {
  iphone15: "iPhone 15",
  iphone11: "iPhone 11",
  samsung: "Samsung",
  pixel: "Pixel",
  ipad: "iPad",
  desktop: "MacBook Pro",
};

export const ASPECT_LABELS: Record<AspectRatio, string> = {
  "9:16": "Portrait",
  "16:9": "Paysage",
  "1:1": "Carré",
};

export const MOCKFLOW_TEMPLATES: MockflowTemplate[] = [
  {
    id: "tiktok-demo",
    name: "TikTok App Demo",
    description: "Intro dynamique pour présenter une app mobile en vertical.",
    device: "iphone15",
    backgroundId: "studio-pro",
    animation: "reveal",
    aspectRatio: "9:16",
    platform: "tiktok",
    style: "dark",
    featured: true,
    tags: ["portrait", "tutorial", "mobile"],
  },
  {
    id: "reels-vibrant",
    name: "Reels Coloré",
    description: "Fond iOS lumineux et zoom d'intro pour capter l'attention.",
    device: "iphone15",
    backgroundId: "apple-dawn",
    animation: "zoom",
    aspectRatio: "9:16",
    platform: "instagram",
    style: "color",
    featured: true,
    tags: ["portrait", "social", "colorful"],
  },
  {
    id: "youtube-tutorial",
    name: "YouTube Tutoriel",
    description: "Format paysage avec rotation focus — idéal pour walkthroughs longs.",
    device: "iphone15",
    backgroundId: "slate-studio",
    animation: "focus",
    aspectRatio: "16:9",
    platform: "youtube",
    style: "dark",
    featured: true,
    tags: ["landscape", "tutorial", "youtube"],
  },
  {
    id: "instagram-story",
    name: "Story Instagram",
    description: "Entrée latérale sur fond pastel, parfait pour les stories.",
    device: "iphone15",
    backgroundId: "apple-bloom",
    animation: "slide",
    aspectRatio: "9:16",
    platform: "instagram",
    style: "color",
    tags: ["portrait", "story", "pastel"],
  },
  {
    id: "linkedin-product",
    name: "LinkedIn Product",
    description: "Look pro minimaliste en paysage pour les annonces B2B.",
    device: "iphone15",
    backgroundId: "apple-clean",
    animation: "static",
    aspectRatio: "16:9",
    platform: "linkedin",
    style: "light",
    tags: ["landscape", "professional", "minimal"],
  },
  {
    id: "app-store-preview",
    name: "App Store Preview",
    description: "Fond clair Apple-like, téléphone centré pour les previews store.",
    device: "iphone15",
    backgroundId: "apple-clean",
    animation: "reveal",
    aspectRatio: "9:16",
    platform: "app-store",
    style: "light",
    tags: ["portrait", "app-store", "clean"],
  },
  {
    id: "android-demo",
    name: "Android Demo",
    description: "Samsung sur fond bleu profond — démo Android crédible.",
    device: "samsung",
    backgroundId: "ocean-deep",
    animation: "reveal",
    aspectRatio: "9:16",
    platform: "general",
    style: "dark",
    tags: ["portrait", "android", "mobile"],
  },
  {
    id: "pixel-showcase",
    name: "Pixel Showcase",
    description: "Esthétique sombre et focus rotation pour apps Google-style.",
    device: "pixel",
    backgroundId: "carbon",
    animation: "focus",
    aspectRatio: "9:16",
    platform: "general",
    style: "dark",
    tags: ["portrait", "android", "dark"],
  },
  {
    id: "desktop-saas",
    name: "SaaS Desktop",
    description: "MacBook Pro en paysage — idéal pour démos web et dashboards.",
    device: "desktop",
    backgroundId: "apple-clean",
    animation: "reveal",
    aspectRatio: "16:9",
    platform: "youtube",
    style: "light",
    featured: true,
    tags: ["landscape", "desktop", "saas", "web"],
  },
  {
    id: "ipad-saas",
    name: "iPad SaaS",
    description: "Tablette en paysage sur fond papier — dashboards et web apps.",
    device: "ipad",
    backgroundId: "paper-white",
    animation: "static",
    aspectRatio: "16:9",
    platform: "general",
    style: "light",
    tags: ["landscape", "tablet", "saas"],
  },
  {
    id: "minimal-square",
    name: "Carré Minimal",
    description: "Format 1:1 épuré pour posts Instagram et LinkedIn.",
    device: "iphone15",
    backgroundId: "concrete",
    animation: "static",
    aspectRatio: "1:1",
    platform: "general",
    style: "light",
    tags: ["square", "minimal", "social"],
  },
  {
    id: "neon-launch",
    name: "Neon Launch",
    description: "Annonce produit avec slide latéral et ambiance néon.",
    device: "iphone15",
    backgroundId: "neon-noir",
    animation: "slide",
    aspectRatio: "9:16",
    platform: "tiktok",
    style: "dark",
    featured: true,
    tags: ["portrait", "launch", "neon"],
  },
  {
    id: "onboarding-ios",
    name: "Onboarding iOS",
    description: "iPhone 11, montée douce sur fond wave — parfait pour onboarding.",
    device: "iphone11",
    backgroundId: "apple-wave",
    animation: "reveal",
    aspectRatio: "9:16",
    platform: "app-store",
    style: "color",
    tags: ["portrait", "onboarding", "ios"],
  },
];

export function getTemplate(id: string): MockflowTemplate | undefined {
  return MOCKFLOW_TEMPLATES.find((t) => t.id === id);
}

export function getFeaturedTemplates(): MockflowTemplate[] {
  return MOCKFLOW_TEMPLATES.filter((t) => t.featured);
}

export function applyTemplateToEditor(template: MockflowTemplate) {
  const bg = getBackground(template.backgroundId);
  return {
    device: template.device,
    animation: template.animation,
    aspectRatio: template.aspectRatio,
    backgroundId: template.backgroundId,
    bgCategory: bg.category,
  };
}

export function getTemplateMeta(template: MockflowTemplate) {
  const motion = getPreset(template.animation);
  return {
    deviceLabel: DEVICE_LABELS[template.device],
    motionLabel: motion.label,
    aspectLabel: ASPECT_LABELS[template.aspectRatio],
    platformLabel: PLATFORM_LABELS[template.platform],
    styleLabel: STYLE_LABELS[template.style],
    introDuration: motion.duration,
  };
}
