"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchItemStates } from "@/lib/queries";
import { fetchPersonalStates } from "@/lib/personal-queries";
import { TRIP_ID } from "@/lib/trip-data";
import { useTripStore } from "@/store/trip-store";
import type { ItemState, PersonalState } from "@/lib/types";
import { SESSION_KEY } from "@/lib/constants";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { setItemState, setPersonalState, setCurrentUser, currentUser } = useTripStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = localStorage.getItem(SESSION_KEY);
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data } = useQuery({
    queryKey: ["item_states"],
    queryFn: fetchItemStates,
    staleTime: Infinity,
  });

  const { data: personalData } = useQuery({
    queryKey: ["personal_states", currentUser?.id],
    queryFn: () => fetchPersonalStates(currentUser!.id),
    enabled: !!currentUser,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (!data) return;
    for (const row of data) setItemState(row.item_id, row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffect(() => {
    if (!personalData) return;
    for (const row of personalData) setPersonalState(row.item_id, row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personalData]);

  useEffect(() => {
    const channel = supabase
      .channel("item_states_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "item_states",
          filter: `trip_id=eq.${TRIP_ID}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const row = payload.new as ItemState;
            setItemState(row.item_id, row);
            queryClient.setQueryData(
              ["item_states"],
              (old: ItemState[] | undefined) => {
                if (!old) return [row];
                const idx = old.findIndex((r) => r.item_id === row.item_id);
                if (idx >= 0)
                  return old.map((r, i) => (i === idx ? { ...r, ...row } : r));
                return [...old, row];
              },
            );
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    const channel = supabase
      .channel("personal_states_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "personal_states",
          filter: `user_id=eq.${currentUser.id}`,
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            const row = payload.new as PersonalState;
            setPersonalState(row.item_id, row);
          }
        },
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser, setPersonalState]);

  return <>{children}</>;
}
