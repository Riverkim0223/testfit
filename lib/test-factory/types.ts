export type TestStatus = "active" | "draft";
export type TestInputMode = "questionnaire";

export interface TestTheme {
  primary: string;
  secondary: string;
  accent: string;
  surface: string;
  background: string;
  text: string;
  muted: string;
  emoji: string;
}

export interface AxisDefinition {
  id: string;
  label: string;
  lowLabel: string;
  highLabel: string;
  weight?: number;
}

export interface TagDefinition {
  id: string;
  label: string;
}

export interface TestChoice {
  id: string;
  label: string;
  description?: string;
}

export interface PreQuestionDefinition {
  id: string;
  title: string;
  description?: string;
  choices: TestChoice[];
}

export interface TestQuestionOption {
  id: string;
  label: string;
  description?: string;
  axisScores?: Record<string, number>;
  tagScores?: Record<string, number>;
}

export interface TestQuestionDefinition {
  id: string;
  order: number;
  eyebrow?: string;
  text: string;
  options: TestQuestionOption[];
}

export interface ScoreTarget {
  value: number;
  weight?: number;
}

export interface ProfileRecommendation {
  slotId: string;
  kicker: string;
  title: string;
  description: string;
  emoji?: string;
  value?: string;
  badges?: string[];
}

export interface ProfileIllustration {
  src: string;
  alt: string;
  objectPosition?: string;
}

export interface ResultProfileDefinition {
  id: string;
  title: string;
  emoji: string;
  subtitle: string;
  description: string;
  axisTargets: Record<string, number>;
  tagTargets?: Record<string, ScoreTarget>;
  strengths: string[];
  shareText: string;
  illustration?: ProfileIllustration;
  theme?: Partial<TestTheme>;
  recommendations?: ProfileRecommendation[];
}

export interface TestScoringConfig {
  axisWeight: number;
  tagWeight: number;
  secondaryThreshold: number;
}

export interface TestLandingConfig {
  eyebrow: string;
  ctaLabel: string;
  highlights: Array<{ value: string; label: string }>;
  notice?: string;
}

export interface TestPack {
  id: string;
  slug: string;
  version: number;
  status: TestStatus;
  inputMode: TestInputMode;
  title: string;
  shortTitle: string;
  subtitle: string;
  description: string;
  durationText: string;
  category: string;
  axes: AxisDefinition[];
  tags: TagDefinition[];
  preQuestions: PreQuestionDefinition[];
  questions: TestQuestionDefinition[];
  profiles: ResultProfileDefinition[];
  scoring: TestScoringConfig;
  theme: TestTheme;
  landing: TestLandingConfig;
}

export interface ResultTokenPayload {
  version: number;
  answers: number[];
  preAnswers: number[];
}

export interface RankedProfile {
  profile: ResultProfileDefinition;
  score: number;
  axisSimilarity: number;
  tagSimilarity: number | null;
}

export interface TestScoreVector {
  axes: Record<string, number>;
  tags: Record<string, number>;
}

export type RecommendationDisplayKind = "media" | "text" | "color" | "match";

export interface PublicRecommendation {
  slotId: string;
  displayKind: RecommendationDisplayKind;
  kicker: string;
  title: string;
  description: string;
  emoji?: string;
  value?: string;
  score?: number;
  mediaContentId?: string;
  badges?: string[];
}

export interface PublicTestResult {
  id: string;
  token: string;
  testId: string;
  testSlug: string;
  testVersion: number;
  testTitle: string;
  profileId: string;
  profileTitle: string;
  profileEmoji: string;
  profileSubtitle: string;
  profileDescription: string;
  profileIllustration?: ProfileIllustration;
  strengths: string[];
  shareText: string;
  fitScore: number;
  secondaryProfile?: {
    id: string;
    title: string;
    emoji: string;
    score: number;
  };
  axisScores: Array<{
    id: string;
    label: string;
    lowLabel: string;
    highLabel: string;
    value: number;
  }>;
  tagScores: Record<string, number>;
  recommendations: PublicRecommendation[];
  theme: TestTheme;
}
