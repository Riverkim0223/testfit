import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import type { PublicTestResult } from "@/lib/test-factory/types";
import { buildResultSharePayload } from "@/lib/test-factory/share";
import { RecommendationCard } from "./RecommendationCard";
import { ResultShareActions } from "./ResultShareActions";
import styles from "./TestResultPage.module.css";

export function TestResultPage({ result }: { result: PublicTestResult }) {
  const share = buildResultSharePayload(result);
  const illustrationVariantLabel =
    result.resultVariant === "female"
      ? "여성 버전"
      : result.resultVariant === "male"
        ? "남성 버전"
        : "CHARACTER";

  return (
    <main
      className={styles.page}
      style={
        {
          "--test-primary": result.theme.primary,
          "--test-secondary": result.theme.secondary,
          "--test-accent": result.theme.accent,
          "--test-bg": result.theme.background,
          "--test-text": result.theme.text,
        } as CSSProperties
      }
    >
      <nav className={styles.nav}>
        <Link href="/">TEST FACTORY</Link>
        <Link href={`/tests/${result.testSlug}`}>테스트 다시 하기</Link>
      </nav>

      <section className={styles.hero}>
        <div className={styles.fitPill}>{Math.round(result.fitScore)}% MATCH</div>

        <div className={styles.heroGrid}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{result.testTitle.toUpperCase()} RESULT</p>
            <div className={styles.titleRow}>
              <h1>{result.profileTitle}</h1>
              {!result.profileIllustration ? <span>{result.profileEmoji}</span> : null}
            </div>
            <p className={styles.subtitle}>{result.profileSubtitle}</p>
            <p className={styles.description}>{result.profileDescription}</p>
            <ul className={styles.strengths}>
              {result.strengths.map((strength) => (
                <li key={strength}>{strength}</li>
              ))}
            </ul>
            {result.secondaryProfile ? (
              <div className={styles.secondaryProfile}>
                숨은 성향 · {result.secondaryProfile.title} {result.secondaryProfile.emoji} 한 스푼
              </div>
            ) : null}
          </div>

          <div className={styles.profileVisual}>
            {result.profileIllustration ? (
              <div className={styles.profileImageFrame}>
                <Image
                  src={result.profileIllustration.src}
                  alt={result.profileIllustration.alt}
                  fill
                  priority
                  sizes="(max-width: 760px) 82vw, 320px"
                  style={{
                    objectFit: "contain",
                    objectPosition: result.profileIllustration.objectPosition ?? "center",
                  }}
                />
              </div>
            ) : (
              <div className={styles.profileEmojiFallback} aria-hidden="true">
                {result.profileEmoji}
              </div>
            )}
            <div className={styles.visualLabel}>{result.profileTitle} · {illustrationVariantLabel}</div>
          </div>
        </div>
      </section>

      <section className={styles.axisCard} aria-label="결과 성향 점수">
        {result.axisScores.map((axis) => (
          <AxisBar key={axis.id} {...axis} />
        ))}
      </section>

      <div className={styles.recommendations}>
        {result.recommendations.map((recommendation) => (
          <RecommendationCard key={recommendation.slotId} recommendation={recommendation} />
        ))}
      </div>

      <ResultShareActions
        resultId={result.id}
        profileId={result.profileId}
        title={share.title}
        text={share.text}
        url={share.url}
        feedImageUrl={share.imageUrl}
        storyImageUrl={share.storyImageUrl}
        fileName={share.fileName}
      />

      <section className={styles.nextActions}>
        <Link href={`/tests/${result.testSlug}/play`}>같은 테스트 다시 하기</Link>
        <Link href="/">다른 테스트 둘러보기</Link>
      </section>
    </main>
  );
}

function AxisBar(props: {
  label: string;
  lowLabel: string;
  highLabel: string;
  value: number;
}) {
  return (
    <div className={styles.axisItem}>
      <div className={styles.axisHeading}>
        <span>{props.label}</span>
        <strong>{Math.round(props.value)}</strong>
      </div>
      <div className={styles.axisTrack}>
        <span style={{ width: `${Math.max(3, Math.min(100, props.value))}%` }} />
      </div>
      <div className={styles.axisLabels}>
        <span>{props.lowLabel}</span>
        <span>{props.highLabel}</span>
      </div>
    </div>
  );
}
