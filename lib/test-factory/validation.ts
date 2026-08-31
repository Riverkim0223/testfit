import { calculateScoreVector, rankProfiles } from "./scoring";
import type {
  ResultTokenPayload,
  TestPack,
} from "./types";

export type ValidationSeverity = "error" | "warning";

export interface TestPackValidationIssue {
  severity: ValidationSeverity;
  path: string;
  message: string;
}

export interface TestPackDistributionItem {
  profileId: string;
  profileTitle: string;
  count: number;
  percentage: number;
}

export interface TestPackDistribution {
  mode: "exhaustive" | "sampled";
  combinations: number;
  evaluated: number;
  items: TestPackDistributionItem[];
}

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const HEX_COLOR_PATTERN = /^#[0-9a-f]{6}$/i;

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

function addIssue(
  issues: TestPackValidationIssue[],
  severity: ValidationSeverity,
  path: string,
  message: string,
) {
  issues.push({ severity, path, message });
}

function requireText(
  issues: TestPackValidationIssue[],
  value: unknown,
  path: string,
  label: string,
) {
  if (typeof value !== "string" || !value.trim()) {
    addIssue(issues, "error", path, `${label}을(를) 입력해 주세요.`);
  }
}

function checkUniqueIds(
  issues: TestPackValidationIssue[],
  values: Array<{ id?: unknown }>,
  path: string,
  label: string,
) {
  const seen = new Set<string>();
  values.forEach((item, index) => {
    const id = typeof item.id === "string" ? item.id.trim() : "";
    if (!id) {
      addIssue(issues, "error", `${path}[${index}].id`, `${label} ID를 입력해 주세요.`);
      return;
    }
    if (seen.has(id)) {
      addIssue(issues, "error", `${path}[${index}].id`, `중복된 ${label} ID입니다: ${id}`);
    }
    seen.add(id);
  });
}

function checkScore(
  issues: TestPackValidationIssue[],
  value: unknown,
  path: string,
  label: string,
) {
  if (!isFiniteNumber(value) || value < 0 || value > 100) {
    addIssue(issues, "error", path, `${label}은(는) 0~100 사이 숫자여야 합니다.`);
  }
}

function validateTheme(
  issues: TestPackValidationIssue[],
  theme: unknown,
  path: string,
) {
  if (!isRecord(theme)) {
    addIssue(issues, "error", path, "테마 설정이 필요합니다.");
    return;
  }

  for (const key of [
    "primary",
    "secondary",
    "accent",
    "surface",
    "background",
    "text",
    "muted",
  ]) {
    const value = theme[key];
    if (typeof value !== "string" || !HEX_COLOR_PATTERN.test(value)) {
      addIssue(issues, "error", `${path}.${key}`, `${key} 색상은 #RRGGBB 형식이어야 합니다.`);
    }
  }
  requireText(issues, theme.emoji, `${path}.emoji`, "테마 이모지");
}

