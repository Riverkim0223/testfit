import { writeProfileImage } from "@/lib/test-factory/content-store.server";
import { isTestStudioEnabled } from "@/lib/test-factory/studio";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Context {
  params: Promise<{ testSlug: string }>;
}

export async function POST(request: Request, context: Context) {
  if (!isTestStudioEnabled()) {
    return Response.json({ error: "Test Pack Studio is disabled." }, { status: 404 });
  }
  const { testSlug } = await context.params;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const profileId = String(formData.get("profileId") ?? "");
    const variant = String(formData.get("variant") ?? "default");
    if (!(file instanceof File)) {
      return Response.json({ error: "이미지 파일을 선택해 주세요." }, { status: 400 });
    }
    if (file.type !== "image/webp") {
      return Response.json({ error: "Studio가 변환한 WebP 파일만 저장할 수 있습니다." }, { status: 400 });
    }
    if (file.size > 6 * 1024 * 1024) {
      return Response.json({ error: "이미지는 6MB 이하여야 합니다." }, { status: 400 });
    }
    const src = writeProfileImage({
      testSlug,
      profileId,
      variant,
      bytes: new Uint8Array(await file.arrayBuffer()),
    });
    return Response.json({ src });
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "이미지 저장에 실패했습니다." },
      { status: 400 },
    );
  }
}
