# Test Factory v2 — Local Test Pack Studio

하나의 Next.js 공통 엔진으로 릴스핏, 과일상, 동물상 같은 질문형 테스트를 반복 생산하는 프로젝트입니다.

## 현재 구성

- **릴스핏**: 공개, 12문항·8유형·릴스/오디오 추천
- **과일상 테스트**: 공개, 여성/남성 결과 이미지, 10문항·8유형
- **동물상 테스트**: 초안, 10문항·8유형, Studio에서 문구·점수·이미지 검수 후 공개
- **Test Pack Studio**: 로컬에서 질문, 점수, 결과, 추천, 이미지, 테마를 편집하고 JSON에 저장

## 실행

Windows 권한 문제를 피하려면 npm을 권장합니다.

```bash
npm install
npm run dev
```

브라우저:

```text
http://localhost:3000          서비스 화면
http://localhost:3000/studio   로컬 Test Pack Studio
```

## Studio 사용 흐름

```text
/studio 접속
→ 기존 테스트 복제 또는 빈 템플릿 생성
→ 기본 정보·축·질문·결과 유형 입력
→ 성별/조건별 이미지 업로드
→ 결과 분포와 누락 검사
→ 프로젝트에 저장
→ git add .
→ git commit
→ git push
→ Vercel 자동 배포
```

Studio에서 저장하면 다음 파일이 실제 프로젝트에 기록됩니다.

```text
content/test-packs/[testSlug]/pack.json
public/images/[testSlug]/profiles/*.webp
```

이미지는 브라우저에서 1200×1200 WebP로 변환되며 원본 비율을 유지한 채 여백을 넣어 인물 잘림을 줄입니다.

## 중요한 운영 원칙

Studio는 **로컬 전용**입니다. Vercel 배포 환경에서는 `/studio`와 `/api/studio/*`가 기본적으로 열리지 않습니다. 제작 내용은 로컬 파일로 저장한 뒤 Git으로 배포합니다.

## JSON 기반 구조

테스트의 질문·결과·테마는 TypeScript가 아니라 JSON에서 읽습니다.

```text
content/test-packs/
├─ reels-fit/pack.json
├─ fruit-face/pack.json
├─ animal-face/pack.json
└─ _template/pack.json
```

공통 엔진이 JSON을 읽어 다음 기능을 자동 생성합니다.

- 메인 테스트 카드
- 소개 페이지
- 사전 선택
- 질문 진행
- 점수 계산
- 결과 유형 판정
- 성별/조건별 이미지
- 결과 추천
- 메타태그와 Open Graph 이미지
- 링크 공유
- 피드·스토리 이미지 저장
- sitemap

## 테스트팩 검증

```bash
npm run validate:packs
npm run typecheck
npm run build
```

한 번에 확인:

```bash
npm run check
```

`validate:packs`는 다음을 검사합니다.

- 중복 ID와 누락 필드
- 잘못된 축·태그 점수
- 결과 이미지 누락
- 결과 유형이 실제 응답에서 생성되는지
- 특정 결과로 과도하게 쏠리는지

## 배포 환경 변수

```env
NEXT_PUBLIC_SITE_URL=https://testfit-black.vercel.app
```

빈 문자열이어도 Vercel 자동 도메인 또는 localhost로 안전하게 폴백하도록 보강되어 있습니다.

## 기존 TypeScript Test Pack

`test-packs/` 폴더는 이전 버전 참고용으로 남아 있지만 런타임의 기준 데이터는 아닙니다. 앞으로는 `content/test-packs/*/pack.json`과 Studio를 사용하세요.

## 새 테스트 제작

자세한 과정은 [`ADD_NEW_TEST.md`](./ADD_NEW_TEST.md)를 참고하세요.
