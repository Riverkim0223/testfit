import type {
  RankedProfile,
  ResultTokenPayload,
  TestPack,
  TestScoreVector,
} from "./types";

const clampScore = (value: number) => Math.max(0, Math.min(100, value));

function normalizeDimension(
  pack: TestPack,
  answers: number[],
  dimensionId: string,
  kind: "axisScores" | "tagScores",
): number {
  let selectedRaw = 0;
  let minimumRaw = 0;
  let maximumRaw = 0;

  pack.questions.forEach((question, questionIndex) => {
    const optionValues = question.options.map(
      (option) => option[kind]?.[dimensionId] ?? 0,
    );
    selectedRaw += optionValues[answers[questionIndex]!] ?? 0;
    minimumRaw += Math.min(...optionValues);
    maximumRaw += Math.max(...optionValues);
  });

  if (maximumRaw === minimumRaw) return 50;
  return clampScore(
    ((selectedRaw - minimumRaw) / (maximumRaw - minimumRaw)) * 100,
  );
}

export function calculateScoreVector(
  pack: TestPack,
  payload: ResultTokenPayload,
): TestScoreVector {
  return {
    axes: Object.fromEntries(
      pack.axes.map((axis) => [
        axis.id,
        normalizeDimension(pack, payload.answers, axis.id, "axisScores"),
      ]),
    ),
    tags: Object.fromEntries(
      pack.tags.map((tag) => [
        tag.id,
        normalizeDimension(pack, payload.answers, tag.id, "tagScores"),
      ]),
    ),
  };
}

function weightedSimilarity(
  pairs: Array<{ actual: number; target: number; weight: number }>,
): number {
  if (pairs.length === 0) return 50;
  const totalWeight = pairs.reduce((sum, pair) => sum + pair.weight, 0);
  if (totalWeight <= 0) return 50;
  return pairs.reduce((sum, pair) => {
    const similarity = 100 - Math.abs(pair.actual - pair.target);
    return sum + similarity * pair.weight;
  }, 0) / totalWeight;
}

export function rankProfiles(
  pack: TestPack,
  vector: TestScoreVector,
): RankedProfile[] {
  return pack.profiles
    .map((profile) => {
      const axisSimilarity = weightedSimilarity(
        pack.axes.map((axis) => ({
          actual: vector.axes[axis.id] ?? 50,
          target: profile.axisTargets[axis.id] ?? 50,
          weight: axis.weight ?? 1,
        })),
      );

      const tagEntries = Object.entries(profile.tagTargets ?? {});
      const tagSimilarity = tagEntries.length
        ? weightedSimilarity(
            tagEntries.map(([tagId, target]) => ({
              actual: vector.tags[tagId] ?? 50,
              target: target.value,
              weight: target.weight ?? 1,
            })),
          )
        : null;

      const axisWeight = tagSimilarity === null ? 1 : pack.scoring.axisWeight;
      const tagWeight = tagSimilarity === null ? 0 : pack.scoring.tagWeight;
      const totalWeight = axisWeight + tagWeight;
      const score =
        (axisSimilarity * axisWeight + (tagSimilarity ?? 0) * tagWeight) /
        totalWeight;

      return { profile, score, axisSimilarity, tagSimilarity };
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.axisSimilarity !== a.axisSimilarity) {
        return b.axisSimilarity - a.axisSimilarity;
      }
      return (b.tagSimilarity ?? 0) - (a.tagSimilarity ?? 0);
    });
}
