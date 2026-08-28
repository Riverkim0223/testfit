import type { MetadataRoute } from "next";
import { listActiveTestPacks } from "@/lib/test-factory/registry";
import { getSiteUrl } from "@/lib/test-factory/site-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();
  return [
    { url: new URL("/", siteUrl).toString(), changeFrequency: "weekly", priority: 1 },
    ...listActiveTestPacks().map((pack) => ({
      url: new URL(`/tests/${pack.slug}`, siteUrl).toString(),
      changeFrequency: "weekly" as const,
      priority: .9,
    })),
  ];
}
