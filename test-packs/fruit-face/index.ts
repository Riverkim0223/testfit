import type { TestPack } from "@/lib/test-factory/types";
import { fruitFaceProfiles } from "./profiles";
import { fruitFaceQuestions } from "./questions";

export const fruitFacePack: TestPack = {
  id: "fruit-face",
  slug: "fruit-face",
  version: 2,
  status: "active",
  inputMode: "questionnaire",
  title: "과일상 테스트",
  shortTitle: "나는 어떤 과일상?",
  subtitle: "나에게 가장 잘 어울리는 과일 이미지는?",
  description:
    "결과 일러스트의 성별 버전을 선택한 뒤, 10개의 취향 질문으로 밝기, 부드러움, 개성, 에너지를 살펴보고 나를 닮은 과일상과 어울리는 컬러·스타일을 알려줘요.",
  durationText: "약 1분",
  category: "이미지 · 성향",
  axes: [
    { id: "BRIGHTNESS", label: "밝은 에너지", lowLabel: "차분함", highLabel: "화사함" },
    { id: "SOFTNESS", label: "부드러움", lowLabel: "선명함", highLabel: "말랑함" },
    { id: "UNIQUENESS", label: "개성", lowLabel: "친근함", highLabel: "독특함" },
    { id: "ENERGY", label: "활동성", lowLabel: "잔잔함", highLabel: "활동적" },
  ],
  tags: [],
  preQuestions: [
    {
      id: "result-gender",
      eyebrow: "결과 이미지 설정",
      title: "본인의 성별을 선택해 주세요",
      description:
        "선택한 성별에 맞는 인물 일러스트가 결과와 공유 이미지에 표시돼요. 과일상 점수 계산에는 영향을 주지 않아요.",
      choices: [
        {
          id: "female",
          label: "여성",
          description: "여성 인물 일러스트로 결과 보기",
          resultVariant: "female",
        },
        {
          id: "male",
          label: "남성",
          description: "남성 인물 일러스트로 결과 보기",
          resultVariant: "male",
        },
      ],
    },
  ],
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
    eyebrow: "2 GENDER VERSIONS · 10 QUESTIONS · 8 FRUITS",
    ctaLabel: "내 과일상 알아보기",
    highlights: [
      { value: "10", label: "취향 질문" },
      { value: "8", label: "과일 유형" },
      { value: "4", label: "결과 추천" },
    ],
    notice: "얼굴 사진을 분석하는 검사가 아닌 재미용 질문 테스트예요. 성별 선택은 결과 일러스트에만 반영돼요.",
  },
};
