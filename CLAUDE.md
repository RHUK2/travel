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

## Project Overview

요나고 2박 3일 여행 (Yonago, Japan, 2026.6.1–6.3) — a single-page trip planner for a specific trip. Allows travelers to mark schedule items as done, add memos, and sync state in real-time across devices via Supabase.

## Commands

```bash
npm run dev       # Start dev server (Next.js 16 with Turbopack)
npm run build     # Production build
npm run lint      # ESLint
```

No test suite exists.

## Environment Variables

Required in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLIC_KEY=
```

## Architecture

**Stack**: Next.js 16 (App Router), React 19, TypeScript, Tailwind v4, shadcn/ui (`radix-nova` style), Zustand, React Query, Supabase, Leaflet, Zod, react-hook-form.

### Data layers

1. **Static trip data** — all itinerary content lives in `src/lib/trip-data.ts`. `DAYS`, `WEATHER`, `CHECKLIST_GROUPS`, and `EXPENSE_ROWS` are pure constants. `TRIP_ID = "yonago-2026"` is hardcoded throughout.

2. **Supabase persistence** — `item_states` table stores per-item state (`is_done`, `memo`, `value`) keyed by `(trip_id, item_id)`. Schema is in `supabase-schema.sql`. RLS allows public read/write without auth.

3. **State sync flow**:
   - `RealtimeProvider` (wraps entire page) fetches all item states via React Query on mount and populates the Zustand store.
   - Supabase Realtime subscription in `RealtimeProvider` pushes `INSERT`/`UPDATE` events live, updating both the Zustand store and React Query cache.
   - Mutations go through `useTripStore.upsert()` which performs an **optimistic update** (Zustand first) then calls `upsertItemState()` to sync to Supabase.
   - Memo saves are **debounced 600ms** in `TimelineItem`.

### Component structure

```
layout.tsx          — ThemeProvider + QueryProvider, loads Leaflet CSS from CDN, Pretendard/TosseFace fonts
page.tsx            — RealtimeProvider wrapping Hero + TripTabs + ScrollToTop
TripTabs            — Tab state persisted in localStorage (key: "japan_active_tab")
  DaySection        — per-day view: WeatherStrip, MapSection (Leaflet), timeline
    TimelineItem    — individual schedule card with done toggle, tip accordion, memo textarea
  ChecklistTab      — packing checklist with Supabase-backed checkboxes
  ExpenseTab        — static budget breakdown table
  AirportTab        — static airport guide
```

### Tip/memo broadcast pattern

`DaySection` controls tip and memo expansion for all children using **counter keys** (`collapseKey`, `expandKey`, `memoCollapseKey`, `memoExpandKey`). Each `TimelineItem` watches these keys via `useEffect` and opens/closes accordingly. Incrementing the counter triggers all children simultaneously without prop drilling callbacks.

### shadcn/ui

Components use the `radix-nova` style with `neutral` base color. Add new components via:

```bash
npx shadcn add <component>
```

UI primitives are in `src/components/ui/`. Custom components are in `src/components/`.

### Leaflet maps

`MapSection` renders a Leaflet map with emoji markers for each day's spots. Leaflet CSS is loaded in `layout.tsx` via a `<link>` tag (not npm) to avoid SSR issues. The map component itself must be client-side only.
