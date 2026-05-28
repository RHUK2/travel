"use client";

import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { fetchItemStates } from "@/lib/queries";
import { TRIP_ID } from "@/lib/trip-data";
import { useTripStore } from "@/store/trip-store";
import type { ItemState } from "@/lib/types";

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const { setItemState } = useTripStore();
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["item_states"],
    queryFn: fetchItemStates,
    staleTime: Infinity,
  });

  // populate zustand store from React Query cache
  useEffect(() => {
    if (!data) return;
    for (const row of data) setItemState(row.item_id, row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Realtime subscription
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

    return () => {
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
