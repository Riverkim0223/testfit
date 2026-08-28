import { reelsMediaCatalog } from "@/data/reels-media.catalog";
import type { ReelsMediaCatalogItem } from "@/lib/reels-media";
import type {
  PublicRecommendation,
  ResultProfileDefinition,
  ResultTokenPayload,
  TestPack,
  TestScoreVector,
} from "./types";

const average = (values: number[]) =>
  values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;

function vectorSimilarity(
  ids: string[],
  user: Record<string, number>,
  content: Record<string, number>,
): number {
  return Math.max(
    0,
    100 - average(ids.map((id) => Math.abs((user[id] ?? 50) - (content[id] ?? 50)))),
  );
}

function vectorDistance(
  ids: string[],
  user: Record<string, number>,
  content: Record<string, number>,
): number {
  return average(ids.map((id) => Math.abs((user[id] ?? 50) - (content[id] ?? 50))));
}

function difficultyFit(selected: number, contentDifficulty = 1): number | null {
  const difference = contentDifficulty - selected;
  if (difference >= 2) return null;
  if (difference === 1) return 60;
  if (difference === 0) return 100;
  if (difference === -1) return 85;
  if (difference === -2) return 65;
  return 45;
}

function participantFit(
  selected: string,
  content: ReelsMediaCatalogItem,
  mode: "normal" | "together",
): number | null {
  if (mode === "together") {
    const target = selected === "group" ? "group" : selected === "couple" ? "couple" : "friend";
    if (content.participantTypes.includes(target)) return 100;
    if (
      (target === "friend" && content.participantTypes.includes("couple")) ||
      (target === "couple" && content.participantTypes.includes("friend"))
    ) {
      return 82;
    }
    return null;
  }

  if (selected === "undecided") return 80;
  return content.participantTypes.includes(selected) ? 100 : null;
}

function describeClosestTraits(
  pack: TestPack,
  vector: TestScoreVector,
  content: ReelsMediaCatalogItem,
): string {
  const descriptors: Record<string, [string, string]> = {
    ENERGY: ["부드러운 에너지", "강한 에너지"],
    SPOTLIGHT: ["자연스러운 분위기", "확실한 존재감"],
    MOTION: ["표정과 손동작", "전신 안무"],
    PRODUCTION: ["간단한 촬영", "소품과 편집 연출"],
  };

  const closest = pack.axes
    .map((axis) => ({
      id: axis.id,
      difference: Math.abs((vector.axes[axis.id] ?? 50) - content.axes[axis.id as keyof typeof content.axes]),
      phrase:
        (vector.axes[axis.id] ?? 50) >= 50
          ? descriptors[axis.id]?.[1] ?? axis.highLabel
          : descriptors[axis.id]?.[0] ?? axis.lowLabel,
    }))
    .sort((a, b) => a.difference - b.difference)
    .slice(0, 2)
    .map((item) => item.phrase);

  return `${closest[0]}과 ${closest[1]} 취향을 자연스럽게 살릴 수 있는 콘텐츠예요.`;
}

interface RankedContent {
  content: ReelsMediaCatalogItem;
  score: number;
  axisFit: number;
  tagFit: number;
}

function rankBestFit(
  pack: TestPack,
  vector: TestScoreVector,
  payload: ResultTokenPayload,
  excluded: Set<string>,
  profileTitle: string,
): RankedContent[] {
  const participant = pack.preQuestions[0]?.choices[payload.preAnswers[0] ?? 0]?.id ?? "undecided";
  const selectedDifficulty = Number(
    pack.preQuestions[1]?.choices[payload.preAnswers[1] ?? 0]?.id ?? "2",
  );
  const axisIds = pack.axes.map((axis) => axis.id);
  const tagIds = pack.tags.map((tag) => tag.id);

  return reelsMediaCatalog
    .filter(
      (content) =>
        content.status === "ACTIVE" &&
        content.kind === "CHALLENGE" &&
        content.eligibleSlots.includes("BEST_FIT") &&
        !excluded.has(content.id),
    )
    .flatMap((content) => {
      const participantScore = participantFit(participant, content, "normal");
      const difficultyScore = difficultyFit(selectedDifficulty, content.movementDifficulty);
      if (participantScore === null || difficultyScore === null) return [];

      const axisFit = vectorSimilarity(axisIds, vector.axes, content.axes);
      const tagFit = vectorSimilarity(tagIds, vector.tags, content.tags);
      const profileBonus = content.preferredProfiles.includes(profileTitle) ? 8 : 0;
      const score = Math.min(100,
        axisFit * 0.4 +
        tagFit * 0.2 +
        difficultyScore * 0.15 +
        participantScore * 0.1 +
        content.trendScore * 0.1 +
        50 * 0.05 +
        profileBonus,
      );
      return [{ content, score, axisFit, tagFit }];
    })
    .sort((a, b) => b.score - a.score);
}

