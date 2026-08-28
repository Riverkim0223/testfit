const LOCAL_SITE_URL = "http://localhost:3000";

function cleanEnvironmentValue(value: string | undefined): string | undefined {
  const cleaned = value?.trim();
  return cleaned ? cleaned : undefined;
}

function toAbsoluteUrl(value: string): string {
  return /^https?:\/\//i.test(value) ? value : `https://${value}`;
}

export function getSiteUrl(): URL {
  const configuredSiteUrl =
    cleanEnvironmentValue(process.env.NEXT_PUBLIC_SITE_URL) ??
    cleanEnvironmentValue(process.env.SITE_URL);

  const vercelHost =
    cleanEnvironmentValue(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
    cleanEnvironmentValue(process.env.VERCEL_URL);

  const resolved = configuredSiteUrl
    ? toAbsoluteUrl(configuredSiteUrl)
    : vercelHost
      ? toAbsoluteUrl(vercelHost)
      : LOCAL_SITE_URL;

  try {
    return new URL(resolved);
  } catch {
    throw new Error(
      `Invalid site URL: ${resolved}. Set NEXT_PUBLIC_SITE_URL to an absolute URL such as https://example.com.`,
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
