import { ImageResponse } from "next/og";
import { getTestPack } from "@/lib/test-factory/registry";

export const alt = "Test Factory 테스트 소개 이미지";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function LandingOpenGraphImage({ params }: { params: Promise<{ testSlug: string }> }) {
  const { testSlug } = await params;
  const pack = getTestPack(testSlug);
  if (!pack) return new Response("Test not found", { status: 404 });

  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 62, color: "#fff", backgroundImage: `radial-gradient(circle at 12% 10%, rgba(255,255,255,.36), transparent 29%), linear-gradient(145deg, ${pack.theme.primary}, ${pack.theme.secondary})`, fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 23, fontWeight: 900, letterSpacing: ".14em" }}>
        <span>TEST FACTORY</span><span>{pack.landing.eyebrow}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 38 }}>
        <div style={{ display: "flex", fontSize: 110 }}>{pack.theme.emoji}</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", maxWidth: 850, fontSize: 70, lineHeight: 1.06, fontWeight: 900, letterSpacing: "-.055em" }}>{pack.subtitle}</div>
          <div style={{ display: "flex", maxWidth: 850, marginTop: 24, fontSize: 27, lineHeight: 1.45, fontWeight: 700, opacity: .94 }}>{pack.description}</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, fontWeight: 750 }}>
        <span>{pack.durationText} · 로그인 없이 바로</span><span>{pack.title}</span>
      </div>
    </div>,
    size,
  );
}
