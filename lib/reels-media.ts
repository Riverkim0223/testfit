export type ReelsMediaMode =
  | "owned-video"
  | "instagram"
  | "tiktok"
  | "external-link";

export type SourcePlatform =
  | "instagram"
  | "tiktok"
  | "youtube"
  | "other";

export type ContentKind = "CHALLENGE" | "AUDIO";

export type AxisCode =
  | "ENERGY"
  | "SPOTLIGHT"
  | "MOTION"
  | "PRODUCTION";

export type TagCode =
  | "CUTE"
  | "EXPRESSION"
  | "PRECISION"
  | "TRANSITION"
  | "DETAIL"
  | "MOOD";

export interface ReelsMediaSource {
  mode: ReelsMediaMode;
  sourceUrl: string;
  platform: SourcePlatform;
  videoUrl?: string;
  posterUrl?: string;
  alt: string;
}

export interface ReelsMediaCatalogItem {
  id: string;
  kind: ContentKind;
  title: string;
  creator?: string;
  description: string;
  format: string;
  media: ReelsMediaSource;
  participantTypes: string[];
  eligibleSlots: string[];
  preferredProfiles: string[];
  axes: Record<AxisCode, number>;
  tags: Record<TagCode, number>;
  movementDifficulty?: number;
  productionEffort?: number;
  trendScore: number;
  status: "ACTIVE" | "WATCHLIST" | "FALLBACK";
  verifiedAt: string;
  rightsNote?: string;
  editorialNote?: string;
}

const INSTAGRAM_HOSTS = new Set(["instagram.com", "www.instagram.com"]);
const TIKTOK_HOSTS = new Set(["tiktok.com", "www.tiktok.com"]);
const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "youtu.be",
]);

export function parseHttpsUrl(value: string): URL | null {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "https:" ? parsed : null;
  } catch {
    return null;
  }
}

export function detectSourcePlatform(sourceUrl: string): SourcePlatform {
  const parsed = parseHttpsUrl(sourceUrl);
  if (!parsed) return "other";

  const hostname = parsed.hostname.toLowerCase();
  if (INSTAGRAM_HOSTS.has(hostname)) return "instagram";
  if (TIKTOK_HOSTS.has(hostname)) return "tiktok";
  if (YOUTUBE_HOSTS.has(hostname)) return "youtube";
  return "other";
}

export function isInstagramEmbeddableUrl(sourceUrl: string): boolean {
  const parsed = parseHttpsUrl(sourceUrl);
  if (!parsed || !INSTAGRAM_HOSTS.has(parsed.hostname.toLowerCase())) {
    return false;
  }

  return /^\/(reel|p|tv)\/[^/]+\/?/i.test(parsed.pathname);
}

export function normalizeInstagramPermalink(sourceUrl: string): string | null {
  if (!isInstagramEmbeddableUrl(sourceUrl)) return null;

  const parsed = new URL(sourceUrl);
  parsed.search = "";
  parsed.hash = "";
  if (!parsed.pathname.endsWith("/")) parsed.pathname += "/";
  return parsed.toString();
}

export function extractTikTokVideoId(sourceUrl: string): string | null {
  const parsed = parseHttpsUrl(sourceUrl);
  if (!parsed || !TIKTOK_HOSTS.has(parsed.hostname.toLowerCase())) {
    return null;
  }

  return parsed.pathname.match(/\/video\/(\d+)/i)?.[1] ?? null;
}

export function resolveMediaMode(params: {
  sourceUrl: string;
  kind: ContentKind;
  ownedVideoUrl?: string;
}): ReelsMediaMode {
  if (params.ownedVideoUrl) return "owned-video";
  if (params.kind === "AUDIO") return "external-link";
  if (isInstagramEmbeddableUrl(params.sourceUrl)) return "instagram";
  if (extractTikTokVideoId(params.sourceUrl)) return "tiktok";
  return "external-link";
}

export function buildTikTokPlayerUrl(sourceUrl: string): string | null {
  const videoId = extractTikTokVideoId(sourceUrl);
  if (!videoId) return null;

  const params = new URLSearchParams({
    controls: "1",
    progress_bar: "1",
    play_button: "1",
    volume_control: "1",
    fullscreen_button: "1",
    timestamp: "1",
    loop: "1",
    autoplay: "0",
    music_info: "1",
    description: "1",
    rel: "0",
  });

  return `https://www.tiktok.com/player/v1/${videoId}?${params.toString()}`;
}

export function getPreviewButtonLabel(source: ReelsMediaSource): string {
  switch (source.mode) {
    case "owned-video":
      return "영상 재생";
    case "instagram":
      return "Instagram 미리보기";
    case "tiktok":
      return "TikTok 미리보기";
    default:
      return "원본 콘텐츠 열기";
  }
}
