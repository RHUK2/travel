"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { upsertItemState } from "@/lib/queries";
import { upsertPersonalState } from "@/lib/personal-queries";
import type { ItemState, PersonalState, Session } from "@/lib/types";

// Debounce timers for item state upserts — prevents Realtime flicker on rapid clicks
const upsertTimers = new Map<string, ReturnType<typeof setTimeout>>();

interface TripStore {
  states: Record<string, ItemState>;
  personalStates: Record<string, PersonalState>;
  currentUser: Session | null;
  pendingItems: Record<string, boolean>;
  setItemState: (itemId: string, patch: Partial<ItemState>) => void;
  setItemStateFromRealtime: (itemId: string, patch: Partial<ItemState>) => void;
  setAllItemStates: (rows: ItemState[]) => void;
  setPersonalState: (itemId: string, patch: Partial<PersonalState>) => void;
  setAllPersonalStates: (rows: PersonalState[]) => void;
  setCurrentUser: (user: Session | null) => void;
  upsert: (itemId: string, patch: Partial<Pick<ItemState, "is_done">>) => void;
  upsertPersonal: (
    itemId: string,
    patch: Partial<Pick<PersonalState, "memo" | "value">>,
  ) => Promise<void>;
}

export const useTripStore = create<TripStore>()(
  devtools(
    immer((set, get) => ({
      states: {},
      personalStates: {},
      currentUser: null,
      pendingItems: {},

      setItemState: (itemId, patch) =>
        set((s) => {
          const current = s.states[itemId];
          if (current && Object.entries(patch).every(([k, v]) => current[k as keyof ItemState] === v)) return;
          s.states[itemId] = { ...current, ...patch } as ItemState;
        }, false, "setItemState"),

      setItemStateFromRealtime: (itemId, patch) =>
        set((s) => {
          if (s.pendingItems[itemId]) return;
          const current = s.states[itemId];
          if (current && Object.entries(patch).every(([k, v]) => current[k as keyof ItemState] === v)) return;
          s.states[itemId] = { ...current, ...patch } as ItemState;
        }, false, "setItemStateFromRealtime"),

      setAllItemStates: (rows) =>
        set((s) => {
          for (const row of rows) s.states[row.item_id] = row;
        }, false, "setAllItemStates"),

      setPersonalState: (itemId, patch) =>
        set((s) => {
          const current = s.personalStates[itemId];
          if (current && Object.entries(patch).every(([k, v]) => current[k as keyof PersonalState] === v)) return;
          s.personalStates[itemId] = { ...current, ...patch } as PersonalState;
        }, false, "setPersonalState"),

      setAllPersonalStates: (rows) =>
        set((s) => {
          for (const row of rows) s.personalStates[row.item_id] = row;
        }, false, "setAllPersonalStates"),

      setCurrentUser: (user) =>
        set((s) => { s.currentUser = user; }, false, "setCurrentUser"),

      upsert: (itemId, patch) => {
        get().setItemState(itemId, patch);
        set((s) => { s.pendingItems[itemId] = true; });
        const existing = upsertTimers.get(itemId);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(async () => {
          upsertTimers.delete(itemId);
          const current = get().states[itemId];
          await upsertItemState(itemId, { is_done: current?.is_done ?? false }, current);
          set((s) => { delete s.pendingItems[itemId]; });
        }, 300);
        upsertTimers.set(itemId, timer);
      },

      upsertPersonal: async (itemId, patch) => {
        const { currentUser, personalStates } = get();
        if (!currentUser) return;
        get().setPersonalState(itemId, patch);
        const current = personalStates[itemId];
        await upsertPersonalState(itemId, currentUser.id, patch, current);
      },
    })),
    { name: "TripStore" },
  ),
);
