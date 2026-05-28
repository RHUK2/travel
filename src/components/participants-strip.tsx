"use client";

import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { deleteAvatar, deleteParticipant, fetchParticipants, type Participant } from "@/lib/participants-queries";
import { TRIP_ID } from "@/lib/trip-data";

const AUTH_KEY = "travel_auth";

function ParticipantAvatar({ p, myId }: { p: Participant; myId: string }) {
  const [kicking, setKicking] = useState(false);
  const isMe = p.id === myId;

  const handleKick = async () => {
    setKicking(true);
    if (p.photo_url) await deleteAvatar(p.photo_url);
    await deleteParticipant(p.id);
    setKicking(false);
  };

  return (
    <div className="group flex flex-col items-center gap-1">
      <div className="relative">
        <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
          <AvatarImage src={p.photo_url} alt={p.name} />
          <AvatarFallback className="bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {p.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        {!isMe && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleKick}
            disabled={kicking}
            className="absolute inset-0 h-full w-full rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50"
          >
            <X className="h-4 w-4 text-white" />
          </Button>
        )}
      </div>
      <span className="text-[11px] font-medium">{p.name}</span>
      {p.message && (
        <span className="text-muted-foreground max-w-[64px] truncate text-[10px]">
          {p.message}
        </span>
      )}
    </div>
  );
}

export function ParticipantsStrip() {
  const queryClient = useQueryClient();
  const [myId, setMyId] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) setMyId(JSON.parse(stored).deviceId);
  }, []);

  const { data: participants = [] } = useQuery({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
  });

  useEffect(() => {
    const channel = supabase
      .channel("participants_realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "participants",
          filter: `trip_id=eq.${TRIP_ID}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const row = payload.new as Participant;
            queryClient.setQueryData(
              ["participants"],
              (old: Participant[] | undefined) => {
                if (!old) return [row];
                const idx = old.findIndex((p) => p.id === row.id);
                if (idx >= 0) return old.map((p, i) => (i === idx ? row : p));
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
  }, [queryClient]);

  if (participants.length === 0) return null;

  return (
    <div className="relative z-20 border-t px-6 py-4">
      <p className="text-muted-foreground mb-3 text-[10px] font-bold tracking-widest uppercase">
        참여자
      </p>
      <div className="flex flex-wrap gap-4">
        {participants.map((p) => (
          <ParticipantAvatar key={p.id} p={p} myId={myId} />
        ))}
      </div>
    </div>
  );
}
