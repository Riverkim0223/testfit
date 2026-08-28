import type { ResultProfileDefinition } from "@/lib/test-factory/types";

export const reelsFitProfiles: ResultProfileDefinition[] = [
  {
    id: "soft-cute",
    title: "말랑 큐티형",
    emoji: "🫧",
    subtitle: "큰 동작보다 한 번의 귀여운 포인트가 더 강한 타입",
    description:
      "복잡한 안무보다 자연스러운 표정과 작은 손동작을 잘 살려요. 밝은 오디오와 가까운 구도에서 매력이 편안하게 드러나요.",
    axisTargets: { ENERGY: 25, SPOTLIGHT: 35, MOTION: 20, PRODUCTION: 30 },
    tagTargets: {
      CUTE: { value: 90, weight: 0.65 },
      EXPRESSION: { value: 60, weight: 0.35 },
    },
    strengths: ["귀여운 포인트", "쉬운 손동작", "자연스러운 표정"],
    shareText: "나는 말랑 큐티형 🫧 큰 동작 없이도 귀여운 포인트로 챌린지 완성!",
    illustration: {
      src: "/images/reels-fit/profiles/soft-cute.webp",
      alt: "스마트폰을 들고 가볍게 춤추는 말랑 큐티형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#FF7AA8", secondary: "#FFB86B", accent: "#FFF06A", emoji: "🫧" },
  },
  {
    id: "power-performer",
    title: "파워 퍼포머형",
    emoji: "⚡",
    subtitle: "에너지로 화면을 꽉 채우는 무대 체질",
    description:
      "빠른 비트와 큰 동작에서 매력이 살아나요. 완벽한 각도보다는 힘과 현장감으로 보는 사람의 시선을 붙잡는 편이에요.",
    axisTargets: { ENERGY: 90, SPOTLIGHT: 65, MOTION: 85, PRODUCTION: 30 },
    tagTargets: {
      PRECISION: { value: 25, weight: 0.7 },
      TRANSITION: { value: 20, weight: 0.3 },
    },
    strengths: ["큰 에너지", "전신 안무", "무대 장악력"],
    shareText: "나는 파워 퍼포머형 ⚡ 비트가 시작되면 화면을 꽉 채우는 타입!",
    illustration: {
      src: "/images/reels-fit/profiles/power-performer.webp",
      alt: "헤드폰을 쓰고 힘차게 춤추는 파워 퍼포머형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#FF5B45", secondary: "#FFB000", accent: "#FFF3A3", emoji: "⚡" },
  },
  {
    id: "spotlight-stealer",
    title: "시선 강탈형",
    emoji: "✨",
    subtitle: "짧은 영상도 내 킬링 파트로 바꾸는 타입",
    description:
      "포즈, 의상 변화, 카메라 워킹처럼 한눈에 들어오는 장치를 잘 활용해요. 한 장면 안에서도 존재감을 분명하게 남기는 편이에요.",
    axisTargets: { ENERGY: 70, SPOTLIGHT: 90, MOTION: 55, PRODUCTION: 80 },
    tagTargets: {
      TRANSITION: { value: 90, weight: 0.65 },
      EXPRESSION: { value: 65, weight: 0.35 },
    },
    strengths: ["킬링 파트", "의상 전환", "강한 포즈"],
    shareText: "나는 시선 강탈형 ✨ 짧은 영상이어도 킬링 파트는 내가 맡아야 해!",
    illustration: {
      src: "/images/reels-fit/profiles/spotlight-stealer.webp",
      alt: "스포트라이트 아래 자신 있게 포즈를 취하는 시선 강탈형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#6D5DFB", secondary: "#E456FF", accent: "#FCEB5C", emoji: "✨" },
  },
  {
    id: "detail-cute",
    title: "아기자기 디테일형",
    emoji: "🎀",
    subtitle: "작은 소품과 타이밍을 놓치지 않는 타입",
    description:
      "소품, 자막, 친구와 맞추는 작은 타이밍처럼 디테일에서 재미를 만들어요. 귀엽고 정성스러운 화면 구성이 잘 어울려요.",
    axisTargets: { ENERGY: 30, SPOTLIGHT: 40, MOTION: 20, PRODUCTION: 85 },
    tagTargets: {
      DETAIL: { value: 100, weight: 0.65 },
      CUTE: { value: 75, weight: 0.35 },
    },
    strengths: ["작은 소품", "귀여운 편집", "타이밍 연출"],
    shareText: "나는 아기자기 디테일형 🎀 작은 포인트까지 챙겨야 영상이 완성돼!",
    illustration: {
      src: "/images/reels-fit/profiles/detail-cute.webp",
      alt: "리본과 스티커 소품을 꾸미는 아기자기 디테일형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#FF76B8", secondary: "#9C7BFF", accent: "#FFF5A8", emoji: "🎀" },
  },
  {
    id: "precision-master",
    title: "칼각 완성형",
    emoji: "🎯",
    subtitle: "연습한 만큼 정확한 장면을 만드는 타입",
    description:
      "박자와 각도, 동선을 맞추는 과정 자체를 즐겨요. 어렵더라도 원본 안무를 제대로 재현했을 때 가장 큰 만족을 느끼는 편이에요.",
    axisTargets: { ENERGY: 90, SPOTLIGHT: 70, MOTION: 95, PRODUCTION: 60 },
    tagTargets: { PRECISION: { value: 100, weight: 1 } },
    strengths: ["반복 연습", "정확한 박자", "높은 완성도"],
    shareText: "나는 칼각 완성형 🎯 만족할 때까지 한 번 더! 정확한 안무가 제일 멋져.",
    illustration: {
      src: "/images/reels-fit/profiles/precision-master.webp",
      alt: "동작선을 맞추며 정확한 자세를 연습하는 칼각 완성형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#235BDE", secondary: "#26B7D8", accent: "#D9FF5B", emoji: "🎯" },
  },
  {
    id: "contrast-charmer",
    title: "반전 매력형",
    emoji: "🪄",
    subtitle: "부드럽게 시작해 한순간 분위기를 뒤집는 타입",
    description:
      "차분한 첫인상 뒤에 강한 표정이나 전환을 숨겨두는 구성이 잘 맞아요. 예상하지 못한 한 장면으로 기억에 남는 편이에요.",
    axisTargets: { ENERGY: 35, SPOTLIGHT: 90, MOTION: 30, PRODUCTION: 65 },
    tagTargets: {
      TRANSITION: { value: 100, weight: 0.7 },
      EXPRESSION: { value: 75, weight: 0.3 },
    },
    strengths: ["비트 드롭", "표정 반전", "변신 전환"],
    shareText: "나는 반전 매력형 🪄 차분한 줄 알았지? 한 장면으로 분위기를 뒤집는 타입!",
    illustration: {
      src: "/images/reels-fit/profiles/contrast-charmer.webp",
      alt: "밝고 시크한 두 가지 분위기를 함께 가진 반전 매력형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#20243A", secondary: "#EE4D88", accent: "#72F2D0", emoji: "🪄" },
  },
  {
    id: "expression-genius",
    title: "표정 천재형",
    emoji: "😏",
    subtitle: "큰 동작 없이도 표정 하나로 장면을 만드는 타입",
    description:
      "카메라 가까이에서 가사와 대사의 타이밍을 살리는 데 강해요. 립싱크, POV, 밈 오디오처럼 표정 변화가 핵심인 콘텐츠가 잘 맞아요.",
    axisTargets: { ENERGY: 45, SPOTLIGHT: 75, MOTION: 10, PRODUCTION: 30 },
    tagTargets: {
      EXPRESSION: { value: 100, weight: 0.8 },
      CUTE: { value: 25, weight: 0.2 },
    },
    strengths: ["립싱크", "표정 변화", "클로즈업"],
    shareText: "나는 표정 천재형 😏 전신 안무 없이도 표정 하나면 장면 완성!",
    illustration: {
      src: "/images/reels-fit/profiles/expression-genius.webp",
      alt: "카메라 앞에서 생동감 있는 표정을 짓는 표정 천재형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#6D5DFB", secondary: "#FF6FAE", accent: "#FCEB5C", emoji: "😏" },
  },
  {
    id: "mood-director",
    title: "무드 연출가형",
    emoji: "🎬",
    subtitle: "공간과 색감까지 하나의 장면으로 만드는 타입",
    description:
      "춤 자체보다 조명, 배경, 음악의 연결에 더 민감해요. 차분한 몽타주나 시네마틱 편집처럼 영상 전체의 분위기를 만드는 데 강해요.",
    axisTargets: { ENERGY: 30, SPOTLIGHT: 50, MOTION: 25, PRODUCTION: 95 },
    tagTargets: {
      MOOD: { value: 100, weight: 0.8 },
      DETAIL: { value: 35, weight: 0.2 },
    },
    strengths: ["공간 연출", "색감과 조명", "감성 편집"],
    shareText: "나는 무드 연출가형 🎬 공간과 색감까지 맞아야 진짜 내 영상!",
    illustration: {
      src: "/images/reels-fit/profiles/mood-director.webp",
      alt: "카메라와 색감 보드를 들고 장면을 연출하는 무드 연출가형 캐릭터",
      objectPosition: "center",
    },
    theme: { primary: "#4158D0", secondary: "#7A6CF6", accent: "#F8D16D", emoji: "🎬" },
  },
];
