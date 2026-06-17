"use client";

import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import {
  fetchParticipants,
  type Participant,
} from "@/lib/participants-queries";
import { deleteSessionCookie, getSessionCookie } from "@/lib/session-cookie";
function ParticipantAvatar({
  p,
  isMe,
  onResetRequest,
}: {
  p: Participant;
  isMe: boolean;
  onResetRequest: (p: Participant) => void;
}) {
  return (
    <div className="group flex flex-col items-center gap-1">
      <div className="relative">
        <Avatar
          className={`h-10 w-10 border-2 shadow-sm ${isMe ? "border-sky-400 ring-2 ring-sky-400/40" : "border-background"}`}
        >
          <AvatarImage src={p.photo_url || undefined} alt={p.name} />
          <AvatarFallback className="bg-sky-100 text-sm font-bold text-sky-700 dark:bg-sky-950 dark:text-sky-300">
            {p.name.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onResetRequest(p)}
          className="absolute inset-0 h-full w-full rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/50"
        >
          <X className="h-4 w-4 text-white" />
        </Button>
      </div>
      <span className="text-[11px] font-medium">
        {p.name}
        {isMe && (
          <span className="ml-1 text-[9px] font-semibold text-sky-500">나</span>
        )}
      </span>
      {p.message && (
        <span className="text-muted-foreground max-w-[64px] truncate text-[10px]">
          {p.message}
        </span>
      )}
    </div>
  );
}

function ResetDialog({
  target,
  myId,
  onClose,
}: {
  target: Participant | null;
  myId: string;
  onClose: () => void;
}) {
  const isMe = target?.id === myId;
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (target) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPassword("");
      setError("");
      if (!isMe) {
        const id = setTimeout(() => inputRef.current?.focus(), 50);
        return () => clearTimeout(id);
      }
    }
  }, [target, isMe]);

  const handleConfirm = async () => {
    setLoading(true);
    setError("");

    if (isMe) {
      const stored = getSessionCookie();
      const userId = stored ? JSON.parse(stored).id : null;
      const res = await fetch("/api/participants/reset-self", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      setLoading(false);
      if (!res.ok) {
        setError("오류가 발생했습니다");
        return;
      }
      deleteSessionCookie();
      window.location.reload();
      return;
    }

    const res = await fetch("/api/admin/clear-profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetId: target!.id, adminPassword: password }),
    });
    setLoading(false);
    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      setError(json.error ?? "오류가 발생했습니다");
      return;
    }
    onClose();
  };

  return (
    <Dialog
      open={!!target}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle>프로필 초기화</DialogTitle>
          <DialogDescription>
            {isMe
              ? "내 프로필(사진, 한마디)을 초기화하고 로그아웃합니다."
              : `${target?.name}님의 프로필을 초기화하고 세션을 종료합니다.`}
          </DialogDescription>
        </DialogHeader>
        {!isMe && (
          <>
            <Input
              ref={inputRef}
              type="password"
              placeholder="어드민 비밀번호"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
              }}
            />
            {error && <p className="text-destructive text-xs">{error}</p>}
          </>
        )}
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            취소
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading || (!isMe && !password)}
          >
            {loading ? "처리 중…" : "초기화"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function ParticipantsStrip() {
  const queryClient = useQueryClient();
  const stored = typeof window !== "undefined" ? getSessionCookie() : null;
  const myId = stored ? JSON.parse(stored).id : "";

  const [resetTarget, setResetTarget] = useState<Participant | null>(null);

  const { data: participants = [], isLoading } = useQuery({
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
        },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
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

  if (!isLoading && participants.length === 0) return null;

  return (
    <>
      <div className="relative z-20 flex flex-col gap-3 border-t px-6 py-4">
        <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
          참여자
        </p>
        <div className="flex flex-wrap gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <div className="bg-muted h-10 w-10 animate-pulse rounded-full" />
                  <div className="bg-muted h-4 w-8 animate-pulse rounded" />
                  <div className="bg-muted h-3.5 w-10 animate-pulse rounded" />
                </div>
              ))
            : participants.map((p) => (
                <ParticipantAvatar
                  key={p.id}
                  p={p}
                  isMe={p.id === myId}
                  onResetRequest={setResetTarget}
                />
              ))}
        </div>
      </div>

      <ResetDialog
        target={resetTarget}
        myId={myId}
        onClose={() => setResetTarget(null)}
      />
    </>
  );
}
