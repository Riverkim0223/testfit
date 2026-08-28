import type { PublicTestResult } from "./types";
import { getResultUrl, getShareImagePath } from "./site-url";

export type ShareImageVariant = "og" | "feed" | "story";

export const SHARE_IMAGE_SPECS = {
  og: { width: 1200, height: 630 },
  feed: { width: 1080, height: 1350 },
  story: { width: 1080, height: 1920 },
} as const;

export function buildResultMetaTitle(result: PublicTestResult): string {
  return `${result.profileTitle} ${result.profileEmoji} | ${result.testTitle} 결과`;
}

export function buildResultMetaDescription(result: PublicTestResult): string {
  return `나의 ${result.testTitle} 결과는 ${result.profileTitle}. ${result.profileSubtitle} 결과와 추천 내용을 확인해보세요.`;
}

export function buildResultSharePayload(result: PublicTestResult) {
  return {
    title: buildResultMetaTitle(result),
    text: `${result.shareText}\n너의 결과도 확인해봐!`,
    url: getResultUrl(result.testSlug, result.token),
    imageUrl: getShareImagePath(result.testSlug, result.token, "feed"),
    storyImageUrl: getShareImagePath(result.testSlug, result.token, "story"),
    fileName: `${result.testSlug}-${result.profileId}.png`,
  };
}

export function normalizeImageVariant(
  value: string | null,
): Exclude<ShareImageVariant, "og"> {
  return value === "story" ? "story" : "feed";
}
