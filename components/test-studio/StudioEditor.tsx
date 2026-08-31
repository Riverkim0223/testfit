"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { useMemo, useState } from "react";
import type {
  PreQuestionDefinition,
  ProfileRecommendation,
  ResultProfileDefinition,
  TestPack,
  TestQuestionDefinition,
} from "@/lib/test-factory/types";
import {
  analyzeTestPackDistribution,
  distributionWarnings,
  validateTestPack,
  type TestPackDistribution,
  type TestPackValidationIssue,
} from "@/lib/test-factory/validation";
import styles from "./StudioEditor.module.css";

type SectionId = "basic" | "axes" | "pre" | "questions" | "profiles" | "theme" | "review";

const sections: Array<{ id: SectionId; label: string; hint: string }> = [
  { id: "basic", label: "기본 정보", hint: "이름·상태·랜딩" },
  { id: "axes", label: "측정 기준", hint: "축·태그" },
  { id: "pre", label: "사전 선택", hint: "성별·조건" },
  { id: "questions", label: "질문", hint: "선택지·점수" },
  { id: "profiles", label: "결과 유형", hint: "문구·이미지·추천" },
  { id: "theme", label: "디자인", hint: "컬러·공유 톤" },
  { id: "review", label: "검수·저장", hint: "분포·오류" },
];

const clonePack = (pack: TestPack) => structuredClone(pack);
const toId = (value: string) => value.toUpperCase().replace(/[^A-Z0-9_]/g, "_");
const makeId = (prefix: string) => `${prefix}-${Date.now().toString(36)}`;
const numberValue = (value: string, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

async function convertToWebp(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const size = 1200;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("이미지 변환을 시작할 수 없습니다.");
  context.fillStyle = "#fffdf9";
  context.fillRect(0, 0, size, size);
  const scale = Math.min(size / bitmap.width, size / bitmap.height);
  const width = bitmap.width * scale;
  const height = bitmap.height * scale;
  context.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error("WebP 변환에 실패했습니다.")), "image/webp", .88);
  });
  return new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, { type: "image/webp" });
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return <label className={styles.field}><span>{label}{hint ? <small>{hint}</small> : null}</span>{children}</label>;
}

function CardHeader({ index, title, onRemove, onUp, onDown }: {
  index: number;
  title: string;
  onRemove?: () => void;
  onUp?: () => void;
  onDown?: () => void;
}) {
  return (
    <div className={styles.cardHeader}>
      <div><span>{String(index + 1).padStart(2, "0")}</span><strong>{title}</strong></div>
      <div className={styles.smallActions}>
        {onUp ? <button type="button" onClick={onUp}>↑</button> : null}
        {onDown ? <button type="button" onClick={onDown}>↓</button> : null}
        {onRemove ? <button type="button" data-danger onClick={onRemove}>삭제</button> : null}
      </div>
    </div>
  );
}

