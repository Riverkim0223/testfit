import {
  deleteStoredTestPack,
  getStoredTestPack,
  writeStoredTestPack,
} from "@/lib/test-factory/content-store.server";
import { isTestStudioEnabled } from "@/lib/test-factory/studio";
import type { TestPack } from "@/lib/test-factory/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ testSlug: string }>;
}

function disabledResponse() {
  return Response.json({ error: "Test Pack Studio is disabled." }, { status: 404 });
}

export async function GET(_request: Request, context: Context) {
  if (!isTestStudioEnabled()) return disabledResponse();
  const { testSlug } = await context.params;
  const record = getStoredTestPack(testSlug);
  if (!record) return Response.json({ error: "테스트팩을 찾을 수 없습니다." }, { status: 404 });
  return Response.json({
    pack: record.pack,
    issues: record.issues,
    distribution: record.distribution,
  });
}

export async function PUT(request: Request, context: Context) {
  if (!isTestStudioEnabled()) return disabledResponse();
  const { testSlug } = await context.params;
  try {
    const pack = (await request.json()) as TestPack;
    if (pack.slug !== testSlug) {
      return Response.json({ error: "편집 중에는 Slug를 변경할 수 없습니다. 복제 기능을 사용해 주세요." }, { status: 400 });
    }
    const record = writeStoredTestPack(pack);
    return Response.json({
      pack: record.pack,
      issues: record.issues,
      distribution: record.distribution,
    });
  } catch (error) {
    const typed = error as Error & { issues?: unknown };
    return Response.json(
      {
        error: typed.message || "저장에 실패했습니다.",
        issues: typed.issues,
      },
      { status: 400 },
    );
  }
}

export async function DELETE(_request: Request, context: Context) {
  if (!isTestStudioEnabled()) return disabledResponse();
  const { testSlug } = await context.params;
  try {
    deleteStoredTestPack(testSlug);
    return new Response(null, { status: 204 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "삭제에 실패했습니다." },
      { status: 400 },
    );
  }
}
