"use client";

import { create } from "zustand";
import { upsertItemState } from "@/lib/queries";
import type { ItemState } from "@/lib/types";

interface TripStore {
  states: Record<string, ItemState>;
  setItemState: (itemId: string, patch: Partial<ItemState>) => void;
  upsert: (
    itemId: string,
    patch: Partial<Pick<ItemState, "is_done" | "memo" | "value">>,
  ) => Promise<void>;
}

export const useTripStore = create<TripStore>((set, get) => ({
  states: {},

  setItemState: (itemId, patch) =>
    set((s) => ({
      states: {
        ...s.states,
        [itemId]: { ...s.states[itemId], ...patch } as ItemState,
      },
    })),

  upsert: async (itemId, patch) => {
    // optimistic update
    get().setItemState(itemId, patch);

    const current = get().states[itemId];
    await upsertItemState(itemId, patch, current);
  },
}));
