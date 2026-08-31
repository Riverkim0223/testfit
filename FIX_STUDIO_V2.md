# Studio v2 설치 / TS7006 수정 패치

## 수정 내용

이전 배포 ZIP의 `verification/stubs.d.ts`가 React/Next.js/Node.js의 임시 타입을 전역으로 선언하고 있었습니다.
실제 `tsconfig.json`이 이 파일까지 읽어 `node:fs`를 `any`로 처리했으며,
`content-store.server.ts`의 entry, a, b에서 TS7006 4건이 발생했습니다.
이전의 `tsconfig.verify.json`은 `noImplicitAny: false`였으므로 실제 프로젝트 검사보다 느슨했습니다.
이번에는 이 우회 설정을 없애고 설치된 실제 패키지 타입을 사용합니다.

npm 오류는 로그의 `node_modules/.pnpm/...`과 `isDescendantOf`를 근거로,
pnpm이 만든 설치 폴더를 npm이 다시 처리하다가 실패한 경우를 우선 의심합니다.
사용자 PC의 전체 npm debug 로그를 읽은 것은 아닙니다.

## 적용 (Windows 명령 프롬프트)

1. 실행 중인 개발 서버를 `Ctrl + C`로 종료합니다.
2. 직접 수정한 아래 파일이 있다면 먼저 백업합니다.
3. 이 ZIP의 내용물을 `package.json`이 있는 프로젝트 폴더에 덮어씁니다.
   예: `C:\Users\superstart\reelsfit`
   폴더 안에 패치 폴더를 한 번 더 만드는 것이 아니라, `lib`, `scripts`, `verification`, `tsconfig.json`을 루트에 병합합니다.
4. 프로젝트 루트에서 실행합니다.

```bat
cd /d C:\Users\superstart\reelsfit
node scripts/repair-npm-install.mjs --apply && npm install
```

설치가 성공한 뒤 실행합니다. `&&`는 앞 단계가 실패했을 때 다음 단계가 실행되지 않게 합니다.

```bat
npm run validate:packs && npm run typecheck && npm run build
```

모두 통과하면 개발 서버를 실행합니다.

```bat
npm run dev
```

Studio: `http://localhost:3000/studio`

## 설치 정리 스크립트의 범위

- 프로젝트 이름과 루트 위치를 확인한 뒤 실행합니다.
- `node_modules`(그 안의 `.pnpm` 포함), `.next`, TypeScript 증분 캐시만 삭제합니다.
- 루트의 `pnpm-lock.yaml`은 `.reelsfit-repair-backups/`에 `.bak`로 이동합니다.
- 정상적인 `package-lock.json`은 유지합니다.
- `package-lock.json`에 `.pnpm` 설치 경로가 들어 있거나 JSON이 손상된 경우에만 백업 이동해 npm이 다시 생성하게 합니다.
- 테스트 질문/결과 JSON, 이미지, `.env.local`, 앱 소스와 `package.json`은 수정하거나 삭제하지 않습니다.
- npm 전역 캐시나 Windows의 Node.js 설치 경로는 건드리지 않습니다.
- 패키지를 설치하거나 빌드를 실행하는 것은 스크립트가 아니라 뒤의 `npm install` / `npm run build` 명령입니다.
- 작업 예정 항목만 보려면 `node scripts/repair-npm-install.mjs`로 실행합니다 (`--apply` 없음).
- `--reset-lock`는 정상 npm lock도 백업 후 재생성해야 할 때만 선택적으로 추가하는 옵션이며 기본 적용에는 사용하지 않습니다.

EPERM/EBUSY가 나오면 이 프로젝트의 개발 서버와 `node_modules`를 사용 중인 터미널을 닫고 다시 실행하세요.
강제 패키지 설치 옵션(`--force`, `--legacy-peer-deps`)으로 우회하지 않습니다.

## 코드 / 설정 변경 파일

- `tsconfig.json`: `verification` 폴더를 실제 빌드 타입 검사에서 제외합니다. `strict`는 유지합니다.
- `verification/stubs.d.ts`: 임시 전역 선언을 지우고 `export {}`만 있는 호환용 빈 파일로 교체합니다.
- `tsconfig.verify.json`: 실제 `tsconfig.json`을 상속합니다. `noImplicitAny: false` 및 가짜 타입 우회를 없앴습니다.
- `lib/test-factory/content-store.server.ts`: `Dirent[]`, `StoredTestPack[]`로 디렉터리 목록과 변환 결과 타입을 명시합니다. 목록 처리 기능은 그대로 유지합니다.
- `scripts/repair-npm-install.mjs`: 위의 설치 폴더 정리 도구입니다.

`package.json`, `content/`, `public/`은 이 패치에 포함하지 않습니다.

## 검증 범위

- 원본 코드 + 원본 임시 타입에서 사용자와 동일한 TS7006 4건을 재현했습니다.
- 수정 모듈과 연결된 types/scoring/validation을 실제 `@types/node`로 검사했습니다 (`strict: true`, `skipLibCheck: false`). 통과했습니다.
- 실제 TypeScript 설정에서 `strict`와 `noImplicitAny`가 켜져 있고 임시 타입이 포함되지 않음을 확인했습니다.
- 제공된 테스트팩 3개 검증: `OK (0 warnings)`.
- 설치 정리 도구 / 목록 조회 회귀 테스트: 8개 통과.
- Windows PC에서 스크립트를 직접 실행한 것은 아니며 회귀 테스트는 Linux + Node.js 환경에서 실행했습니다.
- 이 환경에서 npm 레지스트리 DNS 조회가 `EAI_AGAIN`으로 실패해 전체 `npm install`, React/Next.js 포함 전체 typecheck, `next build`는 완료하지 못했습니다. 위 로컬 명령으로 최종 검증하세요.

## 참고 출처

- npm 공식 저장소의 같은 오류 재현 보고: https://github.com/npm/cli/issues/5687
- TypeScript TSConfig include/exclude: https://www.typescriptlang.org/tsconfig/
- TypeScript ambient module 설명: https://www.typescriptlang.org/docs/handbook/modules/reference.html
- Node.js fs.Dirent / readdirSync: https://nodejs.org/api/fs.html
