import type { TestQuestionDefinition } from "@/lib/test-factory/types";

export const fruitFaceQuestions: TestQuestionDefinition[] = [
  {
    id: "weekend",
    order: 1,
    eyebrow: "주말 무드",
    text: "오랜만에 아무 일정 없는 주말, 더 끌리는 쪽은?",
    options: [
      {
        id: "slow-brunch",
        label: "조용한 곳에서 천천히 브런치를 즐긴다.",
        axisScores: { ENERGY: -2, SOFTNESS: 1 },
      },
      {
        id: "busy-outing",
        label: "새로운 장소를 찾아 밖으로 바로 나간다.",
        axisScores: { ENERGY: 2, BRIGHTNESS: 1 },
      },
    ],
  },
  {
    id: "first-impression",
    order: 2,
    eyebrow: "첫인상",
    text: "처음 만난 사람에게 남기고 싶은 인상은?",
    options: [
      {
        id: "warm-gentle",
        label: "편안하고 부드럽게 다가오는 사람",
        axisScores: { SOFTNESS: 2, UNIQUENESS: -1 },
      },
      {
        id: "clear-memorable",
        label: "선명하고 한 번에 기억되는 사람",
        axisScores: { SOFTNESS: -2, UNIQUENESS: 1 },
      },
    ],
  },
  {
    id: "group-role",
    order: 3,
    eyebrow: "사람들 사이에서",
    text: "여럿이 모였을 때 나는 보통?",
    options: [
      {
        id: "listen-smile",
        label: "이야기를 잘 들어주며 편한 분위기를 만든다.",
        axisScores: { ENERGY: -1, SOFTNESS: 1 },
      },
      {
        id: "mood-maker",
        label: "먼저 말을 꺼내고 분위기를 활기차게 만든다.",
        axisScores: { ENERGY: 1, BRIGHTNESS: 2 },
      },
    ],
  },
  {
    id: "outfit-color",
    order: 4,
    eyebrow: "스타일",
    text: "평소 옷을 고를 때 더 자주 손이 가는 쪽은?",
    options: [
      {
        id: "neutral-classic",
        label: "어디에나 잘 어울리는 편안한 기본 컬러",
        axisScores: { UNIQUENESS: -2, SOFTNESS: 1 },
      },
      {
        id: "point-color",
        label: "한 가지 포인트가 확실한 컬러나 디자인",
        axisScores: { UNIQUENESS: 2, BRIGHTNESS: 1 },
      },
    ],
  },
  {
    id: "favorite-compliment",
    order: 5,
    eyebrow: "매력 포인트",
    text: "더 듣고 싶은 칭찬은?",
    options: [
      {
        id: "comfortable-person",
        label: "같이 있으면 편안하고 마음이 놓여.",
        axisScores: { SOFTNESS: 2, UNIQUENESS: -1 },
      },
      {
        id: "your-own-style",
        label: "너만의 분위기가 확실해서 멋있어.",
        axisScores: { UNIQUENESS: 2, SOFTNESS: -1 },
      },
    ],
  },
  {
    id: "plan-style",
    order: 6,
    eyebrow: "행동 속도",
    text: "갑자기 재미있는 제안을 받았다면?",
    options: [
      {
        id: "think-first",
        label: "일정과 상황을 생각해본 뒤 결정한다.",
        axisScores: { ENERGY: -2 },
      },
      {
        id: "go-now",
        label: "재미있어 보이면 일단 해보고 생각한다.",
        axisScores: { ENERGY: 2, BRIGHTNESS: 1 },
      },
    ],
  },
  {
    id: "photo-expression",
    order: 7,
    eyebrow: "사진 속 나",
    text: "사진을 찍을 때 더 나답다고 느끼는 표정은?",
    options: [
      {
        id: "soft-smile",
        label: "눈웃음이 보이는 자연스럽고 부드러운 미소",
        axisScores: { SOFTNESS: 2, BRIGHTNESS: 1 },
      },
      {
        id: "cool-gaze",
        label: "표정은 작지만 분위기가 또렷한 시선",
        axisScores: { SOFTNESS: -2, UNIQUENESS: 1 },
      },
    ],
  },
  {
    id: "gift-wrap",
    order: 8,
    eyebrow: "디테일 취향",
    text: "선물을 준비할 때 더 중요한 것은?",
    options: [
      {
        id: "classic-safe",
        label: "누구나 좋아할 만한 깔끔하고 안정적인 구성",
        axisScores: { UNIQUENESS: -2, SOFTNESS: 1 },
      },
      {
        id: "quirky-detail",
        label: "상대가 기억할 만한 작은 반전과 독특한 디테일",
        axisScores: { UNIQUENESS: 2 },
      },
    ],
  },
  {
    id: "disagreement",
    order: 9,
    eyebrow: "대화 방식",
    text: "의견이 다를 때 더 가까운 모습은?",
    options: [
      {
        id: "round-words",
        label: "상대가 편하게 들을 수 있도록 부드럽게 말한다.",
        axisScores: { SOFTNESS: 2 },
      },
      {
        id: "clear-words",
        label: "핵심을 분명하게 말해야 오해가 적다고 생각한다.",
        axisScores: { SOFTNESS: -2, UNIQUENESS: 1 },
      },
    ],
  },
  {
    id: "flavor",
    order: 10,
    eyebrow: "마지막 취향",
    text: "지금 하나를 고른다면 더 끌리는 맛은?",
    options: [
      {
        id: "sweet-familiar",
        label: "달콤하고 익숙해서 자꾸 손이 가는 맛",
        axisScores: { SOFTNESS: 1, BRIGHTNESS: 1, UNIQUENESS: -1 },
      },
      {
        id: "tangy-fresh",
        label: "상큼하고 톡 쏘아 한 번에 기분이 바뀌는 맛",
        axisScores: { SOFTNESS: -1, UNIQUENESS: 1, ENERGY: 1 },
      },
    ],
  },
];
