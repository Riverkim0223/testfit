import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TestStructuredData } from "@/components/test-factory/TestStructuredData";
import { getTestPack, listActiveTestPacks } from "@/lib/test-factory/registry";
import styles from "./page.module.css";

interface Props { params: Promise<{ testSlug: string }> }

export function generateStaticParams() {
  return listActiveTestPacks().map((pack) => ({ testSlug: pack.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { testSlug } = await params;
  const pack = getTestPack(testSlug);
  if (!pack) return { title: "테스트를 찾을 수 없어요", robots: { index: false, follow: false } };
  return {
    title: pack.subtitle,
    description: pack.description,
    alternates: { canonical: `/tests/${pack.slug}` },
    robots: { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "ko_KR",
      title: `${pack.title} | ${pack.subtitle}`,
      description: pack.description,
      url: `/tests/${pack.slug}`,
    },
    twitter: { card: "summary_large_image", title: `${pack.title} | ${pack.subtitle}`, description: pack.description },
  };
}

export default async function TestLandingPage({ params }: Props) {
  const { testSlug } = await params;
  const pack = getTestPack(testSlug);
  if (!pack || pack.status !== "active") notFound();

  return (
    <main
      className={styles.page}
      style={
        {
          "--test-primary": pack.theme.primary,
          "--test-secondary": pack.theme.secondary,
          "--test-accent": pack.theme.accent,
          "--test-bg": pack.theme.background,
          "--test-text": pack.theme.text,
        } as CSSProperties
      }
    >
      <TestStructuredData pack={pack} />
      <nav className={styles.nav}>
        <Link href="/">TEST FACTORY</Link>
        <span>{pack.category}</span>
      </nav>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>{pack.landing.eyebrow}</p>
        <div className={styles.emoji}>{pack.theme.emoji}</div>
        <h1>{pack.subtitle}</h1>
        <p className={styles.description}>{pack.description}</p>
        <div className={styles.meta}>
          <span>{pack.durationText}</span>
          <span>로그인 없이 바로</span>
          <span>결과 이미지 저장</span>
        </div>
        <Link href={`/tests/${pack.slug}/play`} className={styles.cta}>
          {pack.landing.ctaLabel}
        </Link>
        {pack.landing.notice ? <p className={styles.notice}>{pack.landing.notice}</p> : null}
      </section>

      <section className={styles.highlights}>
        {pack.landing.highlights.map((item, index) => (
          <article key={item.label}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{item.value}</strong>
            <p>{item.label}</p>
          </article>
        ))}
      </section>

      <section className={styles.howItWorks}>
        <div>
          <p>HOW IT WORKS</p>
          <h2>질문에 답하면 결과와 추천이 바로 나와요</h2>
        </div>
        <ol>
          <li><strong>01</strong><span>가볍게 취향 질문 선택</span></li>
          <li><strong>02</strong><span>성향 점수와 가장 가까운 유형 계산</span></li>
          <li><strong>03</strong><span>결과 공유·피드·스토리 이미지 저장</span></li>
        </ol>
      </section>
    </main>
  );
}
