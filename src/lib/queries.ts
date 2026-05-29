import type { ItemState } from "./types";

export async function fetchItemStates(): Promise<ItemState[]> {
  const res = await fetch("/api/item-states");
  if (!res.ok) throw new Error("Failed to fetch item states");
  return res.json();
}

export async function upsertItemState(
  itemId: string,
  patch: Partial<Pick<ItemState, "is_done">>,
  current?: ItemState,
) {
  const res = await fetch("/api/item-states", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, patch, current }),
  });
  if (!res.ok) throw new Error("Failed to upsert item state");
}
