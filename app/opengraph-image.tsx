import { ImageResponse } from "next/og";

export const alt = "Test Factory - 오늘은 어떤 테스트를 해볼까요?";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: 62, color: "#fff", backgroundImage: "radial-gradient(circle at 12% 10%, rgba(255,255,255,.32), transparent 29%), linear-gradient(145deg, #292448, #6D5DFB 55%, #FF6FAE)", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 23, fontWeight: 900, letterSpacing: ".15em" }}><span>TEST FACTORY</span><span>QUESTION · RESULT · SHARE</span></div>
      <div style={{ display: "flex", alignItems: "center", gap: 38 }}>
        <div style={{ display: "flex", fontSize: 108 }}>🧪</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 78, lineHeight: 1.03, fontWeight: 900, letterSpacing: "-.06em" }}>오늘은 어떤 테스트를 해볼까요?</div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 29, fontWeight: 700, opacity: .94 }}>릴스핏부터 과일상까지, 가볍고 공유하기 좋은 취향 테스트</div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 21, fontWeight: 750 }}><span>로그인 없이 바로</span><span>test factory</span></div>
    </div>,
    size,
  );
}
