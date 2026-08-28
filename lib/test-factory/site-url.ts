const LOCAL_SITE_URL = "http://localhost:3000";

export function getSiteUrl(): URL {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined) ??
    LOCAL_SITE_URL;

  try {
    return new URL(configured);
  } catch {
    throw new Error(
      `Invalid site URL: ${configured}. Set NEXT_PUBLIC_SITE_URL to an absolute URL.`,
    );
  }
}

export function getTestPath(testSlug: string): string {
  return `/tests/${encodeURIComponent(testSlug)}`;
}

export function getResultPath(testSlug: string, resultToken: string): string {
  return `${getTestPath(testSlug)}/result/${encodeURIComponent(resultToken)}`;
}

export function getResultUrl(testSlug: string, resultToken: string): string {
  return new URL(getResultPath(testSlug, resultToken), getSiteUrl()).toString();
}

export function getShareImagePath(
  testSlug: string,
  resultToken: string,
  variant: "feed" | "story" = "feed",
): string {
  const search = new URLSearchParams({ variant });
  return `/api/tests/${encodeURIComponent(testSlug)}/results/${encodeURIComponent(resultToken)}/share-image?${search}`;
}
