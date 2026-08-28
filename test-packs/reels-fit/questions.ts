import type { TestQuestionDefinition } from "@/lib/test-factory/types";

export const reelsFitQuestions: TestQuestionDefinition[] = [
  {
    id: "shoot-ready",
    order: 1,
    eyebrow: "촬영 준비",
    text: "촬영 버튼을 누르기 직전, 더 마음이 편한 쪽은?",
    options: [
      {
        id: "natural-first-take",
        label: "일단 한 번 찍어보고 자연스러운 장면을 건진다.",
        axisScores: { PRODUCTION: -2 },
      },
      {
        id: "plan-before-shoot",
        label: "음악을 몇 번 들어보고 포인트와 순서를 맞춘다.",
        axisScores: { PRODUCTION: 2 },
        tagScores: { PRECISION: 1 },
      },
    ],
  },
  {
    id: "chorus-energy",
    order: 2,
    eyebrow: "에너지",
    text: "후렴 10초를 내 장면으로 만든다면?",
    options: [
      {
        id: "big-movement",
        label: "비트에 맞춰 크게 움직이며 화면을 꽉 채운다.",
        axisScores: { ENERGY: 2, MOTION: 1 },
      },
      {
        id: "soft-expression",
        label: "고개와 어깨, 표정만으로 분위기를 살린다.",
        axisScores: { ENERGY: -2, MOTION: -1 },
        tagScores: { CUTE: 1, EXPRESSION: 1 },
      },
    ],
  },
  {
    id: "group-role",
    order: 3,
    eyebrow: "존재감",
    text: "친구들과 함께 찍을 때 더 끌리는 역할은?",
    options: [
      {
        id: "killing-part",
        label: "기억에 남는 킬링 파트를 맡는다.",
        axisScores: { SPOTLIGHT: 2 },
        tagScores: { EXPRESSION: 1 },
      },
      {
        id: "natural-flow",
        label: "다 같이 자연스럽게 어울리는 흐름을 만든다.",
        axisScores: { SPOTLIGHT: -2 },
      },
    ],
  },
  {
    id: "camera-frame",
    order: 4,
    eyebrow: "촬영 구도",
    text: "완성된 영상에서 더 보고 싶은 구도는?",
    options: [
      {
        id: "full-body",
        label: "발끝까지 동작이 보이는 넓은 화면",
        axisScores: { MOTION: 2 },
        tagScores: { PRECISION: 1 },
      },
      {
        id: "close-up",
        label: "얼굴과 손동작이 잘 보이는 가까운 화면",
        axisScores: { MOTION: -2 },
        tagScores: { EXPRESSION: 2 },
      },
    ],
  },
  {
    id: "hard-challenge",
    order: 5,
    eyebrow: "완성 방식",
    text: "마음에 든 챌린지가 조금 어렵다면?",
    options: [
      {
        id: "repeat-original",
        label: "원본 동작을 반복해서 최대한 정확히 맞춘다.",
        axisScores: { MOTION: 1 },
        tagScores: { PRECISION: 2 },
      },
      {
        id: "adapt-highlight",
        label: "재미있는 포인트만 골라 내 방식으로 바꾼다.",
        axisScores: { MOTION: -1 },
        tagScores: { EXPRESSION: 1 },
      },
    ],
  },
  {
    id: "outfit",
    order: 6,
    eyebrow: "의상",
    text: "촬영 의상을 고른다면?",
    options: [
      {
        id: "statement-transition",
        label: "한눈에 들어오는 포인트 의상이나 변신 구성을 준비한다.",
        axisScores: { SPOTLIGHT: 1, PRODUCTION: 1 },
        tagScores: { TRANSITION: 2 },
      },
      {
        id: "natural-style",
        label: "평소 스타일을 살려 영상 분위기와 자연스럽게 맞춘다.",
        axisScores: { SPOTLIGHT: -1, PRODUCTION: -1 },
        tagScores: { MOOD: 1 },
      },
    ],
  },
  {
    id: "favorite-comment",
    order: 7,
    eyebrow: "반응",
    text: "영상에 달리면 더 기분 좋은 댓글은?",
    options: [
      {
        id: "great-vibe",
        label: "영상 분위기가 너무 좋다.",
        axisScores: { SPOTLIGHT: -2 },
        tagScores: { MOOD: 1 },
      },
      {
        id: "only-you",
        label: "영상에서 너밖에 안 보인다.",
        axisScores: { SPOTLIGHT: 2 },
        tagScores: { EXPRESSION: 1 },
      },
    ],
  },
  {
    id: "location",
    order: 8,
    eyebrow: "공간",
    text: "촬영 장소는 어떻게 고를까?",
    options: [
      {
        id: "concept-location",
        label: "노래와 콘셉트에 맞는 배경과 작은 소품을 찾는다.",
        axisScores: { PRODUCTION: 2 },
        tagScores: { DETAIL: 1, MOOD: 1 },
      },
      {
        id: "shoot-here",
        label: "지금 있는 곳에서 바로 찍을 수 있으면 충분하다.",
        axisScores: { PRODUCTION: -2 },
      },
    ],
  },
  {
    id: "one-more-element",
    order: 9,
    eyebrow: "디테일",
    text: "영상에 딱 하나만 더할 수 있다면?",
    options: [
      {
        id: "lighting-color",
        label: "조명과 색감, 배경으로 전체 분위기를 만든다.",
        tagScores: { MOOD: 2 },
      },
      {
        id: "cute-detail",
        label: "작은 소품이나 귀여운 자막으로 포인트를 준다.",
        tagScores: { CUTE: 2, DETAIL: 2 },
      },
    ],
  },
  {
    id: "audio-point",
    order: 10,
    eyebrow: "오디오",
    text: "더 끌리는 오디오 포인트는?",
    options: [
      {
        id: "beat-drop",
        label: "비트가 터지는 순간에 동작이 크게 바뀌는 구간",
        axisScores: { ENERGY: 1, MOTION: 1 },
        tagScores: { TRANSITION: 1 },
      },
      {
        id: "lyric-expression",
        label: "가사나 대사에 맞춰 표정이 바뀌는 구간",
        axisScores: { ENERGY: -1, MOTION: -1 },
        tagScores: { EXPRESSION: 2 },
      },
    ],
  },
  {
    id: "retake-standard",
    order: 11,
    eyebrow: "촬영 완료",
    text: "다시 찍을지 말지 결정하는 기준은?",
    options: [
      {
        id: "natural-enough",
        label: "조금 틀려도 표정과 분위기가 자연스러우면 끝낸다.",
        tagScores: { EXPRESSION: 1, MOOD: 1 },
      },
      {
        id: "one-more-time",
        label: "박자와 각도가 맞을 때까지 한 번 더 찍는다.",
        tagScores: { PRECISION: 2 },
      },
    ],
  },
  {
    id: "video-flow",
    order: 12,
    eyebrow: "최종 무드",
    text: "더 찍어보고 싶은 영상 흐름은?",
    options: [
      {
        id: "contrast-turn",
        label: "차분하게 시작했다가 한순간 분위기가 뒤집히는 구성",
        axisScores: { ENERGY: 1, SPOTLIGHT: 1 },
        tagScores: { TRANSITION: 2 },
      },
      {
        id: "soft-all-way",
        label: "처음부터 끝까지 부드럽고 사랑스러운 무드를 유지하는 구성",
        axisScores: { ENERGY: -1, SPOTLIGHT: -1 },
        tagScores: { MOOD: 2, CUTE: 1 },
      },
    ],
  },
];
