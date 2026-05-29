# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```text
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## 프로젝트 개요

요나고 2박 3일 여행 (Yonago, Japan, 2026.6.1–6.3) — 특정 여행을 위한 싱글 페이지 여행 플래너. 참여자가 패스코드로 입장하고, 일정 항목을 완료 처리하고, 개인 메모/예산을 작성하며, Supabase를 통해 기기 간 실시간 상태 동기화를 할 수 있다.

## 명령어

```bash
npm run dev       # 개발 서버 시작 (Next.js 16 with Turbopack)
npm run build     # 프로덕션 빌드
npm run lint      # ESLint
```

테스트 스위트 없음.

## 환경 변수

`.env.local`에 필요:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLIC_KEY=
```

## 아키텍처

**스택**: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui (`radix-nova` 스타일), Zustand, React Query, Supabase, Leaflet, Zod, react-hook-form.

### 인증

패스코드 기반 간이 인증. 로그인 흐름: 이름 + 패스코드 입력 → `/api/login` → `participants` 테이블에 upsert → `Session` 객체(`id`, `name`, `token`, `photo_url`, `message`)를 `localStorage["travel_session"]`에 저장. 이후 프로필(사진, 한마디)을 입력해야 메인 화면 진입.

- `PasscodeGate` — 세션 유무를 확인해 로그인/프로필 스텝 또는 children을 렌더링. Supabase Realtime으로 강제 퇴장(DELETE/token 초기화)을 감지함.
- `Session` 타입은 `src/lib/types.ts`, 키 상수는 `src/lib/constants.ts` (`SESSION_KEY`).
- 아바타는 Supabase Storage `avatars` 버킷에 저장. 업로드/삭제는 `/api/participants/upload-avatar`, `/api/participants/delete-avatar`.

### 데이터 레이어

**정적 여행 데이터** — 모든 일정 콘텐츠는 `src/lib/trip-data.ts`. `DAYS`, `WEATHER`, `CHECKLIST_GROUPS`, `EXPENSE_ROWS`는 순수 상수. `TRIP_ID = "yonago-2026"` 전체적으로 하드코딩.

**Supabase 테이블** (마이그레이션: `supabase-migrations/`):

| 테이블 | 키 | 용도 |
|--------|-----|-------|
|`item_states`| `(trip_id, item_id)` | 공유 상태 — 체크리스트 완료 여부 |
|`participants`| `(trip_id, id)` | 참여자 목록, 인증 토큰, 프로필 |
|`personal_states`| `(trip_id, item_id, user_id)` | 개인 상태 — 메모, 예산 입력값 |

RLS 정책은 `using (true)` — 패스코드로만 접근하는 소규모 앱이므로 의도적 설계.

**상태 동기화 흐름**:

- `RealtimeProvider`가 마운트 시 React Query로 `item_states` + `personal_states`(로그인 시)를 fetch해 Zustand 스토어에 채움.
- `item_states` 채널은 항상 구독. `personal_states` 채널은 `currentUser` 있을 때만 구독 (자신의 row만 filter).
- 뮤테이션은 `useTripStore.upsert()` / `upsertPersonal()`을 통해 처리 — **낙관적 업데이트**(Zustand 먼저) 후 API 동기화. 실패 시 롤백 없음(known limitation).
- 메모/예산 저장은 **600ms 디바운스** 적용. 언마운트 시 `clearTimeout` 필수.

### API 라우트 (`src/app/api/`)

```text
/api/login                         POST  — 패스코드 검증, participants upsert, Session 반환
/api/item-states                   GET   — 공유 item_states 조회
                                   POST  — item_states upsert
/api/personal-states               POST  — 개인 personal_states 조회 (userId body 필요)
/api/personal-states/upsert        POST  — 개인 personal_states upsert
/api/participants                  GET   — 참여자 목록
/api/participants/upload-avatar    POST  — 아바타 Storage 업로드
/api/participants/delete-avatar    POST  — 아바타 Storage 삭제
/api/participants/update-profile   POST  — 프로필 업데이트 (photo_url, message)
/api/participants/delete           POST  — 참여자 탈퇴
/api/participants/reset-self       POST  — 본인 프로필 초기화
/api/admin/clear-profile           POST  — 관리자용 강제 초기화
```

### 컴포넌트 구조

```
layout.tsx            — ThemeProvider + QueryProvider, Leaflet CSS (CDN link), Pretendard/TosseFace 폰트
page.tsx              — PasscodeGate → RealtimeProvider → Hero + TripTabs + ScrollToTop
PasscodeGate          — 인증 게이트 (checking → login → profile → done 스텝)
RealtimeProvider      — 초기 데이터 fetch + Supabase Realtime 구독 관리
Hero                  — 헤더: 배경 애니메이션(CloudShape/Star), 타이틀, ParticipantsStrip, ProfileChip
  ParticipantsStrip   — 참여자 아바타 목록, 프로필 리셋 다이얼로그
  ProfileChip         — 나가기(탈퇴) 버튼
