# 과일상 성별별 결과 이미지 적용 안내

과일상 8개 유형에 여성·남성 버전 총 16장의 수채화 인물 일러스트를 연결했습니다.

## 사용자 흐름

```text
여성 또는 남성 선택
→ 10개 취향 질문
→ 과일상 결과 계산
→ 선택 성별의 결과 이미지 표시
```

성별 선택은 과일상 점수 계산에는 영향을 주지 않습니다. 결과에 표시할 인물 일러스트만 변경합니다.

## 이미지 위치

```text
public/images/fruit-face/profiles/
```

## 데이터 연결

- 사전 선택: `test-packs/fruit-face/index.ts`
- 결과 이미지 변형: `test-packs/fruit-face/profiles.ts`
- 공통 변형 처리: `lib/test-factory/result.ts`
- 타입: `lib/test-factory/types.ts`

## 자동 반영 위치

- 과일상 결과 페이지
- Open Graph 링크 미리보기
- 피드용 결과 이미지
- 스토리용 결과 이미지

새 의존성은 추가하지 않았습니다. 과일상 Test Pack 버전은 `2`로 올라갔기 때문에 기존 v1 과일상 결과 URL은 새 버전에서 열리지 않습니다.