export function validateTestPack(raw: unknown): TestPackValidationIssue[] {
  const issues: TestPackValidationIssue[] = [];
  if (!isRecord(raw)) {
    return [{ severity: "error", path: "$", message: "테스트팩 JSON은 객체여야 합니다." }];
  }

  requireText(issues, raw.id, "id", "테스트 ID");
  requireText(issues, raw.slug, "slug", "Slug");
  requireText(issues, raw.title, "title", "테스트 이름");
  requireText(issues, raw.shortTitle, "shortTitle", "짧은 이름");
  requireText(issues, raw.subtitle, "subtitle", "메인 문구");
  requireText(issues, raw.description, "description", "설명");
  requireText(issues, raw.durationText, "durationText", "예상 소요 시간");
  requireText(issues, raw.category, "category", "카테고리");

  if (typeof raw.slug === "string" && !SLUG_PATTERN.test(raw.slug)) {
    addIssue(issues, "error", "slug", "Slug는 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.");
  }
  if (!Number.isInteger(raw.version) || Number(raw.version) < 1) {
    addIssue(issues, "error", "version", "버전은 1 이상의 정수여야 합니다.");
  }
  if (raw.status !== "active" && raw.status !== "draft") {
    addIssue(issues, "error", "status", "상태는 active 또는 draft여야 합니다.");
  }
  if (raw.inputMode !== "questionnaire") {
    addIssue(issues, "error", "inputMode", "현재는 questionnaire 입력 방식만 지원합니다.");
  }
  if (raw.recommendationMode !== undefined && raw.recommendationMode !== "profile" && raw.recommendationMode !== "reels-catalog") {
    addIssue(issues, "error", "recommendationMode", "추천 방식은 profile 또는 reels-catalog여야 합니다.");
  }

  const axes = Array.isArray(raw.axes) ? raw.axes.filter(isRecord) : [];
  if (axes.length < 1) {
    addIssue(issues, "error", "axes", "측정 축을 1개 이상 추가해 주세요.");
  }
  checkUniqueIds(issues, axes, "axes", "측정 축");
  axes.forEach((axis, index) => {
    requireText(issues, axis.label, `axes[${index}].label`, "축 이름");
    requireText(issues, axis.lowLabel, `axes[${index}].lowLabel`, "낮은 방향 이름");
    requireText(issues, axis.highLabel, `axes[${index}].highLabel`, "높은 방향 이름");
    if (axis.weight !== undefined && (!isFiniteNumber(axis.weight) || axis.weight <= 0)) {
      addIssue(issues, "error", `axes[${index}].weight`, "축 가중치는 0보다 커야 합니다.");
    }
  });
  const axisIds = new Set(axes.map((axis) => String(axis.id)));

  const tags = Array.isArray(raw.tags) ? raw.tags.filter(isRecord) : [];
  checkUniqueIds(issues, tags, "tags", "스타일 태그");
  tags.forEach((tag, index) => {
    requireText(issues, tag.label, `tags[${index}].label`, "태그 이름");
  });
  const tagIds = new Set(tags.map((tag) => String(tag.id)));

  const preQuestions = Array.isArray(raw.preQuestions)
    ? raw.preQuestions.filter(isRecord)
    : [];
  checkUniqueIds(issues, preQuestions, "preQuestions", "사전 질문");
  const expectedVariants = new Set<string>();
  preQuestions.forEach((question, questionIndex) => {
    requireText(issues, question.title, `preQuestions[${questionIndex}].title`, "사전 질문 제목");
    const choices = Array.isArray(question.choices) ? question.choices.filter(isRecord) : [];
    if (choices.length < 2) {
      addIssue(issues, "error", `preQuestions[${questionIndex}].choices`, "사전 질문에는 선택지가 2개 이상 필요합니다.");
    }
    checkUniqueIds(issues, choices, `preQuestions[${questionIndex}].choices`, "사전 선택지");
    choices.forEach((choice, choiceIndex) => {
      requireText(
        issues,
        choice.label,
        `preQuestions[${questionIndex}].choices[${choiceIndex}].label`,
        "사전 선택지 문구",
      );
      if (typeof choice.resultVariant === "string" && choice.resultVariant.trim()) {
        expectedVariants.add(choice.resultVariant.trim());
      }
    });
  });

  const questions = Array.isArray(raw.questions) ? raw.questions.filter(isRecord) : [];
  if (questions.length < 1) {
    addIssue(issues, "error", "questions", "질문을 1개 이상 추가해 주세요.");
  }
  checkUniqueIds(issues, questions, "questions", "질문");
  questions.forEach((question, questionIndex) => {
    requireText(issues, question.text, `questions[${questionIndex}].text`, "질문 문구");
    if (!Number.isInteger(question.order)) {
      addIssue(issues, "warning", `questions[${questionIndex}].order`, "질문 순서는 정수 사용을 권장합니다.");
    }
    const options = Array.isArray(question.options) ? question.options.filter(isRecord) : [];
    if (options.length < 2) {
      addIssue(issues, "error", `questions[${questionIndex}].options`, "질문에는 선택지가 2개 이상 필요합니다.");
    }
    checkUniqueIds(issues, options, `questions[${questionIndex}].options`, "질문 선택지");
    options.forEach((option, optionIndex) => {
      requireText(
        issues,
        option.label,
        `questions[${questionIndex}].options[${optionIndex}].label`,
        "선택지 문구",
      );
      if (isRecord(option.axisScores)) {
        Object.entries(option.axisScores).forEach(([axisId, score]) => {
          if (!axisIds.has(axisId)) {
            addIssue(
              issues,
              "error",
              `questions[${questionIndex}].options[${optionIndex}].axisScores.${axisId}`,
              `등록되지 않은 축입니다: ${axisId}`,
            );
          }
          if (!isFiniteNumber(score)) {
            addIssue(
              issues,
              "error",
              `questions[${questionIndex}].options[${optionIndex}].axisScores.${axisId}`,
              "축 점수는 숫자여야 합니다.",
            );
          }
        });
      }
      if (isRecord(option.tagScores)) {
        Object.entries(option.tagScores).forEach(([tagId, score]) => {
          if (!tagIds.has(tagId)) {
            addIssue(
              issues,
              "error",
              `questions[${questionIndex}].options[${optionIndex}].tagScores.${tagId}`,
              `등록되지 않은 태그입니다: ${tagId}`,
            );
          }
          if (!isFiniteNumber(score)) {
            addIssue(
              issues,
              "error",
              `questions[${questionIndex}].options[${optionIndex}].tagScores.${tagId}`,
              "태그 점수는 숫자여야 합니다.",
            );
          }
        });
      }
    });
  });

  const profiles = Array.isArray(raw.profiles) ? raw.profiles.filter(isRecord) : [];
  if (profiles.length < 2) {
    addIssue(issues, "error", "profiles", "결과 유형을 2개 이상 추가해 주세요.");
  }
  checkUniqueIds(issues, profiles, "profiles", "결과 유형");
  profiles.forEach((profile, profileIndex) => {
    requireText(issues, profile.title, `profiles[${profileIndex}].title`, "결과 유형명");
    requireText(issues, profile.emoji, `profiles[${profileIndex}].emoji`, "결과 이모지");
    requireText(issues, profile.subtitle, `profiles[${profileIndex}].subtitle`, "결과 한 줄 설명");
    requireText(issues, profile.description, `profiles[${profileIndex}].description`, "결과 상세 설명");
    requireText(issues, profile.shareText, `profiles[${profileIndex}].shareText`, "공유 문구");

    if (!isRecord(profile.axisTargets)) {
      addIssue(issues, "error", `profiles[${profileIndex}].axisTargets`, "결과 유형의 축 기준값이 필요합니다.");
    } else {
      for (const axisId of axisIds) {
        checkScore(
          issues,
          profile.axisTargets[axisId],
          `profiles[${profileIndex}].axisTargets.${axisId}`,
          `${axisId} 기준값`,
        );
      }
      for (const axisId of Object.keys(profile.axisTargets)) {
        if (!axisIds.has(axisId)) {
          addIssue(
            issues,
            "warning",
            `profiles[${profileIndex}].axisTargets.${axisId}`,
            `현재 축 목록에 없는 기준값입니다: ${axisId}`,
          );
        }
      }
    }

    if (isRecord(profile.tagTargets)) {
      Object.entries(profile.tagTargets).forEach(([tagId, target]) => {
        if (!tagIds.has(tagId)) {
          addIssue(
            issues,
            "error",
            `profiles[${profileIndex}].tagTargets.${tagId}`,
            `등록되지 않은 태그입니다: ${tagId}`,
          );
        }
        if (!isRecord(target)) {
          addIssue(issues, "error", `profiles[${profileIndex}].tagTargets.${tagId}`, "태그 기준값 형식이 잘못됐습니다.");
          return;
        }
        checkScore(
          issues,
          target.value,
          `profiles[${profileIndex}].tagTargets.${tagId}.value`,
          `${tagId} 태그 기준값`,
        );
        if (target.weight !== undefined && (!isFiniteNumber(target.weight) || target.weight <= 0)) {
          addIssue(
            issues,
            "error",
            `profiles[${profileIndex}].tagTargets.${tagId}.weight`,
            "태그 가중치는 0보다 커야 합니다.",
          );
        }
      });
    }

    if (!Array.isArray(profile.strengths) || profile.strengths.length < 1) {
      addIssue(issues, "warning", `profiles[${profileIndex}].strengths`, "매력 포인트를 1개 이상 입력하는 것을 권장합니다.");
    }
    if (raw.recommendationMode !== "reels-catalog" && (!Array.isArray(profile.recommendations) || profile.recommendations.length < 1)) {
      addIssue(issues, "warning", `profiles[${profileIndex}].recommendations`, "결과 추천 카드가 없습니다.");
    }

    const variants = isRecord(profile.illustrationVariants)
      ? profile.illustrationVariants
      : {};
    for (const variant of expectedVariants) {
      const illustration = variants[variant];
      if (!isRecord(illustration) || typeof illustration.src !== "string" || !illustration.src.trim()) {
        addIssue(
          issues,
          raw.status === "active" ? "error" : "warning",
          `profiles[${profileIndex}].illustrationVariants.${variant}`,
          `${profile.title ?? profile.id ?? "결과 유형"}의 ${variant} 이미지가 없습니다.`,
        );
      }
    }
  });

  if (!isRecord(raw.scoring)) {
    addIssue(issues, "error", "scoring", "점수 계산 설정이 필요합니다.");
  } else {
    const axisWeight = raw.scoring.axisWeight;
    const tagWeight = raw.scoring.tagWeight;
    if (!isFiniteNumber(axisWeight) || axisWeight < 0) {
      addIssue(issues, "error", "scoring.axisWeight", "축 가중치는 0 이상의 숫자여야 합니다.");
    }
    if (!isFiniteNumber(tagWeight) || tagWeight < 0) {
      addIssue(issues, "error", "scoring.tagWeight", "태그 가중치는 0 이상의 숫자여야 합니다.");
    }
    if (isFiniteNumber(axisWeight) && isFiniteNumber(tagWeight) && axisWeight + tagWeight <= 0) {
      addIssue(issues, "error", "scoring", "축과 태그 가중치 합은 0보다 커야 합니다.");
    }
    if (!isFiniteNumber(raw.scoring.secondaryThreshold) || raw.scoring.secondaryThreshold < 0) {
      addIssue(issues, "error", "scoring.secondaryThreshold", "보조 유형 기준은 0 이상의 숫자여야 합니다.");
    }
  }

  validateTheme(issues, raw.theme, "theme");
  if (!isRecord(raw.landing)) {
    addIssue(issues, "error", "landing", "랜딩 설정이 필요합니다.");
  } else {
    requireText(issues, raw.landing.eyebrow, "landing.eyebrow", "랜딩 상단 문구");
    requireText(issues, raw.landing.ctaLabel, "landing.ctaLabel", "시작 버튼 문구");
    if (!Array.isArray(raw.landing.highlights) || raw.landing.highlights.length < 1) {
      addIssue(issues, "warning", "landing.highlights", "랜딩 하이라이트를 1개 이상 입력하는 것을 권장합니다.");
    }
  }

  return issues;
}