TripTabs              — 탭 상태 localStorage 저장 (키: "japan_active_tab"), 드래그 스크롤
  DaySection          — 일별 뷰: WeatherStrip, MapSection(Leaflet), 타임라인
    TimelineItem      — 완료 토글, 팁 아코디언, 메모 텍스트에어리어 (600ms 디바운스)
  ChecklistTab        — 공유 체크리스트 (item_states 연동)
  ExpenseTab          — 개인 예산 입력 (personal_states 연동, 600ms 디바운스)
  AirportTab          — 정적 공항 안내
```

### 팁/메모 브로드캐스트 패턴

`DaySection`이 **카운터 키**(`collapseKey`, `expandKey`, `memoCollapseKey`, `memoExpandKey`)를 사용해 모든 자식 `TimelineItem`의 팁/메모 펼침 상태를 제어. 카운터를 증가시키면 각 `TimelineItem`의 `useEffect`가 반응해 일괄 열기/닫기. 콜백 프롭 드릴링 없이 N개 자식에 브로드캐스트.

### shadcn/ui

컴포넌트는 `neutral` 베이스 색상의 `radix-nova` 스타일 사용. 새 컴포넌트 추가:

```bash
npx shadcn add <component>
```

UI 프리미티브는 `src/components/ui/`, 커스텀 컴포넌트는 `src/components/`에 있음.

### Leaflet 지도

`MapSection`이 각 날짜의 장소에 이모지 마커를 표시하는 Leaflet 지도를 렌더링. Leaflet CSS는 SSR 이슈를 피하기 위해 npm이 아닌 `layout.tsx`의 `<link>` 태그로 로드. 지도 컴포넌트 자체는 반드시 클라이언트 사이드 전용으로 유지해야 함.

---

## 컨벤션

코드 리뷰(2026-05-29)에서 도출된 규칙. 새 코드 작성 시 준수.

### 네이밍

- **DB ↔ TypeScript**: DB 컬럼은 `snake_case` (`trip_id`, `photo_url`), TypeScript는 `camelCase`. 두 레이어 사이의 매핑은 API 라우트에서 처리.
- **localStorage 키 상수**: 모두 `src/lib/constants.ts`에서 관리. 컴포넌트 내 로컬 선언 금지.
  - `SESSION_KEY = "travel_session"` — passcode-gate, hero에서 사용하는 세션 데이터
  - `AUTH_KEY = "travel_auth"`, `DEVICE_KEY = "travel_device_id"` — profile-chip에서 사용하는 구형 인증 키 (현재 별도 플로우)
- **API 경로**: 리소스명만 사용 (`/api/item-states`). 경로에 동사 금지 — HTTP 메서드로 의미 표현.
- **컴포넌트 props**: `ComponentNameProps` 형식 (`TimelineItemProps`, `MapSectionProps` 등).
- **함수 prefix**: 이벤트 핸들러는 `handle*`, 조회 함수는 `fetch*`, upsert 함수는 `upsert*`.

### TypeScript

- **도메인 타입**: 모두 `src/lib/types.ts`에서 정의 및 export. 쿼리/스토어 파일에 인터페이스 선언 금지.
- **외부 데이터 단언 금지**: Supabase 실시간 페이로드, `localStorage.getItem()`, `fetch().json()` 결과에 `as SomeType` 직접 캐스팅 금지. Zod 파싱 또는 타입 가드 사용.
- **type-only import**: 값이 아닌 타입만 import할 때는 반드시 `import type` 사용.

### 컴포넌트

- **`"use client"` 지시자**: 파일당 한 번만 선언 (첫 줄).
- **컴포넌트 중복 금지**: 두 곳 이상에서 동일한 UI 컴포넌트가 필요하면 `src/components/`로 추출.
  - `CloudShape` → `src/components/cloud-shape.tsx`
- **`useState` 그룹화**: 관련 있는 상태 3개 이상이면 객체로 묶어서 관리 고려.

### API 라우트

- **HTTP 메서드**: 조회 → GET, 생성/수정 → POST/PATCH, 삭제 → DELETE. 조회에 POST 사용 금지.
- **입력 검증**: `req.json()` 직후 Zod 스키마로 검증 후 DB 접근.

### 상태 관리

- **Debounce cleanup**: `setTimeout` ref를 사용하는 컴포넌트는 `useEffect` cleanup에서 반드시 `clearTimeout` 호출.
- **낙관적 업데이트 롤백**: `useTripStore.upsert()` / `upsertPersonal()`은 서버 실패 시 롤백을 하지 않는 known limitation. 현재 앱 규모에서는 허용.

### Known Limitations (의도적으로 수정하지 않은 것들)

- `fetchPersonalStates()`가 GET 대신 POST를 사용 — API 라우트 구조상 body 전달이 필요해 유지
- `@ts-expect-error` in `map-section.tsx` — Leaflet의 불완전한 TypeScript 지원으로 인한 불가피한 단언
- Supabase RLS 정책이 `using (true)` — 이 앱은 패스코드 기반 소규모 공유 앱으로 의도적 설계
