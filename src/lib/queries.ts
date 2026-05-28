import { supabase } from "./supabase";
import { TRIP_ID } from "./trip-data";
import type { ItemState } from "./types";

export async function fetchItemStates(): Promise<ItemState[]> {
  const { data, error } = await supabase
    .from("item_states")
    .select("*")
    .eq("trip_id", TRIP_ID);
  if (error) throw error;
  return (data ?? []) as ItemState[];
}

export async function upsertItemState(
  itemId: string,
  patch: Partial<Pick<ItemState, "is_done" | "memo" | "value">>,
  current?: ItemState,
) {
  const { error } = await supabase.from("item_states").upsert(
    {
      trip_id: TRIP_ID,
      item_id: itemId,
      is_done: current?.is_done ?? false,
      memo: current?.memo ?? "",
      value: current?.value ?? "",
      ...patch,
    } as Record<string, unknown>,
    { onConflict: "trip_id,item_id" },
  );
  if (error) throw error;
}
