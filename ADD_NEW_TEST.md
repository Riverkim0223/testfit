# 새 테스트 추가 가이드

## 1. 기존 Test Pack 복사

예를 들어 `동물상 테스트`를 추가한다면:

```text
test-packs/animal-face/
├─ index.ts
├─ questions.ts
└─ profiles.ts
```

`fruit-face`를 복사하면 가장 빠릅니다.

## 2. 축 정의

3~5개를 권장합니다.

```ts
axes: [
  { id: "WARMTH", label: "따뜻함", lowLabel: "도도함", highLabel: "다정함" },
  { id: "ENERGY", label: "활동성", lowLabel: "차분함", highLabel: "활동적" },
]
```

## 3. 질문 작성

각 선택지는 축에 점수를 더하거나 뺍니다.

```ts
{
  id: "weekend",
  order: 1,
  text: "주말에 더 끌리는 쪽은?",
  options: [
    { id: "home", label: "집에서 충전", axisScores: { ENERGY: -2 } },
    { id: "outside", label: "밖에서 활동", axisScores: { ENERGY: 2 } },
  ],
}
```

점수 범위는 꼭 `-2~2`일 필요는 없지만 한 테스트 안에서는 일관되게 유지하세요.

## 4. 결과 유형 작성

```ts
{
  id: "puppy",
  title: "강아지상",
  emoji: "🐶",
  subtitle: "밝고 친근한 에너지가 먼저 보이는 타입",
  description: "...",
  axisTargets: { WARMTH: 85, ENERGY: 75 },
  strengths: ["친근함", "밝은 반응", "편한 분위기"],
  shareText: "나는 강아지상 🐶 ...",
  recommendations: [...]
}
```

`axisTargets`는 0~100 값입니다. 가능한 응답을 대량 생성해 결과가 한 유형에 몰리지 않는지 확인하는 것이 좋습니다.

## 5. Registry 등록

`lib/test-factory/registry.ts`에 import와 배열 항목을 추가합니다.

```ts
import { animalFacePack } from "@/test-packs/animal-face";

export const testPacks = [
  reelsFitPack,
  fruitFacePack,
  animalFacePack,
] as const;
```

이것만으로 다음 공통 기능이 자동 적용됩니다.

- 메인 테스트 카드
- 테스트 소개
- 질문 진행
- 결과 계산
- 결과 페이지
- Open Graph 이미지
- 링크 공유
- 피드·스토리 이미지 저장
- sitemap

## 6. 추천 방식 선택

일반 테스트는 결과 유형의 `recommendations`를 그대로 사용합니다.

외부 콘텐츠를 점수로 매칭해야 하는 테스트는 `lib/test-factory/recommendations.ts`에 해당 Test Pack용 추천 빌더를 추가합니다.

## 7. 버전 관리

질문, 선택지 점수, 결과 기준을 바꾸면 `version`을 올리세요.

```ts
version: 2
```

현재 MVP는 Registry에 최신 버전만 보관합니다. 기존 공유 링크를 영구 유지해야 할 때는 버전별 Test Pack Registry 또는 DB 결과 스냅샷 저장을 추가하세요.
