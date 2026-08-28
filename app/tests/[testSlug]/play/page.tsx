import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { TestRunner } from "@/components/test-factory/TestRunner";
import { getTestPack } from "@/lib/test-factory/registry";

interface Props { params: Promise<{ testSlug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testSlug } = await params;
  const pack = getTestPack(testSlug);
  return {
    title: pack ? `${pack.title} 진행하기` : "테스트 진행",
    robots: { index: false, follow: false },
  };
}

export default async function PlayPage({ params }: Props) {
  const { testSlug } = await params;
  const pack = getTestPack(testSlug);
  if (!pack || pack.status !== "active") notFound();
  return <TestRunner pack={pack} />;
}
