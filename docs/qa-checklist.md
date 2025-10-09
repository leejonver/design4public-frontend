# QA Checklist

## Automated Tests
- [x] `npm run test` (Vitest) – Projects, Brands 페이지 및 상세 페이지 데이터 로드/렌더링 검증

## Manual Smoke Tests
- [x] `/projects`: 필터 컴포넌트 표시, 프로젝트 카드 렌더링, 상세 페이지 이동
- [x] `/brands`: 브랜드 카드 목록 확인, 브랜드 상세 페이지 진입 및 연관 프로젝트 노출 확인
- [x] `/items`: 아이템 카드 목록 확인, 아이템 상세 페이지 내 브랜드/프로젝트 링크 정상 동작
- [x] `/photos`: 사진 모자이크 레이아웃 로드, 프로젝트 상세 이동 동작

## 성능 확인 (개발 환경 기준)
- 첫 화면 LCP < 2.1s, CLS ≈ 0.00 (Chrome DevTools Performance Capture)
- 페이지 전환 시 Supabase API 요청 정상 완료, 콘솔 에러 없음

## 빌드 검증
- [x] `npm run build`


