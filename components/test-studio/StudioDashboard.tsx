"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { TestPack } from "@/lib/test-factory/types";
import type {
  TestPackDistribution,
  TestPackValidationIssue,
} from "@/lib/test-factory/validation";
import styles from "./StudioDashboard.module.css";

interface StudioRecord {
  pack: TestPack;
  issues: TestPackValidationIssue[];
  distribution: TestPackDistribution;
}

export function StudioDashboard({ initialRecords }: { initialRecords: StudioRecord[] }) {
  const router = useRouter();
  const [records] = useState(initialRecords);
  const [mode, setMode] = useState<"blank" | "clone">("clone");
  const [sourceSlug, setSourceSlug] = useState(initialRecords[0]?.pack.slug ?? "");
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  const totals = useMemo(() => ({
    all: records.length,
    active: records.filter((record) => record.pack.status === "active").length,
    draft: records.filter((record) => record.pack.status === "draft").length,
  }), [records]);

  const create = async () => {
    if (!slug.trim() || !title.trim()) {
      setMessage("Slug와 테스트 이름을 입력해 주세요.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/studio/packs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, sourceSlug, slug: slug.trim(), title: title.trim() }),
      });
      const data = await response.json() as { error?: string; pack?: TestPack };
      if (!response.ok || !data.pack) throw new Error(data.error || "테스트를 만들지 못했습니다.");
      router.push(`/studio/${data.pack.slug}`);
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "테스트를 만들지 못했습니다.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <p>LOCAL TEST PACK STUDIO</p>
          <h1>코드 수정 없이<br />테스트팩을 만들어요.</h1>
          <span>로컬에서 저장한 JSON과 이미지를 Git에 올리면 Vercel이 자동 배포해요.</span>
        </div>
        <Link href="/">서비스 화면 보기 ↗</Link>
      </header>

      <section className={styles.stats} aria-label="테스트팩 현황">
        <article><strong>{totals.all}</strong><span>전체 테스트팩</span></article>
        <article><strong>{totals.active}</strong><span>공개 중</span></article>
        <article><strong>{totals.draft}</strong><span>제작 중</span></article>
      </section>

      <section className={styles.createSection}>
        <div className={styles.sectionTitle}>
          <p>CREATE</p>
          <h2>새 테스트 만들기</h2>
        </div>
        <div className={styles.createPanel}>
          <div className={styles.modeTabs}>
            <button type="button" data-active={mode === "clone"} onClick={() => setMode("clone")}>기존 테스트 복제</button>
            <button type="button" data-active={mode === "blank"} onClick={() => setMode("blank")}>빈 템플릿</button>
          </div>
          {mode === "clone" ? (
            <label>
              <span>복제할 테스트</span>
              <select value={sourceSlug} onChange={(event) => setSourceSlug(event.target.value)}>
                {records.map((record) => (
                  <option key={record.pack.slug} value={record.pack.slug}>{record.pack.title} ({record.pack.slug})</option>
                ))}
              </select>
            </label>
          ) : null}
          <div className={styles.createGrid}>
            <label><span>새 테스트 이름</span><input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="예: 동물상 테스트" /></label>
            <label><span>Slug</span><input value={slug} onChange={(event) => setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))} placeholder="animal-face" /></label>
          </div>
          <button className={styles.createButton} type="button" onClick={create} disabled={busy}>{busy ? "생성 중…" : "테스트팩 만들기"}</button>
          {message ? <p className={styles.message}>{message}</p> : null}
        </div>
      </section>

      <section className={styles.catalog}>
        <div className={styles.sectionTitle}>
          <p>TEST PACKS</p>
          <h2>현재 프로젝트의 테스트</h2>
        </div>
        <div className={styles.grid}>
          {records.map((record) => {
            const errors = record.issues.filter((issue) => issue.severity === "error").length;
            const warnings = record.issues.filter((issue) => issue.severity === "warning").length;
            return (
              <article key={record.pack.slug} className={styles.card} style={{ "--studio-primary": record.pack.theme.primary } as React.CSSProperties}>
                <div className={styles.cardTop}>
                  <span data-status={record.pack.status}>{record.pack.status === "active" ? "공개" : "초안"}</span>
                  <strong>{record.pack.theme.emoji}</strong>
                </div>
                <p className={styles.slug}>/{record.pack.slug}</p>
                <h3>{record.pack.title}</h3>
                <p>{record.pack.description}</p>
                <div className={styles.meta}>
                  <span>{record.pack.questions.length}문항</span>
                  <span>{record.pack.profiles.length}유형</span>
                  <span>v{record.pack.version}</span>
                </div>
                <div className={styles.health}>
                  <span data-level={errors ? "error" : warnings ? "warning" : "ok"}>
                    {errors ? `오류 ${errors}` : warnings ? `확인 ${warnings}` : "검증 완료"}
                  </span>
                  <small>{record.distribution.mode === "exhaustive" ? "전수 검사" : "샘플 검사"}</small>
                </div>
                <div className={styles.actions}>
                  <Link href={`/studio/${record.pack.slug}`}>편집하기</Link>
                  {record.pack.status === "active" ? <Link href={`/tests/${record.pack.slug}`}>테스트 보기</Link> : <span>공개 전</span>}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <aside className={styles.localNotice}>
        <strong>로컬 전용 도구</strong>
        <p>Studio는 기본적으로 <code>npm run dev</code> 환경에서만 열려요. 저장 후 <code>git add . → commit → push</code>하면 운영 사이트에 반영됩니다.</p>
      </aside>
    </main>
  );
}
