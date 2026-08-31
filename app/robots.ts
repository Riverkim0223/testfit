import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/test-factory/site-url";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/tests/*/play", "/tests/*/result/", "/studio", "/api/studio/"] },
    sitemap: new URL("/sitemap.xml", getSiteUrl()).toString(),
  };
}
