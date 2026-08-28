import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestResultPage } from "@/components/test-factory/TestResultPage";
import { getPublicTestResult } from "@/lib/test-factory/result";
import { buildResultMetaDescription, buildResultMetaTitle } from "@/lib/test-factory/share";
import { getResultUrl } from "@/lib/test-factory/site-url";

interface Props { params: Promise<{ testSlug: string; resultToken: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testSlug, resultToken } = await params;
  const result = await getPublicTestResult(testSlug, resultToken);
  if (!result) return { title: "결과를 찾을 수 없어요", robots: { index: false, follow: false } };

  const title = buildResultMetaTitle(result);
  const description = buildResultMetaDescription(result);
  const canonical = getResultUrl(testSlug, resultToken);
  return {
    title: { absolute: title },
    description,
    alternates: { canonical },
    robots: { index: false, follow: false, noarchive: true },
    openGraph: { type: "website", locale: "ko_KR", siteName: "Test Factory", url: canonical, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ResultPage({ params }: Props) {
  const { testSlug, resultToken } = await params;
  const result = await getPublicTestResult(testSlug, resultToken);
  if (!result) notFound();
  return <TestResultPage result={result} />;
}
