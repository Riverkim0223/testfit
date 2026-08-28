import type { CSSProperties } from "react";
import Link from "next/link";
import { listActiveTestPacks } from "@/lib/test-factory/registry";
import styles from "./page.module.css";

export default function HomePage() {
  const tests = listActiveTestPacks();
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.topline}><span>TEST FACTORY</span><span>{tests.length} TESTS AVAILABLE</span></div>
        <p className={styles.emoji}>🧪</p>
        <h1>오늘은 어떤<br />테스트를 해볼까요?</h1>
        <p>질문에 답하면 나와 닮은 유형과 취향에 맞는 추천이 나와요. 결과는 링크나 이미지로 바로 공유할 수 있어요.</p>
      </section>

      <section className={styles.catalog} aria-label="테스트 목록">
        <div className={styles.sectionHeading}>
          <p>CHOOSE A TEST</p>
          <h2>지금 바로 해볼 수 있는 테스트</h2>
        </div>
        <div className={styles.grid}>
          {tests.map((pack, index) => (
            <Link
              key={pack.id}
              href={`/tests/${pack.slug}`}
              className={styles.card}
              style={{ "--card-primary": pack.theme.primary, "--card-secondary": pack.theme.secondary } as CSSProperties}
            >
              <div className={styles.cardTop}><span>{String(index + 1).padStart(2, "0")}</span><strong>{pack.category}</strong></div>
              <div className={styles.cardEmoji}>{pack.theme.emoji}</div>
              <h3>{pack.shortTitle}</h3>
              <p>{pack.description}</p>
              <div className={styles.cardMeta}><span>{pack.durationText}</span><span>{pack.questions.length}문항</span></div>
              <div className={styles.cardCta}>테스트 시작하기 <span>→</span></div>
            </Link>
          ))}
          <article className={styles.comingSoon}>
            <span>COMING SOON</span>
            <div>🐾</div>
            <h3>동물상 테스트</h3>
            <p>같은 엔진에 질문·결과 데이터만 추가해 새로운 테스트를 계속 만들 수 있어요.</p>
          </article>
        </div>
      </section>

      <section className={styles.factoryNote}>
        <div><p>ONE ENGINE, MANY TESTS</p><h2>공통 엔진으로 다양한 테스트를 생산하는 구조</h2></div>
        <div className={styles.formula}><span>질문 데이터</span><b>+</b><span>결과 유형</span><b>+</b><span>테마·추천</span><b>=</b><strong>새 테스트</strong></div>
      </section>
    </main>
  );
}
