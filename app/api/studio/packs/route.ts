import {
  cloneStoredTestPack,
  createBlankTestPack,
  listStoredTestPacks,
} from "@/lib/test-factory/content-store.server";
import { isTestStudioEnabled } from "@/lib/test-factory/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function disabledResponse() {
  return Response.json({ error: "Test Pack Studio is disabled." }, { status: 404 });
}

export async function GET() {
  if (!isTestStudioEnabled()) return disabledResponse();
  const records = listStoredTestPacks().map((record) => ({
    pack: record.pack,
    issues: record.issues,
    distribution: record.distribution,
  }));
  return Response.json({ records });
}

export async function POST(request: Request) {
  if (!isTestStudioEnabled()) return disabledResponse();
  try {
    const body = (await request.json()) as {
      mode?: "blank" | "clone";
      slug?: string;
      title?: string;
      sourceSlug?: string;
    };
    const slug = body.slug?.trim() ?? "";
    const title = body.title?.trim() ?? "";
    if (!slug || !title) {
      return Response.json({ error: "Slug와 테스트 이름을 입력해 주세요." }, { status: 400 });
    }
    const record =
      body.mode === "clone" && body.sourceSlug
        ? cloneStoredTestPack(body.sourceSlug, slug, title)
        : createBlankTestPack(slug, title);
    return Response.json({
      pack: record.pack,
      issues: record.issues,
      distribution: record.distribution,
    }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "테스트팩을 만들지 못했습니다." },
      { status: 400 },
    );
  }
}
