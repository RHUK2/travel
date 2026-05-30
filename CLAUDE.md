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

요나고 2박 3일 여행(2026.6.1–6.3)을 위한 여행 동행자 공유 웹앱. 일정, 지도, 체크리스트, 경비, 공항 안내를 제공하며 참여자 간 실시간 상태 동기화를 지원한다.

- **스택**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui
- **백엔드**: Supabase (PostgreSQL + Realtime + Storage)
- **상태관리**: Zustand (immer + devtools 미들웨어)
- **서버 데이터 페칭**: TanStack Query (`staleTime: Infinity` — Realtime이 갱신 담당)
- **패키지 매니저**: pnpm
- **Trip ID**: `yonago-2026` (하드코딩 고정값, `src/lib/trip-data.ts`)

---

## 디렉터리 구조

```
src/
├── app/
│   ├── api/          # Next.js Route Handlers (Supabase 직접 접근)
│   ├── layout.tsx    # Provider 스택: ThemeProvider > QueryProvider
│   └── page.tsx      # PasscodeGate > RealtimeProvider > TripTabs
├── components/
│   ├── ui/           # shadcn/ui 컴포넌트
│   └── *.tsx         # 기능 컴포넌트
├── lib/
│   ├── trip-data.ts  # 여행 콘텐츠 (날씨·일정·체크리스트·경비 등 정적 데이터)
│   ├── types.ts      # 공유 타입 정의
│   ├── queries.ts    # item_states CRUD
│   ├── personal-queries.ts  # personal_states CRUD
│   ├── participants-queries.ts
│   ├── supabase.ts   # Supabase 클라이언트
│   └── constants.ts  # localStorage 키 상수
└── store/
    └── trip-store.ts # Zustand 전역 상태
```

---

## 데이터 모델

| 테이블            | 설명                                                           |
| ----------------- | -------------------------------------------------------------- |
| `item_states`     | 공유 상태 (일정 완료, 체크리스트) — `trip_id + item_id` PK     |
| `personal_states` | 개인 상태 (메모, 경비 입력) — `trip_id + item_id + user_id` PK |
| `participants`    | 참여자 목록 — 어드민이 사전 등록, 로그인 시 token 발급         |

- Supabase Realtime Postgres Changes로 `item_states`, `participants` 실시간 구독
- `personal_states`는 현재 로그인한 `user_id` 기준 필터 구독

---

## 인증 및 세션

- 비밀번호 없이 이름 선택 → Supabase에서 token 발급 → `localStorage(SESSION_KEY)` 저장
- `PasscodeGate` 컴포넌트가 진입 제어
- `Session` 타입: `{ id, name, token, photo_url, message }`

---

## 상태 동기화 패턴

- 사용자 액션 → Zustand `upsert()` → 낙관적 UI 반영 → 300ms debounce 후 Supabase upsert
- Realtime 이벤트 → `setItemStateFromRealtime()` — `pendingItems`에 있으면 무시 (자신의 변경에 의한 플리커 방지)
- TanStack Query는 초기 로드에만 사용, 이후 갱신은 Realtime이 담당

---

## 여행 콘텐츠 수정

정적 데이터는 전부 `src/lib/trip-data.ts`에 집중. 일정·날씨·체크리스트·경비·공항 안내를 여기서 수정한다.

---

## 개발 명령어

```bash
pnpm dev       # 개발 서버 (.next 캐시 삭제 후 시작)
pnpm type      # TypeScript 타입 검사
pnpm lint      # ESLint (max-warnings 10)
pnpm build     # audit → type → lint 후 빌드
```

---

## 컨벤션

- 컴포넌트: Named export, PascalCase
- 파일명: kebab-case
- 클라이언트 컴포넌트에는 `"use client"` 명시 (App Router 기본은 서버 컴포넌트)
- 스타일: Tailwind 유틸리티 클래스, `cn()` 헬퍼로 조건부 합성
- 폼 유효성: react-hook-form + zod
- 토스트: `sonner`
- 아이콘: `lucide-react`
- 환경변수: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLIC_KEY`
