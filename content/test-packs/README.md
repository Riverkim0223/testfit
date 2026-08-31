# Test Pack JSON

각 하위 폴더의 `pack.json`이 테스트의 단일 기준 데이터입니다.

```text
content/test-packs/[slug]/pack.json
```

파일을 직접 편집할 수도 있지만 `/studio` 사용을 권장합니다.

- `_template`: 빈 테스트 생성용, 공개되지 않음
- `status: draft`: Studio에는 표시되지만 서비스 목록에는 표시되지 않음
- `status: active`: 서비스 목록과 sitemap에 표시됨
