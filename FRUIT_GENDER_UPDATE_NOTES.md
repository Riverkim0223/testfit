# 과일상 성별 선택 업데이트

## 변경 내용

- 과일상 시작 단계에 여성·남성 선택 추가
- 여성 8장, 남성 8장 결과 이미지 추가
- 복숭아·딸기·포도·자몽 여성 이미지는 긴 웨이브 또는 긴 생머리 스타일 적용
- 과일별 눈매, 색조, 입술색, 헤어스타일, 액세서리 차별화
- 선택한 성별을 결과 페이지와 공유 이미지에 동일하게 반영
- 성별 선택은 점수 계산에서 제외
- 과일상 Test Pack 버전 `1 → 2`

## 재사용 구조

`TestChoice.resultVariant`와 `ResultProfileDefinition.illustrationVariants`를 추가했습니다.

```ts
choices: [
  { id: "female", resultVariant: "female" },
  { id: "male", resultVariant: "male" },
]

illustrationVariants: {
  female: { src: "...-female.webp", alt: "..." },
  male: { src: "...-male.webp", alt: "..." },
}
```

이 구조는 이후 다른 테스트에서도 스타일, 연령대, 캐릭터 버전 등 결과 이미지 변형에 재사용할 수 있습니다.
