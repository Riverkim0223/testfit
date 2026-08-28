import Link from "next/link";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f7f7fb" }}>
      <section style={{ textAlign: "center", maxWidth: 520 }}>
        <p style={{ fontSize: 13, fontWeight: 900, color: "#6d5dfb", letterSpacing: ".14em" }}>404 · NOT FOUND</p>
        <h1 style={{ margin: "14px 0 0", fontSize: 42, letterSpacing: "-.055em" }}>테스트나 결과를 찾을 수 없어요.</h1>
        <p style={{ color: "#687385", lineHeight: 1.65 }}>링크가 잘렸거나 테스트 버전이 변경됐을 수 있어요.</p>
        <Link href="/" style={{ display: "inline-flex", marginTop: 16, padding: "14px 18px", borderRadius: 14, color: "#fff", background: "#6d5dfb", fontWeight: 900, textDecoration: "none" }}>테스트 목록으로 돌아가기</Link>
      </section>
    </main>
  );
}
