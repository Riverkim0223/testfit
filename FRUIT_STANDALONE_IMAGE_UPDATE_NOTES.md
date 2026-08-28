# 과일상 독립 이미지 업데이트 v1.4

## 변경 내용

- 기존 커플 이미지를 좌우로 잘라 사용하던 방식을 제거했습니다.
- 과일 8종 × 성별 2종, 총 16장을 각각 독립 이미지로 다시 생성했습니다.
- 결과 이미지가 잘리지 않도록 웹 결과 페이지와 공유 이미지 렌더러의 표시 방식을 `contain`으로 변경했습니다.
- 여성 헤어스타일을 과일별로 다르게 구성했습니다.
  - 복숭아: 긴 웨이브
  - 딸기: 긴 생머리
  - 사과: 자연스러운 미디엄 헤어
  - 체리: 우아한 업스타일
  - 레몬: 하이 포니테일
  - 자몽: 바람에 흩날리는 보브
  - 포도: 긴 웨이브
  - 수박: 긴 하프업
- 각 과일의 눈매, 메이크업, 입술색, 의상 컬러, 과일·꽃 배경을 차별화했습니다.
- 테스트 시작 시 선택한 성별은 기존과 동일하게 결과 페이지, OG 이미지, 피드/스토리 저장 이미지에 반영됩니다.

## 이미지 파일

`public/images/fruit-face/profiles/` 아래의 다음 16개 파일이 교체되었습니다.

- `peach-female.webp`, `peach-male.webp`
- `strawberry-female.webp`, `strawberry-male.webp`
- `apple-female.webp`, `apple-male.webp`
- `cherry-female.webp`, `cherry-male.webp`
- `lemon-female.webp`, `lemon-male.webp`
- `grapefruit-female.webp`, `grapefruit-male.webp`
- `grape-female.webp`, `grape-male.webp`
- `watermelon-female.webp`, `watermelon-male.webp`

모든 이미지는 768×768 WebP입니다.