function totalQuestionCombinations(pack: TestPack): number {
  return pack.questions.reduce((total, question) => {
    if (!Number.isSafeInteger(total)) return Number.POSITIVE_INFINITY;
    return total * Math.max(1, question.options.length);
  }, 1);
}

function answersFromIndex(pack: TestPack, sourceIndex: number): number[] {
  let index = sourceIndex;
  return pack.questions.map((question) => {
    const optionCount = Math.max(1, question.options.length);
    const selected = index % optionCount;
    index = Math.floor(index / optionCount);
    return selected;
  });
}

function sampledAnswers(pack: TestPack, sampleIndex: number): number[] {
  let state = (sampleIndex + 1) * 2_654_435_761;
  return pack.questions.map((question, questionIndex) => {
    state = (state ^ (state >>> 16)) * 2_246_822_519 + questionIndex * 3_266_489_917;
    const normalized = Math.abs(state >>> 0);
    return normalized % Math.max(1, question.options.length);
  });
}

export function analyzeTestPackDistribution(
  pack: TestPack,
  maxExhaustive = 65_536,
  sampleSize = 10_000,
): TestPackDistribution {
  const combinations = totalQuestionCombinations(pack);
  const exhaustive = Number.isFinite(combinations) && combinations <= maxExhaustive;
  const evaluated = exhaustive ? combinations : sampleSize;
  const counts = new Map(pack.profiles.map((profile) => [profile.id, 0]));

  for (let index = 0; index < evaluated; index += 1) {
    const answers = exhaustive
      ? answersFromIndex(pack, index)
      : sampledAnswers(pack, index);
    const payload: ResultTokenPayload = {
      version: pack.version,
      answers,
      preAnswers: pack.preQuestions.map(() => 0),
    };
    const vector = calculateScoreVector(pack, payload);
    const primary = rankProfiles(pack, vector)[0];
    if (primary) counts.set(primary.profile.id, (counts.get(primary.profile.id) ?? 0) + 1);
  }

  const items = pack.profiles
    .map((profile) => {
      const count = counts.get(profile.id) ?? 0;
      return {
        profileId: profile.id,
        profileTitle: profile.title,
        count,
        percentage: evaluated > 0 ? (count / evaluated) * 100 : 0,
      };
    })
    .sort((a, b) => b.count - a.count);

  return {
    mode: exhaustive ? "exhaustive" : "sampled",
    combinations,
    evaluated,
    items,
  };
}

export function distributionWarnings(
  distribution: TestPackDistribution,
): TestPackValidationIssue[] {
  const issues: TestPackValidationIssue[] = [];
  for (const item of distribution.items) {
    if (item.count === 0) {
      addIssue(
        issues,
        "error",
        `profiles.${item.profileId}`,
        `${item.profileTitle} 결과가 어떤 응답에서도 나오지 않습니다. 기준 벡터를 조정해 주세요.`,
      );
    } else if (item.percentage < 3) {
      addIssue(
        issues,
        "warning",
        `profiles.${item.profileId}`,
        `${item.profileTitle} 결과 비중이 ${item.percentage.toFixed(1)}%로 매우 낮습니다.`,
      );
    } else if (item.percentage > 45) {
      addIssue(
        issues,
        "warning",
        `profiles.${item.profileId}`,
        `${item.profileTitle} 결과 비중이 ${item.percentage.toFixed(1)}%로 과도하게 높습니다.`,
      );
    }
  }
  return issues;
}

export function hasValidationErrors(issues: TestPackValidationIssue[]): boolean {
  return issues.some((issue) => issue.severity === "error");
}
