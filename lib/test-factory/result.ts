import { getTestPack } from "./registry";
import { buildProfileRecommendations, buildReelsRecommendations } from "./recommendations";
import { calculateScoreVector, rankProfiles } from "./scoring";
import { decodeResultToken } from "./token";
import type { PublicTestResult, ResultProfileDefinition, TestPack, TestTheme } from "./types";

function mergeTheme(base: TestTheme, override?: Partial<TestTheme>): TestTheme {
  return { ...base, ...override };
}

function resolveResultVariant(
  pack: TestPack,
  preAnswers: number[],
): string | undefined {
  for (const [questionIndex, question] of pack.preQuestions.entries()) {
    const selectedIndex = preAnswers[questionIndex];
    const selectedChoice =
      selectedIndex === undefined ? undefined : question.choices[selectedIndex];

    if (selectedChoice?.resultVariant) {
      return selectedChoice.resultVariant;
    }
  }

  return undefined;
}

function resolveProfileIllustration(
  profile: ResultProfileDefinition,
  resultVariant?: string,
) {
  if (resultVariant) {
    const variantIllustration = profile.illustrationVariants?.[resultVariant];
    if (variantIllustration) return variantIllustration;
  }

  return profile.illustration;
}

export async function getPublicTestResult(
  testSlug: string,
  resultToken: string,
): Promise<PublicTestResult | null> {
  const pack = getTestPack(testSlug);
  if (!pack) return null;

  const payload = decodeResultToken(pack, resultToken);
  if (!payload) return null;

  const vector = calculateScoreVector(pack, payload);
  const ranked = rankProfiles(pack, vector);
  const primary = ranked[0];
  const runnerUp = ranked[1];
  if (!primary) return null;

  const secondary =
    runnerUp && primary.score - runnerUp.score <= pack.scoring.secondaryThreshold
      ? {
          id: runnerUp.profile.id,
          title: runnerUp.profile.title,
          emoji: runnerUp.profile.emoji,
          score: runnerUp.score,
        }
      : undefined;

  const recommendations =
    pack.id === "reels-fit"
      ? buildReelsRecommendations(pack, vector, payload, primary.profile.title)
      : buildProfileRecommendations(primary.profile);

  const resultVariant = resolveResultVariant(pack, payload.preAnswers);
  const profileIllustration = resolveProfileIllustration(
    primary.profile,
    resultVariant,
  );

  return {
    id: resultToken,
    token: resultToken,
    testId: pack.id,
    testSlug: pack.slug,
    testVersion: pack.version,
    testTitle: pack.title,
    profileId: primary.profile.id,
    profileTitle: primary.profile.title,
    profileEmoji: primary.profile.emoji,
    profileSubtitle: primary.profile.subtitle,
    profileDescription: primary.profile.description,
    profileIllustration,
    resultVariant,
    strengths: primary.profile.strengths,
    shareText: primary.profile.shareText,
    fitScore: primary.score,
    secondaryProfile: secondary,
    axisScores: pack.axes.map((axis) => ({
      id: axis.id,
      label: axis.label,
      lowLabel: axis.lowLabel,
      highLabel: axis.highLabel,
      value: vector.axes[axis.id] ?? 50,
    })),
    tagScores: vector.tags,
    recommendations,
    theme: mergeTheme(pack.theme, primary.profile.theme),
  };
}
