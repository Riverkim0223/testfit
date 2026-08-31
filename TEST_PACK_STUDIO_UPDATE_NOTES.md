# Test Pack Studio v2 변경 사항

## 적용된 핵심 변경

- TypeScript Test Pack 대신 `content/test-packs/*/pack.json` 사용
- `/studio` 로컬 제작 화면 추가
- 테스트 복제·빈 템플릿 생성
- 축·태그·사전 선택·질문·결과 유형 편집
- 결과 추천 카드 편집
- 여성/남성 등 결과 이미지 버전 업로드
- 클라이언트 WebP 변환 및 여백 유지
- 결과 분포 전수/샘플 검사
- 누락·중복·점수 범위 검증
- 동물상 테스트 draft 추가
- Vercel 배포 환경에서 Studio 자동 비활성화
- 빈 `NEXT_PUBLIC_SITE_URL` 안전 폴백
- npm 기준 배포를 위해 packageManager pnpm 고정 제거

## 기존 프로젝트에 패치 적용 후

```bash
npm install
npm run validate:packs
npm run typecheck
npm run dev
```

Studio:

```text
http://localhost:3000/studio
```

## 주의

기존 `test-packs/` TypeScript 파일은 참고용으로 남아 있지만 더 이상 런타임 데이터가 아닙니다.
