# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 명령어

```bash
pnpm dev          # rm -rf .next && next dev
pnpm type         # tsc --noEmit
pnpm lint         # eslint, 최대 경고 10개
pnpm build        # type + lint 실행 후 next build
pnpm format       # prettier --write
```

## 아키텍처

Next.js 16 / React 19 PWA — 그룹 여행용 동반 앱. 한국어 UI. Tailwind v4 + shadcn/ui 컴포넌트. Supabase로 DB, 실시간 동기화, 아바타 스토리지를 관리한다.

### 여행 콘텐츠

모든 여행 데이터는 **`src/lib/trip-data.ts`** 에 집중되어 있다. 새 여행으로 교체할 때 수정하는 파일이 이것 하나다. 주요 export:

- 문자열 상수: `TRIP_NAME`, `TRIP_SUBTITLE`, `TRIP_LOCATION`, `TRIP_ROUTE`, `TRIP_FOOTER` 등
- `DAYS: DayData[]` — 일별 일정 아이템. 각 아이템에 `Category`와 `mapSpots` 포함
- `CHECKLIST_GROUPS: ChecklistGroup[]` — `section: "국내" | "해외"` 로 구분된 사전 준비 체크리스트
- `EXPENSE_ROWS: ExpenseRow[]` — 예산 테이블. `jpyRange` 필드가 있으면 JPY→KRW 환산 표시
- `AIRPORT_BLOCKS: AirportBlock[]`, `TRAVEL_TIPS: TravelTip[]`

### 상태 레이어

런타임 상태는 Supabase 테이블 두 개로 관리한다:

| 테이블            | 키                  | 범위                   |
| ----------------- | ------------------- | ---------------------- |
| `item_states`     | `item_id`           | 전체 참여자 공유       |
| `personal_states` | `item_id + user_id` | 사용자별 (로그인 필요) |

두 테이블 모두 **`useTripStore`** (`src/store/trip-store.ts`) 에서 Zustand + Immer로 관리. 주요 필드: `states`, `personalStates`, `currentUser: Session | null`.

`upsert()`는 300ms 디바운스로 쓰기를 묶고, 쓰기 진행 중엔 `pendingItems[itemId]`를 세팅한다. `setItemStateFromRealtime`은 `pendingItems`에 있는 아이템은 무시하므로, 낙관적 업데이트가 실시간 이벤트에 덮어씌워지지 않는다.

### 컴포넌트 트리

```text
PasscodeGate          ← 패스코드 로그인, Session을 쿠키에 저장 (travel_session, 365일 만료)
  RealtimeProvider    ← TanStack Query 초기 패치 + Supabase 실시간 구독
    Hero
    TripTabs          ← 메인 탭 네비게이션, 활성 탭은 localStorage에 유지 (TAB_KEY)
      CategoryTab     ← Category 그룹별로 필터링된 일정 아이템
      MapSection      ← MapLibre GL 지도 (mapSpots 렌더링)
      AirportTab
      ChecklistTab    ← 사용자별 personal_states
      ExpenseTab      ← KRW/JPY 통화 선택 가능한 편집형 예산표
```

### API 라우트

`src/app/api/` 의 Next.js Route Handler들은 Supabase 클라이언트를 얇게 감싸는 프록시다. 별도 인증 미들웨어 없이 UI의 패스코드 게이트로 접근을 제어한다. 관리자 기능은 `/api/admin/` 하위에 위치한다.

### 주요 상수

- `TAB_KEY = "japan_active_tab"` — 활성 탭을 저장하는 localStorage 키
- `travel_session` 쿠키 — 로그인된 Session JSON. `src/lib/session-cookie.ts`의 `getSessionCookie` / `setSessionCookie` / `deleteSessionCookie`로 관리. 로그인 시 서버(`/api/login`)가 `Set-Cookie`로 설정하고, 이후 클라이언트에서도 업데이트한다.
- `Category` 타입: `"move" | "sight" | "sight2" | "food" | "hot" | "sleep" | "shop" | "etc"`
- `CATEGORY_GROUPS` (`trip-tabs.tsx`) — 탭 값과 `Category` 배열의 매핑 (예: `"sight"` 탭은 `sight`, `sight2`, `hot` 포함)

### 폰트

`layout.tsx`에서 로컬 폰트 두 가지를 로드한다: `pretendard` (`--font-pretendard`), `tossface` (이모지 폰트, `--font-tossface`).
