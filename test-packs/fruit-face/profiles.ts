import type { ResultProfileDefinition } from "@/lib/test-factory/types";

export const fruitFaceProfiles: ResultProfileDefinition[] = [
  {
    id: "peach",
    title: "복숭아상",
    emoji: "🍑",
    subtitle: "부드럽고 사랑스러운 온기가 먼저 느껴지는 타입",
    description:
      "말투와 표정에서 편안함이 느껴지고, 가까워질수록 따뜻한 매력이 오래 남아요. 튀기보다 자연스럽게 호감을 쌓는 편이에요.",
    axisTargets: { BRIGHTNESS: 37, SOFTNESS: 71, UNIQUENESS: 26, ENERGY: 28 },
    strengths: ["따뜻한 첫인상", "부드러운 대화", "편안한 친근감"],
    shareText: "나는 복숭아상 🍑 부드럽고 사랑스러운 온기가 먼저 느껴지는 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/peach-female.webp",
      alt: "복숭아꽃과 긴 웨이브 헤어의 복숭아상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/peach-female.webp",
        alt: "복숭아꽃과 긴 웨이브 헤어의 복숭아상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/peach-male.webp",
        alt: "복숭아와 부드러운 웨이브 헤어의 복숭아상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#FF8FA3", secondary: "#FFC27A", accent: "#FFF3A7", emoji: "🍑" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "피치 코랄", value: "#FF8F86", emoji: "🎨", description: "얼굴 주변에 따뜻한 생기를 더해주는 부드러운 코랄 톤이에요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "소프트 캐주얼", emoji: "🧶", description: "부드러운 니트, 둥근 실루엣, 자연스러운 헤어처럼 편안한 디테일이 잘 맞아요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "포도상", emoji: "🍇", description: "차분한 포도상이 당신의 따뜻한 에너지를 안정적으로 받아줘요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "레몬상", emoji: "🍋", description: "톡 쏘는 레몬상과 만나면 평소보다 훨씬 활기찬 장면이 만들어져요." },
    ],
  },
  {
    id: "strawberry",
    title: "딸기상",
    emoji: "🍓",
    subtitle: "밝은 사랑스러움과 또렷한 포인트를 함께 가진 타입",
    description:
      "친근하게 다가오면서도 자신만의 귀여운 포인트가 분명해요. 표정이 풍부하고 주변 분위기를 산뜻하게 바꾸는 힘이 있어요.",
    axisTargets: { BRIGHTNESS: 71, SOFTNESS: 48, UNIQUENESS: 60, ENERGY: 60 },
    strengths: ["밝은 리액션", "사랑스러운 포인트", "산뜻한 에너지"],
    shareText: "나는 딸기상 🍓 밝고 사랑스럽지만 나만의 포인트도 확실한 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/strawberry-female.webp",
      alt: "딸기꽃과 긴 생머리의 딸기상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/strawberry-female.webp",
        alt: "딸기꽃과 긴 생머리의 딸기상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/strawberry-male.webp",
        alt: "딸기꽃과 산뜻한 흑갈색 헤어의 딸기상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#F04464", secondary: "#FF88A0", accent: "#FFF0A6", emoji: "🍓" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "베리 레드", value: "#E94662", emoji: "🎨", description: "밝은 표정과 선명한 매력을 동시에 살리는 생기 있는 레드예요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "리본 포인트 룩", emoji: "🎀", description: "기본 스타일에 작은 리본이나 반짝이는 포인트 하나를 더해보세요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "사과상", emoji: "🍎", description: "솔직하고 활기찬 사과상과 함께하면 편하고 즐거운 케미가 생겨요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "포도상", emoji: "🍇", description: "차분한 포도상과 만나면 당신의 발랄한 매력이 더 선명해져요." },
    ],
  },
  {
    id: "apple",
    title: "사과상",
    emoji: "🍎",
    subtitle: "맑고 건강한 에너지로 신뢰를 주는 타입",
    description:
      "솔직하고 친근한 분위기가 강하며, 복잡하게 꾸미지 않아도 생기 있는 인상이 남아요. 함께 있으면 자연스럽게 기분이 좋아져요.",
    axisTargets: { BRIGHTNESS: 69, SOFTNESS: 71, UNIQUENESS: 24, ENERGY: 70 },
    strengths: ["건강한 생기", "솔직한 매력", "편안한 활동성"],
    shareText: "나는 사과상 🍎 맑고 건강한 에너지로 주변까지 기분 좋게 만드는 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/apple-female.webp",
      alt: "사과꽃과 자연스러운 미디엄 헤어의 사과상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/apple-female.webp",
        alt: "사과꽃과 자연스러운 미디엄 헤어의 사과상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/apple-male.webp",
        alt: "사과꽃과 따뜻한 갈색 헤어의 사과상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#E94845", secondary: "#67B95B", accent: "#FFF4A8", emoji: "🍎" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "애플 레드", value: "#E7463F", emoji: "🎨", description: "맑고 활기찬 이미지를 가장 직접적으로 보여주는 컬러예요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "클린 스포티", emoji: "👟", description: "깔끔한 티셔츠, 데님, 선명한 포인트처럼 건강한 캐주얼이 잘 맞아요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "수박상", emoji: "🍉", description: "활동적인 수박상과 만나면 계획 없이도 즐거운 일이 계속 생겨요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "체리상", emoji: "🍒", description: "도회적인 체리상과 함께하면 당신의 담백한 매력이 새롭게 보여요." },
    ],
  },
  {
    id: "cherry",
    title: "체리상",
    emoji: "🍒",
    subtitle: "작지만 강한 포인트로 기억에 남는 타입",
    description:
      "말수가 많지 않아도 표정과 취향이 또렷해요. 친근함보다 개성 있는 첫인상이 먼저 느껴지고, 가까워지면 의외의 섬세함이 보여요.",
    axisTargets: { BRIGHTNESS: 43, SOFTNESS: 49, UNIQUENESS: 55, ENERGY: 33 },
    strengths: ["선명한 취향", "작은 카리스마", "기억에 남는 포인트"],
    shareText: "나는 체리상 🍒 작지만 강한 포인트로 한 번에 기억되는 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/cherry-female.webp",
      alt: "체리꽃과 우아한 업스타일 헤어의 체리상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/cherry-female.webp",
        alt: "체리꽃과 우아한 업스타일 헤어의 체리상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/cherry-male.webp",
        alt: "체리와 세련된 흑발 헤어의 체리상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#9E1738", secondary: "#E34769", accent: "#F9D96B", emoji: "🍒" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "딥 체리", value: "#991B3A", emoji: "🎨", description: "또렷한 눈빛과 세련된 분위기를 살리는 깊은 레드예요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "콤팩트 시크", emoji: "🕶️", description: "작은 액세서리나 날렵한 실루엣처럼 포인트가 명확한 스타일이 잘 맞아요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "자몽상", emoji: "🍊", description: "개성이 분명한 자몽상과 서로의 취향을 존중하는 조합이에요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "복숭아상", emoji: "🍑", description: "부드러운 복숭아상과 만나면 숨겨진 따뜻함이 자연스럽게 드러나요." },
    ],
  },
  {
    id: "lemon",
    title: "레몬상",
    emoji: "🍋",
    subtitle: "상큼하고 빠른 에너지로 공기를 바꾸는 타입",
    description:
      "생각과 반응이 빠르고, 분명한 표현으로 주변에 활력을 줘요. 가볍게 튀는 유머와 시원한 솔직함이 매력으로 느껴져요.",
    axisTargets: { BRIGHTNESS: 78, SOFTNESS: 38, UNIQUENESS: 59, ENERGY: 96 },
    strengths: ["빠른 리액션", "상큼한 솔직함", "분위기 전환"],
    shareText: "나는 레몬상 🍋 상큼하고 빠른 에너지로 공기를 바꾸는 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/lemon-female.webp",
      alt: "레몬과 밝은 하이 포니테일의 레몬상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/lemon-female.webp",
        alt: "레몬과 밝은 하이 포니테일의 레몬상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/lemon-male.webp",
        alt: "레몬과 산뜻한 브라운 헤어의 레몬상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#F4CF32", secondary: "#9CCF4A", accent: "#FFFFFF", emoji: "🍋" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "레몬 옐로", value: "#F4D63A", emoji: "🎨", description: "당신의 산뜻한 에너지를 숨김없이 보여주는 맑은 옐로예요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "크리스프 스포티", emoji: "🧢", description: "선명한 배색과 가벼운 스포츠 디테일이 빠른 분위기와 잘 맞아요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "수박상", emoji: "🍉", description: "에너지가 비슷한 수박상과 만나면 어디서든 바로 재미가 시작돼요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "포도상", emoji: "🍇", description: "차분한 포도상이 속도를 조절해줘서 의외로 균형이 좋아요." },
    ],
  },
  {
    id: "grapefruit",
    title: "자몽상",
    emoji: "🍊",
    subtitle: "쌉싸름한 세련미와 독립적인 매력을 가진 타입",
    description:
      "무조건 밝거나 부드럽기보다 자신만의 기준이 분명해요. 솔직하고 담백한 태도가 처음에는 시크하게, 나중에는 믿음직하게 느껴져요.",
    axisTargets: { BRIGHTNESS: 43, SOFTNESS: 25, UNIQUENESS: 77, ENERGY: 54 },
    strengths: ["독립적인 취향", "담백한 솔직함", "세련된 선명함"],
    shareText: "나는 자몽상 🍊 쌉싸름한 세련미와 독립적인 매력이 있는 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/grapefruit-female.webp",
      alt: "자몽과 바람에 흩날리는 보브 헤어의 자몽상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/grapefruit-female.webp",
        alt: "자몽과 바람에 흩날리는 보브 헤어의 자몽상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/grapefruit-male.webp",
        alt: "자몽과 세련된 흑갈색 헤어의 자몽상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#F26D4A", secondary: "#FF9D74", accent: "#FFE77B", emoji: "🍊" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "자몽 코랄", value: "#F16D5B", emoji: "🎨", description: "과하지 않으면서도 개성을 선명하게 남기는 따뜻한 코랄이에요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "미니멀 시크", emoji: "🧥", description: "불필요한 장식보다 실루엣과 소재가 또렷한 스타일이 잘 맞아요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "체리상", emoji: "🍒", description: "서로의 강한 취향을 간섭하지 않고 흥미롭게 존중하는 조합이에요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "복숭아상", emoji: "🍑", description: "부드러운 복숭아상과 만나면 평소 보이지 않던 따뜻함이 드러나요." },
    ],
  },
  {
    id: "grape",
    title: "포도상",
    emoji: "🍇",
    subtitle: "차분하고 깊은 분위기로 천천히 호감을 쌓는 타입",
    description:
      "처음에는 조용해 보여도 생각과 감정의 결이 풍부해요. 안정적인 말투와 섬세한 배려로 오래 볼수록 매력이 커져요.",
    axisTargets: { BRIGHTNESS: 20, SOFTNESS: 48, UNIQUENESS: 58, ENERGY: 5 },
    strengths: ["차분한 안정감", "깊은 대화", "섬세한 배려"],
    shareText: "나는 포도상 🍇 차분하고 깊은 분위기로 천천히 호감을 쌓는 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/grape-female.webp",
      alt: "포도 덩굴과 긴 웨이브 헤어의 포도상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/grape-female.webp",
        alt: "포도 덩굴과 긴 웨이브 헤어의 포도상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/grape-male.webp",
        alt: "포도 덩굴과 차분한 웨이브 헤어의 포도상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#6747A8", secondary: "#9A72CC", accent: "#F0D96A", emoji: "🍇" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "딥 퍼플", value: "#6747A8", emoji: "🎨", description: "차분한 깊이와 섬세한 분위기를 살리는 안정적인 퍼플이에요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "레이어드 클래식", emoji: "📚", description: "톤이 깊은 니트와 차분한 레이어처럼 천천히 볼수록 멋진 스타일이 잘 맞아요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "복숭아상", emoji: "🍑", description: "따뜻한 복숭아상과 함께하면 편안하고 깊은 대화가 자연스럽게 이어져요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "레몬상", emoji: "🍋", description: "빠른 레몬상이 새로운 경험을 열어주고 당신은 그 관계에 안정감을 더해요." },
    ],
  },
  {
    id: "watermelon",
    title: "수박상",
    emoji: "🍉",
    subtitle: "시원하고 큼직한 에너지로 사람을 모으는 타입",
    description:
      "생각보다 행동이 빠르고, 함께하는 즐거움을 크게 느껴요. 복잡한 계산 없이 시원하게 표현하는 태도가 주변 사람에게 편안함을 줘요.",
    axisTargets: { BRIGHTNESS: 48, SOFTNESS: 45, UNIQUENESS: 44, ENERGY: 71 },
    strengths: ["시원한 행동력", "함께하는 즐거움", "꾸밈없는 표현"],
    shareText: "나는 수박상 🍉 시원하고 큼직한 에너지로 사람을 모으는 타입!",
    illustration: {
      src: "/images/fruit-face/profiles/watermelon-female.webp",
      alt: "수박과 긴 하프업 헤어의 수박상 여성 수채화 일러스트",
      objectPosition: "center",
    },
    illustrationVariants: {
      female: {
        src: "/images/fruit-face/profiles/watermelon-female.webp",
        alt: "수박과 긴 하프업 헤어의 수박상 여성 수채화 일러스트",
        objectPosition: "center",
      },
      male: {
        src: "/images/fruit-face/profiles/watermelon-male.webp",
        alt: "수박과 편안한 흑갈색 헤어의 수박상 남성 수채화 일러스트",
        objectPosition: "center",
      },
    },
    theme: { primary: "#EF4B57", secondary: "#47A85C", accent: "#FFF3A5", emoji: "🍉" },
    recommendations: [
      { slotId: "COLOR", kicker: "찰떡 컬러", title: "워터멜론 레드", value: "#EF4B57", emoji: "🎨", description: "활동적인 생기와 꾸밈없는 매력을 동시에 보여주는 컬러예요." },
      { slotId: "STYLE", kicker: "잘 어울리는 무드", title: "볼드 캐주얼", emoji: "🧢", description: "넉넉한 실루엣과 선명한 포인트처럼 움직이기 편하고 시원한 스타일이 잘 맞아요." },
      { slotId: "BEST_MATCH", kicker: "잘 맞는 과일상", title: "사과상", emoji: "🍎", description: "활동적인 사과상과 만나면 계획 없이도 즐거운 하루가 완성돼요." },
      { slotId: "CONTRAST", kicker: "반전 조합", title: "포도상", emoji: "🍇", description: "차분한 포도상이 속도를 정리해줘서 서로에게 필요한 균형이 생겨요." },
    ],
  },
];
