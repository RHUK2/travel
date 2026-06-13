"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { TripItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useTripStore } from "@/store/trip-store";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Map,
  PenLine,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const memoSchema = z.object({
  memo: z.string().max(500, "500자 이하로 입력해주세요"),
});
type MemoForm = z.infer<typeof memoSchema>;

interface PlaceCardProps {
  item: TripItem;
  collapseKey?: number;
  expandKey?: number;
  memoCollapseKey?: number;
  memoExpandKey?: number;
}

export function PlaceCard({
  item,
  collapseKey = 0,
  expandKey = 0,
  memoCollapseKey = 0,
  memoExpandKey = 0,
}: PlaceCardProps) {
  const isDone = useTripStore((s) => s.states[item.id]?.is_done ?? false);
  const isPending = useTripStore((s) => !!s.pendingItems[item.id]);
  const savedMemo = useTripStore((s) => s.personalStates[item.id]?.memo ?? "");
  const upsert = useTripStore((s) => s.upsert);
  const upsertPersonal = useTripStore((s) => s.upsertPersonal);

  const [tipOpen, setTipOpen] = useState(true);
  const [memoOpen, setMemoOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
    };
  }, []);

  const { register, watch, setValue, getValues } = useForm<MemoForm>({
    resolver: zodResolver(memoSchema),
    defaultValues: { memo: savedMemo },
  });

  useEffect(() => {
    if (savedMemo !== getValues("memo")) setValue("memo", savedMemo);
  }, [savedMemo, setValue, getValues]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const memoValue = watch("memo");

  useEffect(() => {
    if (collapseKey > 0 && item.tip) setTipOpen(false);
  }, [collapseKey, item.tip]);

  useEffect(() => {
    if (expandKey > 0 && item.tip) setTipOpen(true);
  }, [expandKey, item.tip]);

  useEffect(() => {
    if (memoCollapseKey > 0) setMemoOpen(false);
  }, [memoCollapseKey]);

  useEffect(() => {
    if (memoExpandKey > 0) setMemoOpen(true);
  }, [memoExpandKey]);

  const handleMemoChange = useCallback(
    (value: string) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        upsertPersonal(item.id, { memo: value });
      }, 600);
    },
    [item.id, upsertPersonal],
  );

  const handleDoneToggle = useCallback(() => {
    if (isPending) return;
    upsert(item.id, { is_done: !isDone });
  }, [item.id, isDone, upsert, isPending]);

  const handleDeleteMemo = useCallback(async () => {
    await upsertPersonal(item.id, { memo: "" });
    setValue("memo", "");
    setMemoOpen(false);
    setDeleteOpen(false);
  }, [item.id, upsertPersonal, setValue]);

  return (
    <>
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
          isDone && "bg-muted/30 opacity-60",
        )}
        onClick={handleDoneToggle}
      >
        <CardContent>
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5">
              {isDone && (
                <Badge className="gap-1 rounded-full bg-green-500/15 text-[11px] font-bold text-green-600 dark:text-green-400">
                  <CheckCircle2 className="h-3 w-3" />
                  완료
                </Badge>
              )}
              {item.badge && (
                <Badge className="bg-muted text-muted-foreground rounded-full text-[11px] font-semibold">
                  {item.badge}
                </Badge>
              )}
            </div>

            <p
              className={cn(
                "font-semibold",
                isDone && "text-muted-foreground line-through",
              )}
            >
              {item.name}
            </p>
            {item.desc && (
              <p className="text-muted-foreground text-sm whitespace-pre-line">
                {item.desc}
              </p>
            )}

            {item.mapLink && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-6 w-fit gap-1 rounded-full border-blue-200 bg-blue-50 px-2.5 text-[11px] text-blue-600 hover:bg-blue-100 hover:text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
              >
                <Link
                  href={item.mapLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Map className="h-3 w-3" />
                  구글맵 경로 보기
                </Link>
              </Button>
            )}

            {/* tip & memo buttons */}
            <div className="flex gap-1.5">
              {item.tip && (
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 gap-1 rounded-full px-2.5 text-[11px]"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTipOpen((v) => !v);
                  }}
                >
                  {tipOpen ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                  팁
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className={cn(
                  "h-6 gap-1 rounded-full px-2.5 text-[11px]",
                  memoValue && "border-primary",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setMemoOpen((v) => !v);
                }}
              >
                <PenLine className="h-3 w-3" />
                메모{memoValue ? " ●" : ""}
              </Button>
              {memoValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive h-6 w-6 rounded-full p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>

          {/* tip (animated) — outside flex container to avoid gap when collapsed */}
          {item.tip && (
            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-in-out",
                tipOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div className="bg-muted/50 text-muted-foreground border-muted-foreground/30 mt-2 rounded-r-lg border-l-2 p-2.5 text-xs leading-relaxed">
                  {item.tip}
                </div>
              </div>
            </div>
          )}

          {/* memo (animated) — outside flex container to avoid gap when collapsed */}
          <div
            className={cn(
              "grid transition-[grid-template-rows] duration-200 ease-in-out",
              memoOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            )}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="mt-2 p-1">
                <Textarea
                  {...register("memo", {
                    onChange: (e) => handleMemoChange(e.target.value),
                  })}
                  placeholder="메모를 입력하세요…"
                  className="min-h-[72px] resize-y text-sm"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* delete memo dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>메모 삭제</DialogTitle>
            <DialogDescription>
              작성한 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteMemo}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
