# Test Factory v1

하나의 공통 엔진으로 여러 질문형 테스트를 운영하는 Next.js App Router 프로젝트입니다.

현재 실제로 동작하는 테스트는 두 개입니다.

- **릴스핏**: 12문항, 4축·6태그, 8개 결과 유형, 검증 콘텐츠 30개를 이용한 4개 추천 슬롯
- **과일상 테스트**: 10문항, 4축, 8개 과일 유형, 컬러·스타일·궁합·반전 추천

## 실행

```bash
corepack enable
pnpm install
pnpm dev
```

npm을 사용하는 경우:

```bash
npm install
npm run dev
```

브라우저:

```text
http://localhost:3000
```

## 구현된 사용자 흐름

```text
테스트 목록
→ 테스트 소개
→ 사전 조건(필요한 테스트만)
→ 질문 진행
→ 점수 계산
→ 결과 유형 판정
→ 추천 콘텐츠
→ 링크 공유
→ 피드·스토리 이미지 저장
```

## 주요 URL

```text
/                                         테스트 목록
/tests/reels-fit                           릴스핏 소개
/tests/reels-fit/play                      릴스핏 진행
/tests/fruit-face                          과일상 소개
/tests/fruit-face/play                     과일상 진행
/tests/[testSlug]/result/[resultToken]      공유 가능한 결과
```

## DB가 없어도 결과 링크가 작동하는 이유

MVP에서는 답변 번호와 테스트 버전을 짧은 Base64URL 토큰으로 변환합니다.

```text
{ version, answers, preAnswers }
→ URL-safe token
→ 결과 페이지에서 검증
→ 점수와 결과를 다시 계산
```

그래서 링크를 다른 기기에서 열어도 같은 결과가 나옵니다.

이 토큰은 **인코딩일 뿐 암호화가 아닙니다.** 이름, 이메일, 건강 정보, 비밀 답변처럼 민감한 값은 넣지 마세요. 회원 기능이나 민감 데이터가 필요해지면 Prisma 저장 방식으로 교체해야 합니다.

## 프로젝트 구조

```text
app/
├─ page.tsx
├─ tests/[testSlug]/
│  ├─ page.tsx
│  ├─ play/page.tsx
│  └─ result/[resultToken]/
└─ api/tests/[testSlug]/results/[resultToken]/share-image/

components/test-factory/
├─ TestRunner.tsx
├─ TestResultPage.tsx
├─ RecommendationCard.tsx
└─ ResultShareActions.tsx

lib/test-factory/
├─ registry.ts
├─ token.ts
├─ scoring.ts
├─ result.ts
├─ recommendations.ts
├─ render-result-image.tsx
└─ types.ts

test-packs/
├─ reels-fit/
└─ fruit-face/
```

## Test Pack 구조

새 테스트는 `TestPack` 데이터로 정의합니다.

```ts
{
  slug,
  title,
  axes,
  questions,
  profiles,
  scoring,
  theme,
  landing
}
```

공통 질문 화면, 점수 계산, 결과 화면, 메타태그, 공유 및 이미지 저장 코드는 다시 만들지 않습니다.

새 테스트 추가 절차는 [`ADD_NEW_TEST.md`](./ADD_NEW_TEST.md)를 참고하세요.

## 릴스 콘텐츠 표시 정책

- 공식 Instagram 개별 게시물: 사용자가 누르면 공식 임베드 로드
- TikTok 개별 영상: 공식 플레이어
- 오디오·검색·모음 URL: 포스터 카드 후 원본 링크
- 자체 제작 또는 정식 허가 MP4: `owned-video` 모드

제3자 영상을 다운로드해 서버에 재업로드하는 방식은 기본 정책으로 사용하지 않습니다.

## 메타태그와 공유

- 테스트 소개 페이지: `index, follow`
- 개인 결과 페이지: `noindex, nofollow`
- 결과별 Open Graph·Twitter 이미지
- Web Share API
- 링크 복사 폴백
- 1080×1350 피드 이미지
- 1080×1920 스토리 이미지

배포 전 `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
```

한국어 공유 이미지에 별도 폰트가 필요하면 프로젝트에서 사용 권한이 있는 WOFF/WOFF2만 연결하세요.

```env
TEST_FACTORY_SHARE_FONT_URL=/fonts/your-korean-font-bold.woff2
```

폰트 파일은 이 프로젝트에 포함되어 있지 않습니다.

## 검증

이 패키지 제작 과정에서 다음을 확인했습니다.

- TypeScript 소스 검증 통과
- 릴스핏 가능한 답변 조합 4,096개 결과 분포 확인
- 과일상 가능한 답변 조합 1,024개 결과 분포 확인
- 릴스핏 사전 조건 20가지까지 조합한 총 81,920개 추천 결과 검사
- 모든 경우 4개 추천 슬롯 생성
- 결과 한 페이지 내 콘텐츠 ID 중복 0건
- 결과 토큰 인코딩·디코딩 확인

상세 내용은 [`VERIFICATION.md`](./VERIFICATION.md)를 확인하세요.

이 실행 환경에서는 패키지 레지스트리에 접근할 수 없어 실제 `pnpm install → next build`는 실행하지 못했습니다. 로컬에서 설치 후 다음 명령으로 최종 확인하세요.

```bash
pnpm typecheck
pnpm build
```
