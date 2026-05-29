"use client";

import { create } from "zustand";
import { upsertItemState } from "@/lib/queries";
import { upsertPersonalState } from "@/lib/personal-queries";
import type { ItemState, PersonalState, Session } from "@/lib/types";

interface TripStore {
  states: Record<string, ItemState>;
  personalStates: Record<string, PersonalState>;
  currentUser: Session | null;
  setItemState: (itemId: string, patch: Partial<ItemState>) => void;
  setPersonalState: (itemId: string, patch: Partial<PersonalState>) => void;
  setCurrentUser: (user: Session | null) => void;
  upsert: (itemId: string, patch: Partial<Pick<ItemState, "is_done">>) => Promise<void>;
  upsertPersonal: (
    itemId: string,
    patch: Partial<Pick<PersonalState, "memo" | "value">>,
  ) => Promise<void>;
}

export const useTripStore = create<TripStore>((set, get) => ({
  states: {},
  personalStates: {},
  currentUser: null,

  setItemState: (itemId, patch) =>
    set((s) => ({
      states: {
        ...s.states,
        [itemId]: { ...s.states[itemId], ...patch } as ItemState,
      },
    })),

  setPersonalState: (itemId, patch) =>
    set((s) => ({
      personalStates: {
        ...s.personalStates,
        [itemId]: { ...s.personalStates[itemId], ...patch } as PersonalState,
      },
    })),

  setCurrentUser: (user) => set({ currentUser: user }),

  upsert: async (itemId, patch) => {
    get().setItemState(itemId, patch);
    const current = get().states[itemId];
    await upsertItemState(itemId, patch, current);
  },

  upsertPersonal: async (itemId, patch) => {
    const { currentUser, personalStates } = get();
    if (!currentUser) return;
    get().setPersonalState(itemId, patch);
    const current = personalStates[itemId];
    await upsertPersonalState(itemId, currentUser.id, patch, current);
  },
}));