function rankAudio(
  pack: TestPack,
  vector: TestScoreVector,
  excluded: Set<string>,
  profileTitle: string,
): RankedContent[] {
  const axisIds = pack.axes.map((axis) => axis.id);
  const tagIds = pack.tags.map((tag) => tag.id);

  return reelsMediaCatalog
    .filter(
      (content) =>
        content.status === "ACTIVE" &&
        content.kind === "AUDIO" &&
        content.eligibleSlots.includes("AUDIO_FIT") &&
        !excluded.has(content.id),
    )
    .map((content) => {
      const axisFit = vectorSimilarity(axisIds, vector.axes, content.axes);
      const tagFit = vectorSimilarity(tagIds, vector.tags, content.tags);
      const profileBonus = content.preferredProfiles.includes(profileTitle) ? 9 : 0;
      return {
        content,
        axisFit,
        tagFit,
        score: Math.min(100, axisFit * 0.35 + tagFit * 0.35 + content.trendScore * 0.2 + 50 * 0.1 + profileBonus),
      };
    })
    .sort((a, b) => b.score - a.score);
}

function rankTogether(
  pack: TestPack,
  vector: TestScoreVector,
  payload: ResultTokenPayload,
  excluded: Set<string>,
  profileTitle: string,
): RankedContent[] {
  const participant = pack.preQuestions[0]?.choices[payload.preAnswers[0] ?? 0]?.id ?? "undecided";
  const selectedDifficulty = Number(
    pack.preQuestions[1]?.choices[payload.preAnswers[1] ?? 0]?.id ?? "2",
  );
  const axisIds = pack.axes.map((axis) => axis.id);
  const tagIds = pack.tags.map((tag) => tag.id);

  return reelsMediaCatalog
    .filter(
      (content) =>
        content.status === "ACTIVE" &&
        content.kind === "CHALLENGE" &&
        content.eligibleSlots.includes("TOGETHER_FIT") &&
        !excluded.has(content.id),
    )
    .flatMap((content) => {
      const participantScore = participantFit(participant, content, "together");
      const difficultyScore = difficultyFit(selectedDifficulty, content.movementDifficulty);
      if (participantScore === null || difficultyScore === null) return [];
      const axisFit = vectorSimilarity(axisIds, vector.axes, content.axes);
      const tagFit = vectorSimilarity(tagIds, vector.tags, content.tags);
      const togetherScore = content.participantTypes.length >= 2 ? 88 : 55;
      const profileBonus = content.preferredProfiles.includes(profileTitle) ? 8 : 0;
      const score = Math.min(100,
        axisFit * 0.3 +
        tagFit * 0.15 +
        participantScore * 0.2 +
        togetherScore * 0.15 +
        difficultyScore * 0.1 +
        content.trendScore * 0.1 +
        profileBonus,
      );
      return [{ content, score, axisFit, tagFit }];
    })
    .sort((a, b) => b.score - a.score);
}

