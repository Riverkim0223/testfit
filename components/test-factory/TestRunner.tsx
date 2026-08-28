"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { encodeResultToken } from "@/lib/test-factory/token";
import type { TestPack } from "@/lib/test-factory/types";
import styles from "./TestRunner.module.css";

interface StoredProgress {
  currentStep: number;
  answers: number[];
  preAnswers: number[];
}

export function TestRunner({ pack }: { pack: TestPack }) {
  const router = useRouter();
  const totalSteps = pack.preQuestions.length + pack.questions.length;
  const storageKey = `test-factory:${pack.slug}:v${pack.version}`;
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>(
    () => Array(pack.questions.length).fill(-1) as number[],
  );
  const [preAnswers, setPreAnswers] = useState<number[]>(
    () => Array(pack.preQuestions.length).fill(-1) as number[],
  );
  const [hydrated, setHydrated] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as StoredProgress;
        if (
          Array.isArray(parsed.answers) &&
          parsed.answers.length === pack.questions.length &&
          Array.isArray(parsed.preAnswers) &&
          parsed.preAnswers.length === pack.preQuestions.length
        ) {
          setAnswers(parsed.answers);
          setPreAnswers(parsed.preAnswers);
          setCurrentStep(Math.min(Math.max(0, parsed.currentStep), totalSteps - 1));
        }
      }
    } catch {
      // Ignore malformed local progress and start fresh.
    } finally {
      setHydrated(true);
    }
  }, [pack.preQuestions.length, pack.questions.length, storageKey, totalSteps]);

  useEffect(() => {
    if (!hydrated) return;
    const progress: StoredProgress = { currentStep, answers, preAnswers };
    window.localStorage.setItem(storageKey, JSON.stringify(progress));
  }, [answers, currentStep, hydrated, preAnswers, storageKey]);

  const isPreQuestion = currentStep < pack.preQuestions.length;
  const questionIndex = currentStep - pack.preQuestions.length;
  const preQuestion = isPreQuestion ? pack.preQuestions[currentStep] : undefined;
  const question = !isPreQuestion ? pack.questions[questionIndex] : undefined;
  const selectedIndex = isPreQuestion
    ? preAnswers[currentStep] ?? -1
    : answers[questionIndex] ?? -1;

  const progress = useMemo(
    () => Math.round(((currentStep + 1) / totalSteps) * 100),
    [currentStep, totalSteps],
  );

  const finish = (nextAnswers: number[], nextPreAnswers: number[]) => {
    const token = encodeResultToken({
      version: pack.version,
      answers: nextAnswers,
      preAnswers: nextPreAnswers,
    });
    window.localStorage.removeItem(storageKey);
    router.push(`/tests/${pack.slug}/result/${token}`);
  };

  const selectOption = (optionIndex: number) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    let nextAnswers = answers;
    let nextPreAnswers = preAnswers;

    if (isPreQuestion) {
      nextPreAnswers = [...preAnswers];
      nextPreAnswers[currentStep] = optionIndex;
      setPreAnswers(nextPreAnswers);
    } else {
      nextAnswers = [...answers];
      nextAnswers[questionIndex] = optionIndex;
      setAnswers(nextAnswers);
    }

    window.setTimeout(() => {
      if (currentStep === totalSteps - 1) {
        finish(nextAnswers, nextPreAnswers);
      } else {
        setCurrentStep((step) => step + 1);
        setIsTransitioning(false);
      }
    }, 160);
  };

  const reset = () => {
    setCurrentStep(0);
    setAnswers(Array(pack.questions.length).fill(-1) as number[]);
    setPreAnswers(Array(pack.preQuestions.length).fill(-1) as number[]);
    window.localStorage.removeItem(storageKey);
    setIsTransitioning(false);
  };

  if (!hydrated) {
    return (
      <main className={styles.page} style={{ "--test-primary": pack.theme.primary } as CSSProperties}>
        <div className={styles.loading}>테스트를 준비하고 있어요…</div>
      </main>
    );
  }

  const optionList = isPreQuestion ? preQuestion?.choices ?? [] : question?.options ?? [];
  const title = isPreQuestion ? preQuestion?.title : question?.text;
  const description = isPreQuestion ? preQuestion?.description : undefined;
  const eyebrow = isPreQuestion ? preQuestion?.eyebrow ?? "시작 설정" : question?.eyebrow ?? "취향 질문";

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
      <header className={styles.topbar}>
        <Link href={`/tests/${pack.slug}`} aria-label={`${pack.title} 소개로 돌아가기`}>
          <span>{pack.theme.emoji}</span>
          {pack.title}
        </Link>
        <button type="button" onClick={reset}>처음부터</button>
      </header>

      <section className={styles.runner}>
        <div className={styles.progressRow}>
          <span>{currentStep + 1} / {totalSteps}</span>
          <strong>{progress}%</strong>
        </div>
        <div className={styles.progressTrack} aria-hidden="true">
          <span style={{ width: `${progress}%` }} />
        </div>

        <div className={styles.questionBlock}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h1>{title}</h1>
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>

        <div className={styles.options} data-count={optionList.length}>
          {optionList.map((option, optionIndex) => (
            <button
              key={option.id}
              type="button"
              className={styles.option}
              data-selected={selectedIndex === optionIndex}
              onClick={() => selectOption(optionIndex)}
              disabled={isTransitioning}
            >
              <span className={styles.optionIndex}>{String.fromCharCode(65 + optionIndex)}</span>
              <span>
                <strong>{option.label}</strong>
                {option.description ? <small>{option.description}</small> : null}
              </span>
            </button>
          ))}
        </div>

        <div className={styles.navigation}>
          <button
            type="button"
            onClick={() => setCurrentStep((step) => Math.max(0, step - 1))}
            disabled={currentStep === 0 || isTransitioning}
          >
            이전 질문
          </button>
          <p>선택하면 다음 질문으로 자동 이동해요.</p>
        </div>
      </section>
    </main>
  );
}