export function StudioEditor({
  initialPack,
  initialIssues,
  initialDistribution,
}: {
  initialPack: TestPack;
  initialIssues: TestPackValidationIssue[];
  initialDistribution: TestPackDistribution;
}) {
  const [pack, setPack] = useState(() => clonePack(initialPack));
  const [section, setSection] = useState<SectionId>("basic");
  const [issues, setIssues] = useState(initialIssues);
  const [distribution, setDistribution] = useState(initialDistribution);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState("");

  const variants = useMemo(() => {
    const values = new Set<string>();
    pack.preQuestions.forEach((question) => question.choices.forEach((choice) => {
      if (choice.resultVariant) values.add(choice.resultVariant);
    }));
    return values.size ? [...values] : ["default"];
  }, [pack.preQuestions]);

  const update = (mutator: (draft: TestPack) => void) => {
    setPack((current) => {
      const draft = clonePack(current);
      mutator(draft);
      return draft;
    });
  };

  const refreshValidation = (target = pack) => {
    const base = validateTestPack(target);
    let nextDistribution = distribution;
    let nextIssues = base;
    if (!base.some((issue) => issue.severity === "error")) {
      nextDistribution = analyzeTestPackDistribution(target);
      nextIssues = [...base, ...distributionWarnings(nextDistribution)];
    }
    setIssues(nextIssues);
    setDistribution(nextDistribution);
    return nextIssues;
  };

  const save = async () => {
    const nextIssues = refreshValidation();
    if (nextIssues.some((issue) => issue.severity === "error")) {
      setMessage("오류를 먼저 수정해 주세요.");
      setSection("review");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const response = await fetch(`/api/studio/packs/${initialPack.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pack),
      });
      const data = await response.json() as {
        error?: string;
        pack?: TestPack;
        issues?: TestPackValidationIssue[];
        distribution?: TestPackDistribution;
      };
      if (!response.ok || !data.pack) throw new Error(data.error || "저장하지 못했습니다.");
      setPack(data.pack);
      setIssues(data.issues ?? []);
      if (data.distribution) setDistribution(data.distribution);
      setMessage("프로젝트의 pack.json에 저장했습니다.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "저장하지 못했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const downloadJson = () => {
    const blob = new Blob([`${JSON.stringify(pack, null, 2)}\n`], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${pack.slug}.pack.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const uploadImage = async (profileIndex: number, variant: string, file: File) => {
    const profile = pack.profiles[profileIndex];
    if (!profile) return;
    const key = `${profile.id}:${variant}`;
    setUploading(key);
    setMessage("");
    try {
      const webp = await convertToWebp(file);
      const formData = new FormData();
      formData.set("file", webp);
      formData.set("profileId", profile.id);
      formData.set("variant", variant);
      const response = await fetch(`/api/studio/packs/${pack.slug}/image`, { method: "POST", body: formData });
      const data = await response.json() as { src?: string; error?: string };
      if (!response.ok || !data.src) throw new Error(data.error || "이미지 저장에 실패했습니다.");
      update((draft) => {
        const target = draft.profiles[profileIndex]!;
        const illustration = { src: data.src!, alt: `${target.title} ${variant} 결과 일러스트`, objectPosition: "center" };
        if (variant === "default") {
          target.illustration = illustration;
        } else {
          target.illustrationVariants = { ...(target.illustrationVariants ?? {}), [variant]: illustration };
          if (!target.illustration || variant === "female") target.illustration = illustration;
        }
      });
      setMessage("이미지를 public 폴더에 저장했습니다. 검수 후 테스트팩도 저장해 주세요.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "이미지 저장에 실패했습니다.");
    } finally {
      setUploading("");
    }
  };

  const addAxis = () => {
    const id = `AXIS_${pack.axes.length + 1}`;
    update((draft) => {
      draft.axes.push({ id, label: "새 성향", lowLabel: "낮은 방향", highLabel: "높은 방향" });
      draft.profiles.forEach((profile) => { profile.axisTargets[id] = 50; });
    });
  };

  const removeAxis = (axisIndex: number) => update((draft) => {
    const axis = draft.axes[axisIndex];
    if (!axis || draft.axes.length <= 1) return;
    draft.axes.splice(axisIndex, 1);
    draft.questions.forEach((question) => question.options.forEach((option) => { delete option.axisScores?.[axis.id]; }));
    draft.profiles.forEach((profile) => { delete profile.axisTargets[axis.id]; });
  });

  const addTag = () => update((draft) => {
    draft.tags.push({ id: `TAG_${draft.tags.length + 1}`, label: "새 태그" });
  });

  const removeTag = (tagIndex: number) => update((draft) => {
    const tag = draft.tags[tagIndex];
    if (!tag) return;
    draft.tags.splice(tagIndex, 1);
    draft.questions.forEach((question) => question.options.forEach((option) => { delete option.tagScores?.[tag.id]; }));
    draft.profiles.forEach((profile) => { delete profile.tagTargets?.[tag.id]; });
  });

  const addPreQuestion = () => update((draft) => {
    const id = makeId("pre");
    draft.preQuestions.push({ id, eyebrow: "시작 설정", title: "새 사전 질문", choices: [
      { id: `${id}-a`, label: "첫 번째 선택" },
      { id: `${id}-b`, label: "두 번째 선택" },
    ] });
  });

  const addQuestion = () => update((draft) => {
    const id = makeId("question");
    draft.questions.push({ id, order: draft.questions.length + 1, eyebrow: "새 질문", text: "질문을 입력해 주세요.", options: [
      { id: `${id}-a`, label: "첫 번째 선택지", axisScores: {} },
      { id: `${id}-b`, label: "두 번째 선택지", axisScores: {} },
    ] });
  });

  const addProfile = () => update((draft) => {
    const id = `type-${draft.profiles.length + 1}`;
    draft.profiles.push({
      id,
      title: "새 결과 유형",
      emoji: "✨",
      subtitle: "한 줄 설명을 입력해 주세요.",
      description: "상세 설명을 입력해 주세요.",
      axisTargets: Object.fromEntries(draft.axes.map((axis) => [axis.id, 50])),
      strengths: ["매력 포인트"],
      shareText: "나의 새로운 결과!",
      recommendations: [],
    });
  });

  const moveQuestion = (from: number, to: number) => update((draft) => {
    if (to < 0 || to >= draft.questions.length) return;
    const [item] = draft.questions.splice(from, 1);
    if (!item) return;
    draft.questions.splice(to, 0, item);
    draft.questions.forEach((question, index) => { question.order = index + 1; });
  });

  const errorCount = issues.filter((issue) => issue.severity === "error").length;
  const warningCount = issues.filter((issue) => issue.severity === "warning").length;

  return (
    <main className={styles.page} style={{ "--studio-primary": pack.theme.primary } as CSSProperties}>
      <header className={styles.header}>
        <div>
          <Link href="/studio">← Studio 목록</Link>
          <p>/{pack.slug} · VERSION {pack.version}</p>
          <h1>{pack.title}</h1>
        </div>
        <div className={styles.headerActions}>
          {pack.status === "active" ? <Link href={`/tests/${pack.slug}`}>공개 화면 ↗</Link> : null}
          <button type="button" onClick={downloadJson}>JSON 받기</button>
          <button type="button" data-primary onClick={save} disabled={saving}>{saving ? "저장 중…" : "프로젝트에 저장"}</button>
        </div>
      </header>

      <div className={styles.workspace}>
        <aside className={styles.sidebar}>
          <nav>
            {sections.map((item, index) => (
              <button key={item.id} type="button" data-active={section === item.id} onClick={() => setSection(item.id)}>
                <span>{String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong><small>{item.hint}</small>
              </button>
            ))}
          </nav>
          <div className={styles.sidebarHealth}>
            <strong>검수 상태</strong>
            <p data-level={errorCount ? "error" : warningCount ? "warning" : "ok"}>
              {errorCount ? `오류 ${errorCount}개` : warningCount ? `확인 ${warningCount}개` : "문제 없음"}
            </p>
          </div>
        </aside>

        <section className={styles.editor}>
          {section === "basic" ? (
            <>
              <SectionTitle eyebrow="BASIC" title="테스트의 기본 정보" description="메인 목록과 테스트 소개 화면에 표시되는 내용이에요." />
              <div className={styles.formGrid}>
                <Field label="테스트 이름"><input value={pack.title} onChange={(event) => update((draft) => { draft.title = event.target.value; })} /></Field>
                <Field label="짧은 이름"><input value={pack.shortTitle} onChange={(event) => update((draft) => { draft.shortTitle = event.target.value; })} /></Field>
                <Field label="Slug" hint="편집 중 변경 불가"><input value={pack.slug} disabled /></Field>
                <Field label="버전"><input type="number" min="1" value={pack.version} onChange={(event) => update((draft) => { draft.version = Math.max(1, numberValue(event.target.value, 1)); })} /></Field>
                <Field label="상태"><select value={pack.status} onChange={(event) => update((draft) => { draft.status = event.target.value as TestPack["status"]; })}><option value="draft">초안</option><option value="active">공개</option></select></Field>
                <Field label="추천 방식"><select value={pack.recommendationMode ?? "profile"} onChange={(event) => update((draft) => { draft.recommendationMode = event.target.value as TestPack["recommendationMode"]; })}><option value="profile">결과 유형별 고정 추천</option><option value="reels-catalog">릴스 콘텐츠 점수 매칭</option></select></Field>
                <Field label="카테고리"><input value={pack.category} onChange={(event) => update((draft) => { draft.category = event.target.value; })} /></Field>
                <Field label="예상 소요 시간"><input value={pack.durationText} onChange={(event) => update((draft) => { draft.durationText = event.target.value; })} /></Field>
                <Field label="메인 버튼"><input value={pack.landing.ctaLabel} onChange={(event) => update((draft) => { draft.landing.ctaLabel = event.target.value; })} /></Field>
              </div>
              <Field label="메인 문구"><textarea rows={2} value={pack.subtitle} onChange={(event) => update((draft) => { draft.subtitle = event.target.value; })} /></Field>
              <Field label="설명"><textarea rows={4} value={pack.description} onChange={(event) => update((draft) => { draft.description = event.target.value; })} /></Field>
              <div className={styles.formGrid}>
                <Field label="랜딩 상단 문구"><input value={pack.landing.eyebrow} onChange={(event) => update((draft) => { draft.landing.eyebrow = event.target.value; })} /></Field>
                <Field label="안내 문구"><input value={pack.landing.notice ?? ""} onChange={(event) => update((draft) => { draft.landing.notice = event.target.value; })} /></Field>
              </div>
              <div className={styles.subsectionHeader}><div><strong>랜딩 하이라이트</strong><span>숫자·라벨 카드</span></div><button type="button" onClick={() => update((draft) => { draft.landing.highlights.push({ value: "1", label: "새 항목" }); })}>+ 추가</button></div>
              <div className={styles.compactGrid}>
                {pack.landing.highlights.map((item, index) => (
                  <div className={styles.compactCard} key={`${item.label}-${index}`}>
                    <input value={item.value} onChange={(event) => update((draft) => { draft.landing.highlights[index]!.value = event.target.value; })} />
                    <input value={item.label} onChange={(event) => update((draft) => { draft.landing.highlights[index]!.label = event.target.value; })} />
                    <button type="button" data-danger onClick={() => update((draft) => { draft.landing.highlights.splice(index, 1); })}>×</button>
                  </div>
                ))}
              </div>
            </>
          ) : null}

          {section === "axes" ? (
            <>
              <SectionTitle eyebrow="SCORING" title="측정 축과 스타일 태그" description="사용자와 결과 유형을 같은 점수 좌표에 놓기 위한 기준이에요." />
              <div className={styles.subsectionHeader}><div><strong>측정 축</strong><span>결과 그래프에 표시되는 핵심 기준</span></div><button type="button" onClick={addAxis}>+ 축 추가</button></div>
              <div className={styles.stack}>
                {pack.axes.map((axis, index) => (
                  <article className={styles.simpleCard} key={`${axis.id}-${index}`}>
                    <CardHeader index={index} title={axis.label || "새 측정 축"} onRemove={() => removeAxis(index)} />
                    <div className={styles.formGridFour}>
                      <Field label="ID"><input value={axis.id} onChange={(event) => {
                        const nextId = toId(event.target.value);
                        update((draft) => {
                          const oldId = draft.axes[index]!.id;
                          draft.axes[index]!.id = nextId;
                          draft.questions.forEach((question) => question.options.forEach((option) => {
                            if (option.axisScores && oldId in option.axisScores) {
                              option.axisScores[nextId] = option.axisScores[oldId]!;
                              delete option.axisScores[oldId];
                            }
                          }));
                          draft.profiles.forEach((profile) => {
                            profile.axisTargets[nextId] = profile.axisTargets[oldId] ?? 50;
                            delete profile.axisTargets[oldId];
                          });
                        });
                      }} /></Field>
                      <Field label="표시명"><input value={axis.label} onChange={(event) => update((draft) => { draft.axes[index]!.label = event.target.value; })} /></Field>
                      <Field label="낮은 방향"><input value={axis.lowLabel} onChange={(event) => update((draft) => { draft.axes[index]!.lowLabel = event.target.value; })} /></Field>
                      <Field label="높은 방향"><input value={axis.highLabel} onChange={(event) => update((draft) => { draft.axes[index]!.highLabel = event.target.value; })} /></Field>
                    </div>
                  </article>
                ))}
              </div>
              <div className={styles.subsectionHeader}><div><strong>스타일 태그</strong><span>유형을 더 세밀하게 나눌 때 사용</span></div><button type="button" onClick={addTag}>+ 태그 추가</button></div>
              {pack.tags.length ? (
                <div className={styles.compactGrid}>
                  {pack.tags.map((tag, index) => (
                    <div className={styles.compactCard} key={`${tag.id}-${index}`}>
                      <input value={tag.id} onChange={(event) => update((draft) => { draft.tags[index]!.id = toId(event.target.value); })} />
                      <input value={tag.label} onChange={(event) => update((draft) => { draft.tags[index]!.label = event.target.value; })} />
                      <button type="button" data-danger onClick={() => removeTag(index)}>×</button>
                    </div>
                  ))}
                </div>
              ) : <EmptyState>현재 테스트는 태그 없이 축 점수만 사용해요.</EmptyState>}
              <div className={styles.formGridThree}>
                <Field label="축 반영 비중"><input type="number" step="0.05" min="0" value={pack.scoring.axisWeight} onChange={(event) => update((draft) => { draft.scoring.axisWeight = numberValue(event.target.value); })} /></Field>
                <Field label="태그 반영 비중"><input type="number" step="0.05" min="0" value={pack.scoring.tagWeight} onChange={(event) => update((draft) => { draft.scoring.tagWeight = numberValue(event.target.value); })} /></Field>
                <Field label="보조 유형 표시 기준"><input type="number" min="0" value={pack.scoring.secondaryThreshold} onChange={(event) => update((draft) => { draft.scoring.secondaryThreshold = numberValue(event.target.value); })} /></Field>
              </div>
            </>
          ) : null}

          {section === "pre" ? (
            <>
              <SectionTitle eyebrow="PRE-CONDITIONS" title="테스트 시작 전 선택" description="성별 이미지, 난이도, 참여 인원처럼 점수 외 결과 조건을 설정해요." />
              <div className={styles.stack}>
                {pack.preQuestions.map((question, questionIndex) => (
                  <article className={styles.simpleCard} key={question.id}>
                    <CardHeader index={questionIndex} title={question.title} onRemove={() => update((draft) => { draft.preQuestions.splice(questionIndex, 1); })} />
                    <div className={styles.formGrid}>
                      <Field label="ID"><input value={question.id} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.id = event.target.value; })} /></Field>
                      <Field label="상단 문구"><input value={question.eyebrow ?? ""} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.eyebrow = event.target.value; })} /></Field>
                    </div>
                    <Field label="질문"><input value={question.title} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.title = event.target.value; })} /></Field>
                    <Field label="설명"><textarea rows={2} value={question.description ?? ""} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.description = event.target.value; })} /></Field>
                    <div className={styles.subsectionHeader}><div><strong>선택지</strong><span>resultVariant는 결과 이미지 버전과 연결돼요.</span></div><button type="button" onClick={() => update((draft) => {
                      const target = draft.preQuestions[questionIndex]!;
                      const id = `${target.id}-${target.choices.length + 1}`;
                      target.choices.push({ id, label: "새 선택지" });
                    })}>+ 선택지</button></div>
                    <div className={styles.stackSmall}>
                      {question.choices.map((choice, choiceIndex) => (
                        <div className={styles.choiceRow} key={choice.id}>
                          <input value={choice.id} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.choices[choiceIndex]!.id = event.target.value; })} placeholder="choice-id" />
                          <input value={choice.label} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.choices[choiceIndex]!.label = event.target.value; })} placeholder="표시 문구" />
                          <input value={choice.description ?? ""} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.choices[choiceIndex]!.description = event.target.value; })} placeholder="설명" />
                          <input value={choice.resultVariant ?? ""} onChange={(event) => update((draft) => { draft.preQuestions[questionIndex]!.choices[choiceIndex]!.resultVariant = event.target.value || undefined; })} placeholder="female / male" />
                          <button type="button" data-danger onClick={() => update((draft) => { draft.preQuestions[questionIndex]!.choices.splice(choiceIndex, 1); })}>×</button>
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <button className={styles.addLarge} type="button" onClick={addPreQuestion}>+ 사전 질문 추가</button>
            </>
          ) : null}

          {section === "questions" ? (
            <>
              <SectionTitle eyebrow="QUESTIONS" title={`질문 ${pack.questions.length}개`} description="각 선택지가 축과 태그에 얼마만큼 영향을 주는지 숫자로 연결해요." />
              <div className={styles.stack}>
                {pack.questions.map((question, questionIndex) => (
                  <article className={styles.questionCard} key={question.id}>
                    <CardHeader
                      index={questionIndex}
                      title={question.text}
                      onUp={questionIndex > 0 ? () => moveQuestion(questionIndex, questionIndex - 1) : undefined}
                      onDown={questionIndex < pack.questions.length - 1 ? () => moveQuestion(questionIndex, questionIndex + 1) : undefined}
                      onRemove={() => update((draft) => { draft.questions.splice(questionIndex, 1); draft.questions.forEach((item, index) => { item.order = index + 1; }); })}
                    />
                    <div className={styles.formGrid}>
                      <Field label="질문 ID"><input value={question.id} onChange={(event) => update((draft) => { draft.questions[questionIndex]!.id = event.target.value; })} /></Field>
                      <Field label="상단 문구"><input value={question.eyebrow ?? ""} onChange={(event) => update((draft) => { draft.questions[questionIndex]!.eyebrow = event.target.value; })} /></Field>
                    </div>
                    <Field label="질문 문구"><textarea rows={2} value={question.text} onChange={(event) => update((draft) => { draft.questions[questionIndex]!.text = event.target.value; })} /></Field>
                    <div className={styles.optionGrid}>
                      {question.options.map((option, optionIndex) => (
                        <div className={styles.optionEditor} key={option.id}>
                          <div className={styles.optionTop}><strong>선택지 {String.fromCharCode(65 + optionIndex)}</strong><button type="button" data-danger onClick={() => update((draft) => { draft.questions[questionIndex]!.options.splice(optionIndex, 1); })}>삭제</button></div>
                          <input value={option.id} onChange={(event) => update((draft) => { draft.questions[questionIndex]!.options[optionIndex]!.id = event.target.value; })} placeholder="option-id" />
                          <textarea rows={2} value={option.label} onChange={(event) => update((draft) => { draft.questions[questionIndex]!.options[optionIndex]!.label = event.target.value; })} placeholder="선택지 문구" />
                          <input value={option.description ?? ""} onChange={(event) => update((draft) => { draft.questions[questionIndex]!.options[optionIndex]!.description = event.target.value; })} placeholder="보조 설명 (선택)" />
                          <div className={styles.scoreGrid}>
                            {pack.axes.map((axis) => (
                              <label key={axis.id}><span>{axis.label}</span><input type="number" step="1" value={option.axisScores?.[axis.id] ?? 0} onChange={(event) => update((draft) => {
                                const target = draft.questions[questionIndex]!.options[optionIndex]!;
                                target.axisScores = { ...(target.axisScores ?? {}), [axis.id]: numberValue(event.target.value) };
                              })} /></label>
                            ))}
                            {pack.tags.map((tag) => (
                              <label key={tag.id}><span>{tag.label}</span><input type="number" step="1" value={option.tagScores?.[tag.id] ?? 0} onChange={(event) => update((draft) => {
                                const target = draft.questions[questionIndex]!.options[optionIndex]!;
                                target.tagScores = { ...(target.tagScores ?? {}), [tag.id]: numberValue(event.target.value) };
                              })} /></label>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className={styles.inlineAdd} type="button" onClick={() => update((draft) => {
                      const target = draft.questions[questionIndex]!;
                      target.options.push({ id: `${target.id}-${target.options.length + 1}`, label: "새 선택지", axisScores: {} });
                    })}>+ 선택지 추가</button>
                  </article>
                ))}
              </div>
              <button className={styles.addLarge} type="button" onClick={addQuestion}>+ 질문 추가</button>
            </>
          ) : null}

          {section === "profiles" ? (
            <>
              <SectionTitle eyebrow="RESULT PROFILES" title={`결과 유형 ${pack.profiles.length}개`} description="결과 문구와 점수 기준, 추천 카드, 성별 이미지를 한 번에 관리해요." />
              <div className={styles.stack}>
                {pack.profiles.map((profile, profileIndex) => (
                  <article className={styles.profileCard} key={profile.id}>
                    <CardHeader index={profileIndex} title={`${profile.emoji} ${profile.title}`} onRemove={() => update((draft) => { draft.profiles.splice(profileIndex, 1); })} />
                    <div className={styles.formGridThree}>
                      <Field label="프로필 ID"><input value={profile.id} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.id = event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""); })} /></Field>
                      <Field label="유형명"><input value={profile.title} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.title = event.target.value; })} /></Field>
                      <Field label="이모지"><input value={profile.emoji} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.emoji = event.target.value; })} /></Field>
                    </div>
                    <Field label="한 줄 설명"><input value={profile.subtitle} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.subtitle = event.target.value; })} /></Field>
                    <Field label="상세 설명"><textarea rows={4} value={profile.description} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.description = event.target.value; })} /></Field>
                    <div className={styles.formGrid}>
                      <Field label="매력 포인트" hint="한 줄에 하나"><textarea rows={4} value={profile.strengths.join("\n")} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.strengths = event.target.value.split("\n").map((value) => value.trim()).filter(Boolean); })} /></Field>
                      <Field label="공유 문구"><textarea rows={4} value={profile.shareText} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.shareText = event.target.value; })} /></Field>
                    </div>
                    <div className={styles.subsectionHeader}><div><strong>유형 기준 점수</strong><span>사용자 점수와 가장 가까운 결과가 선택돼요.</span></div></div>
                    <div className={styles.targetGrid}>
                      {pack.axes.map((axis) => (
                        <label key={axis.id}><span>{axis.label}<small>{profile.axisTargets[axis.id] ?? 50}</small></span><input type="range" min="0" max="100" value={profile.axisTargets[axis.id] ?? 50} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.axisTargets[axis.id] = numberValue(event.target.value, 50); })} /></label>
                      ))}
                    </div>
                    {pack.tags.length ? (
                      <div className={styles.targetGrid}>
                        {pack.tags.map((tag) => (
                          <label key={tag.id}><span>{tag.label}<small>{profile.tagTargets?.[tag.id]?.value ?? 50}</small></span><input type="range" min="0" max="100" value={profile.tagTargets?.[tag.id]?.value ?? 50} onChange={(event) => update((draft) => {
                            const target = draft.profiles[profileIndex]!;
                            target.tagTargets = { ...(target.tagTargets ?? {}), [tag.id]: { value: numberValue(event.target.value, 50), weight: target.tagTargets?.[tag.id]?.weight ?? 1 } };
                          })} /></label>
                        ))}
                      </div>
                    ) : null}
                    <div className={styles.subsectionHeader}><div><strong>결과 이미지</strong><span>업로드 시 1200×1200 WebP로 자동 변환하고 여백을 유지해요.</span></div></div>
                    <div className={styles.imageGrid}>
                      {variants.map((variant) => {
                        const illustration = variant === "default" ? profile.illustration : profile.illustrationVariants?.[variant];
                        const uploadKey = `${profile.id}:${variant}`;
                        return (
                          <div className={styles.imageCard} key={variant}>
                            <div className={styles.imagePreview}>
                              {illustration?.src ? <img src={illustration.src} alt={illustration.alt} /> : <span>{profile.emoji}</span>}
                            </div>
                            <strong>{variant === "default" ? "기본 이미지" : `${variant} 이미지`}</strong>
                            <small>{illustration?.src ?? "아직 업로드되지 않음"}</small>
                            <label className={styles.uploadButton}>{uploading === uploadKey ? "변환·저장 중…" : "이미지 선택"}<input type="file" accept="image/png,image/jpeg,image/webp" disabled={Boolean(uploading)} onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void uploadImage(profileIndex, variant, file);
                              event.currentTarget.value = "";
                            }} /></label>
                          </div>
                        );
                      })}
                    </div>
                    <div className={styles.subsectionHeader}><div><strong>추천 카드</strong><span>컬러·스타일·궁합처럼 결과 아래에 표시돼요.</span></div><button type="button" onClick={() => update((draft) => { draft.profiles[profileIndex]!.recommendations = [...(draft.profiles[profileIndex]!.recommendations ?? []), { slotId: "STYLE", kicker: "추천", title: "새 추천", description: "추천 설명", emoji: "✨" }]; })}>+ 추천 추가</button></div>
                    <div className={styles.recommendationGrid}>
                      {(profile.recommendations ?? []).map((recommendation, recommendationIndex) => (
                        <div className={styles.recommendationEditor} key={`${recommendation.slotId}-${recommendationIndex}`}>
                          <div><input value={recommendation.slotId} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.recommendations![recommendationIndex]!.slotId = event.target.value; })} placeholder="SLOT_ID" /><button type="button" data-danger onClick={() => update((draft) => { draft.profiles[profileIndex]!.recommendations!.splice(recommendationIndex, 1); })}>×</button></div>
                          <input value={recommendation.kicker} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.recommendations![recommendationIndex]!.kicker = event.target.value; })} placeholder="상단 문구" />
                          <div><input value={recommendation.emoji ?? ""} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.recommendations![recommendationIndex]!.emoji = event.target.value; })} placeholder="이모지" /><input value={recommendation.title} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.recommendations![recommendationIndex]!.title = event.target.value; })} placeholder="추천 제목" /></div>
                          <textarea rows={3} value={recommendation.description} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.recommendations![recommendationIndex]!.description = event.target.value; })} />
                          <input value={recommendation.value ?? ""} onChange={(event) => update((draft) => { draft.profiles[profileIndex]!.recommendations![recommendationIndex]!.value = event.target.value || undefined; })} placeholder="#FF0000 등 선택 값" />
                        </div>
                      ))}
                    </div>
                  </article>
                ))}
              </div>
              <button className={styles.addLarge} type="button" onClick={addProfile}>+ 결과 유형 추가</button>
            </>
          ) : null}

          {section === "theme" ? (
            <>
              <SectionTitle eyebrow="VISUAL SYSTEM" title="테스트 디자인 테마" description="공통 레이아웃은 유지하고 컬러와 이모지로 테스트의 분위기를 바꿔요." />
              <div className={styles.colorGrid}>
                {(["primary", "secondary", "accent", "surface", "background", "text", "muted"] as const).map((key) => (
                  <Field key={key} label={key}>
                    <div className={styles.colorField}><input type="color" value={pack.theme[key]} onChange={(event) => update((draft) => { draft.theme[key] = event.target.value; })} /><input value={pack.theme[key]} onChange={(event) => update((draft) => { draft.theme[key] = event.target.value; })} /></div>
                  </Field>
                ))}
                <Field label="대표 이모지"><input value={pack.theme.emoji} onChange={(event) => update((draft) => { draft.theme.emoji = event.target.value; })} /></Field>
              </div>
              <div className={styles.themePreview} style={{ "--preview-primary": pack.theme.primary, "--preview-secondary": pack.theme.secondary, "--preview-bg": pack.theme.background } as CSSProperties}>
                <p>{pack.landing.eyebrow}</p><span>{pack.theme.emoji}</span><h3>{pack.subtitle}</h3><button type="button">{pack.landing.ctaLabel}</button>
              </div>
            </>
          ) : null}

          {section === "review" ? (
            <>
              <SectionTitle eyebrow="REVIEW & SAVE" title="오류와 결과 분포 확인" description="공개 전에 누락된 이미지와 결과 쏠림을 확인해요." />
              <div className={styles.reviewActions}>
                <button type="button" onClick={() => { refreshValidation(); setMessage("현재 편집 내용을 다시 검사했습니다."); }}>다시 검사</button>
                <button type="button" onClick={downloadJson}>JSON 백업</button>
                <button type="button" data-primary onClick={save} disabled={saving}>{saving ? "저장 중…" : "프로젝트에 저장"}</button>
              </div>
              {message ? <p className={styles.statusMessage}>{message}</p> : null}
              <div className={styles.reviewGrid}>
                <section className={styles.issuePanel}>
                  <div className={styles.panelTitle}><strong>검증 메시지</strong><span>{errorCount} errors · {warningCount} warnings</span></div>
                  {issues.length ? (
                    <div className={styles.issueList}>
                      {issues.map((issue, index) => (
                        <article key={`${issue.path}-${index}`} data-level={issue.severity}><strong>{issue.severity === "error" ? "오류" : "확인"}</strong><div><code>{issue.path}</code><p>{issue.message}</p></div></article>
                      ))}
                    </div>
                  ) : <EmptyState>현재 발견된 문제가 없습니다.</EmptyState>}
                </section>
                <section className={styles.distributionPanel}>
                  <div className={styles.panelTitle}><strong>결과 분포</strong><span>{distribution.mode === "exhaustive" ? `${distribution.evaluated.toLocaleString()}개 조합 전수 검사` : `${distribution.evaluated.toLocaleString()}개 샘플 검사`}</span></div>
                  <div className={styles.distributionList}>
                    {distribution.items.map((item) => (
                      <div key={item.profileId}><div><strong>{item.profileTitle}</strong><span>{item.percentage.toFixed(1)}%</span></div><div className={styles.bar}><span style={{ width: `${Math.min(100, item.percentage * 2.2)}%` }} /></div></div>
                    ))}
                  </div>
                </section>
              </div>
              <details className={styles.jsonDetails}><summary>전체 pack.json 확인</summary><pre>{JSON.stringify(pack, null, 2)}</pre></details>
            </>
          ) : null}
        </section>
      </div>
      {message && section !== "review" ? <div className={styles.toast}>{message}<button type="button" onClick={() => setMessage("")}>×</button></div> : null}
    </main>
  );
}

function SectionTitle({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <div className={styles.sectionTitle}><p>{eyebrow}</p><h2>{title}</h2><span>{description}</span></div>;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return <div className={styles.empty}>{children}</div>;
}
