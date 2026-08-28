import { getPublicTestResult } from "@/lib/test-factory/result";
import { createResultImageResponse } from "@/lib/test-factory/render-result-image";

export const alt = "테스트 결과 공유 이미지";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: { params: Promise<{ testSlug: string; resultToken: string }> }) {
  const { testSlug, resultToken } = await params;
  const result = await getPublicTestResult(testSlug, resultToken);
  if (!result) return new Response("Result not found", { status: 404 });
  return createResultImageResponse(result, "og");
}
