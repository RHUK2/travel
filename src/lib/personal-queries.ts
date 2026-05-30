import type { PersonalState } from "@/lib/types";

export type { PersonalState };

export async function fetchPersonalStates(
  userId: string,
): Promise<PersonalState[]> {
  const res = await fetch("/api/personal-states", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId }),
  });
  if (!res.ok) throw new Error("Failed to fetch personal states");
  return res.json();
}

export async function upsertPersonalState(
  itemId: string,
  userId: string,
  patch: Partial<Pick<PersonalState, "memo" | "value">>,
  current?: PersonalState,
) {
  const res = await fetch("/api/personal-states/upsert", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ itemId, userId, patch, current }),
  });
  if (!res.ok) throw new Error("Failed to upsert personal state");
}
