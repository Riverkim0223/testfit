import { getPublicTestResult } from "@/lib/test-factory/result";
import { createResultImageResponse } from "@/lib/test-factory/render-result-image";
import { normalizeImageVariant } from "@/lib/test-factory/share";

export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ testSlug: string; resultToken: string }> }) {
  const { testSlug, resultToken } = await params;
  const result = await getPublicTestResult(testSlug, resultToken);
  if (!result) return Response.json({ message: "Result not found" }, { status: 404 });
  const variant = normalizeImageVariant(new URL(request.url).searchParams.get("variant"));
  return createResultImageResponse(result, variant);
}
