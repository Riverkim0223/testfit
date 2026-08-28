import type { TestPack } from "@/lib/test-factory/types";
import { getSiteUrl } from "@/lib/test-factory/site-url";

export function TestStructuredData({ pack }: { pack: TestPack }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: pack.title,
    description: pack.description,
    applicationCategory: "EntertainmentApplication",
    operatingSystem: "Web",
    url: new URL(`/tests/${pack.slug}`, getSiteUrl()).toString(),
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
  };

  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