function rankContrast(
  pack: TestPack,
  vector: TestScoreVector,
  payload: ResultTokenPayload,
  excluded: Set<string>,
  strict = true,
): RankedContent[] {
  const participant = pack.preQuestions[0]?.choices[payload.preAnswers[0] ?? 0]?.id ?? "undecided";
  const selectedDifficulty = Number(
    pack.preQuestions[1]?.choices[payload.preAnswers[1] ?? 0]?.id ?? "2",
  );
  const axisIds = pack.axes.map((axis) => axis.id);
  const tagIds = pack.tags.map((tag) => tag.id);

  return reelsMediaCatalog
    .filter(
      (content) =>
        content.status === "ACTIVE" &&
        content.kind === "CHALLENGE" &&
        content.eligibleSlots.includes("CONTRAST_FIT") &&
        !excluded.has(content.id),
    )
    .flatMap((content) => {
      const rawParticipantScore = participantFit(participant, content, "normal");
      const rawDifficultyScore = difficultyFit(selectedDifficulty, content.movementDifficulty);
      if (strict && (rawParticipantScore === null || rawDifficultyScore === null)) return [];
      const participantScore = rawParticipantScore ?? 45;
      const difficultyScore = rawDifficultyScore ?? 25;

      const axisDistance = vectorDistance(axisIds, vector.axes, content.axes);
      const contrastingAxes = axisIds.filter(
        (axisId) => Math.abs((vector.axes[axisId] ?? 50) - content.axes[axisId as keyof typeof content.axes]) >= 35,
      ).length;
      if (strict && contrastingAxes < 2) return [];

      const contrastFit = Math.max(0, 100 - Math.abs(axisDistance - 55) * 2);
      const tagDistance = vectorDistance(tagIds, vector.tags, content.tags);
      const score =
        contrastFit * 0.35 +
        tagDistance * 0.2 +
        difficultyScore * 0.2 +
        participantScore * 0.1 +
        75 * 0.1 +
        content.trendScore * 0.05;
      return [{ content, score, axisFit: 100 - axisDistance, tagFit: 100 - tagDistance }];
    })
    .sort((a, b) => b.score - a.score);
}

function toMediaRecommendation(
  item: RankedContent,
  slotId: string,
  kicker: string,
  description: string,
  pack: TestPack,
  vector: TestScoreVector,
): PublicRecommendation {
  return {
    slotId,
    displayKind: "media",
    kicker,
    title: item.content.title,
    description:
      description || describeClosestTraits(pack, vector, item.content),
    score: item.score,
    mediaContentId: item.content.id,
    badges: [
      item.content.format,
      `난이도 ${item.content.movementDifficulty ?? 1}`,
      item.content.creator ?? "원본 콘텐츠",
    ],
  };
}

export function buildReelsRecommendations(
  pack: TestPack,
  vector: TestScoreVector,
  payload: ResultTokenPayload,
  profileTitle: string,
): PublicRecommendation[] {
  const excluded = new Set<string>();
  const result: PublicRecommendation[] = [];

  const best = rankBestFit(pack, vector, payload, excluded, profileTitle)[0];
  if (best) {
    excluded.add(best.content.id);
    result.push(
      toMediaRecommendation(
        best,
        "BEST_FIT",
        "오늘의 찰떡 챌린지",
        describeClosestTraits(pack, vector, best.content),
        pack,
        vector,
      ),
    );
  }

  const audio = rankAudio(pack, vector, excluded, profileTitle)[0];
  if (audio) {
    excluded.add(audio.content.id);
    result.push(
      toMediaRecommendation(
        audio,
        "AUDIO_FIT",
        "나에게 어울리는 노래",
        "당신의 에너지와 표현 방식에 잘 맞는 오디오예요. 원본 플랫폼에서 추천 구간을 확인해보세요.",
        pack,
        vector,
      ),
    );
  }

  const together = rankTogether(pack, vector, payload, excluded, profileTitle)[0];
  if (together) {
    excluded.add(together.content.id);
    result.push(
      toMediaRecommendation(
        together,
        "TOGETHER_FIT",
        "함께 찍기 좋은 챌린지",
        "혼자보다 누군가와 타이밍을 맞췄을 때 더 재미있는 콘텐츠예요.",
        pack,
        vector,
      ),
    );
  }

  const contrast =
    rankContrast(pack, vector, payload, excluded, true)[0] ??
    rankContrast(pack, vector, payload, excluded, false)[0];
  if (contrast) {
    excluded.add(contrast.content.id);
    result.push(
      toMediaRecommendation(
        contrast,
        "CONTRAST_FIT",
        "나와 극과 극인 챌린지",
        "평소 취향과는 반대지만, 성공하면 가장 강한 반전 매력을 보여줄 수 있어요.",
        pack,
        vector,
      ),
    );
  }

  return result;
}

export function buildProfileRecommendations(
  profile: ResultProfileDefinition,
): PublicRecommendation[] {
  return (profile.recommendations ?? []).map((recommendation) => ({
    ...recommendation,
    displayKind:
      recommendation.slotId === "COLOR"
        ? "color"
        : recommendation.slotId.includes("MATCH") || recommendation.slotId === "CONTRAST"
          ? "match"
          : "text",
  }));
}
