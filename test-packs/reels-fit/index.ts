import type { TestPack } from "@/lib/test-factory/types";
import { reelsFitProfiles } from "./profiles";
import { reelsFitQuestions } from "./questions";

export const reelsFitPack: TestPack = {
  id: "reels-fit",
  slug: "reels-fit",
  version: 1,
  status: "active",
  inputMode: "questionnaire",
  title: "릴스핏",
  shortTitle: "나에게 어울리는 릴스",
  subtitle: "지금 나에게 가장 잘 어울리는 챌린지는?",
  description:
    "12개의 취향 질문으로 숏폼 스타일을 분석하고, 찰떡 챌린지와 노래, 함께 찍기 좋은 콘텐츠까지 추천해요.",
  durationText: "약 2분",
  category: "취향 · 숏폼",
  axes: [
    { id: "ENERGY", label: "에너지", lowLabel: "말랑함", highLabel: "파워풀함" },
    { id: "SPOTLIGHT", label: "존재감", lowLabel: "자연스러움", highLabel: "시선 집중" },
    { id: "MOTION", label: "안무 성향", lowLabel: "표정·손동작", highLabel: "전신 안무" },
    { id: "PRODUCTION", label: "연출 욕구", lowLabel: "원테이크", highLabel: "소품·편집" },
  ],
  tags: [
    { id: "CUTE", label: "귀여움" },
    { id: "EXPRESSION", label: "표현력" },
    { id: "PRECISION", label: "완성도" },
    { id: "TRANSITION", label: "반전·전환" },
    { id: "DETAIL", label: "디테일" },
    { id: "MOOD", label: "무드" },
  ],
  preQuestions: [
    {
      id: "participant",
      title: "누구와 찍을 예정인가요?",
      description: "함께 찍기 좋은 챌린지를 고를 때 사용해요.",
      choices: [
        { id: "solo", label: "혼자", description: "나만의 장면으로" },
        { id: "friend", label: "친구 한 명과", description: "둘이 타이밍 맞추기" },
        { id: "couple", label: "연인과", description: "커플·2인 포맷" },
        { id: "group", label: "여러 명과", description: "그룹 퍼포먼스" },
        { id: "undecided", label: "아직 모르겠어요", description: "취향부터 확인하기" },
      ],
    },
    {
      id: "difficulty",
      title: "어느 정도 난이도가 좋나요?",
      description: "너무 어렵지 않은 콘텐츠를 추천하기 위한 조건이에요.",
      choices: [
        { id: "1", label: "표정·손동작만", description: "연습 없이 바로" },
        { id: "2", label: "쉬운 포인트 안무", description: "몇 번 보면 가능" },
        { id: "3", label: "조금 연습할 수 있어요", description: "일반 챌린지 안무" },
        { id: "4", label: "어려워도 제대로", description: "고난도 퍼포먼스" },
      ],
    },
  ],
  questions: reelsFitQuestions,
  profiles: reelsFitProfiles,
  scoring: { axisWeight: 0.75, tagWeight: 0.25, secondaryThreshold: 6 },
  theme: {
    primary: "#6D5DFB",
    secondary: "#FF6FAE",
    accent: "#FCEB5C",
    surface: "#FFFFFF",
    background: "#F7F7FB",
    text: "#15171C",
    muted: "#687385",
    emoji: "🎵",
  },
  landing: {
    eyebrow: "12 QUESTIONS · 8 TYPES",
    ctaLabel: "내 릴스 취향 알아보기",
    highlights: [
      { value: "12", label: "취향 질문" },
      { value: "8", label: "결과 유형" },
      { value: "4", label: "맞춤 추천" },
    ],
    notice: "결과는 재미와 콘텐츠 추천을 위한 참고용이에요.",
  },
};
