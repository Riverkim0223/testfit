import type { TestPack } from "@/lib/test-factory/types";
import { fruitFaceProfiles } from "./profiles";
import { fruitFaceQuestions } from "./questions";

export const fruitFacePack: TestPack = {
  id: "fruit-face",
  slug: "fruit-face",
  version: 1,
  status: "active",
  inputMode: "questionnaire",
  title: "과일상 테스트",
  shortTitle: "나는 어떤 과일상?",
  subtitle: "나에게 가장 잘 어울리는 과일 이미지는?",
  description:
    "10개의 취향 질문으로 밝기, 부드러움, 개성, 에너지를 살펴보고 나를 닮은 과일상과 어울리는 컬러·스타일을 알려줘요.",
  durationText: "약 1분",
  category: "이미지 · 성향",
  axes: [
    { id: "BRIGHTNESS", label: "밝은 에너지", lowLabel: "차분함", highLabel: "화사함" },
    { id: "SOFTNESS", label: "부드러움", lowLabel: "선명함", highLabel: "말랑함" },
    { id: "UNIQUENESS", label: "개성", lowLabel: "친근함", highLabel: "독특함" },
    { id: "ENERGY", label: "활동성", lowLabel: "잔잔함", highLabel: "활동적" },
  ],
  tags: [],
  preQuestions: [],
  questions: fruitFaceQuestions,
  profiles: fruitFaceProfiles,
  scoring: { axisWeight: 1, tagWeight: 0, secondaryThreshold: 7 },
  theme: {
    primary: "#FF6F91",
    secondary: "#FFB85C",
    accent: "#FFF2A6",
    surface: "#FFFFFF",
    background: "#FFF8F2",
    text: "#2B2030",
    muted: "#786C76",
    emoji: "🍑",
  },
  landing: {
    eyebrow: "10 QUESTIONS · 8 FRUITS",
    ctaLabel: "내 과일상 알아보기",
    highlights: [
      { value: "10", label: "취향 질문" },
      { value: "8", label: "과일 유형" },
      { value: "4", label: "결과 추천" },
    ],
    notice: "얼굴 사진을 분석하는 검사가 아닌 재미용 질문 테스트예요.",
  },
};
