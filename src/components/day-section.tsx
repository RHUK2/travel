"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { DayData } from "@/lib/types";
import { useTripStore } from "@/store/trip-store";
import { ChevronsDown, ChevronsUp, NotebookPen, Trash2 } from "lucide-react";
import { useState } from "react";
import { MapSection } from "./map-section";
import { TimelineItem } from "./timeline-item";
import { WeatherStrip } from "./weather-strip";

interface DaySectionProps {
  day: DayData;
  isActive: boolean;
}

export function DaySection({ day, isActive }: DaySectionProps) {
  const [collapseKey, setCollapseKey] = useState(0);
  const [expandKey, setExpandKey] = useState(0);
  const [tipsOpen, setTipsOpen] = useState(true);
  const [memoCollapseKey, setMemoCollapseKey] = useState(0);
  const [memoExpandKey, setMemoExpandKey] = useState(0);
  const [memosOpen, setMemosOpen] = useState(false);
  const [deleteMemosOpen, setDeleteMemosOpen] = useState(false);

  const { personalStates, upsertPersonal } = useTripStore();

  if (!isActive) return null;

  const hasTips = day.items.some((item) => item.tip);
  const hasMemos = day.items.some((item) => personalStates[item.id]?.memo);

  const handleTipToggle = () => {
    if (tipsOpen) {
      setCollapseKey((k) => k + 1);
      setTipsOpen(false);
    } else {
      setExpandKey((k) => k + 1);
      setTipsOpen(true);
    }
  };

  const handleMemoToggle = () => {
    if (memosOpen) {
      setMemoCollapseKey((k) => k + 1);
      setMemosOpen(false);
    } else {
      setMemoExpandKey((k) => k + 1);
      setMemosOpen(true);
    }
  };

  const handleDeleteAllMemos = async () => {
    await Promise.all(
      day.items
        .filter((item) => personalStates[item.id]?.memo)
        .map((item) => upsertPersonal(item.id, { memo: "" })),
    );
    setDeleteMemosOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <WeatherStrip dayIndex={day.day - 1} />
      <MapSection spots={day.mapSpots} color={day.color} />

      <div>
        {/* Day header */}
        <div className="flex items-center gap-3 border-b pb-4">
          <span
            className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full text-white"
            style={{ backgroundColor: day.color }}
          >
            <span className="text-[9px] font-bold tracking-wide uppercase">
              DAY
            </span>
            <span className="text-xl leading-none font-extrabold">
              {day.day}
            </span>
          </span>
          <div>
            <h2 className="text-lg font-bold">{day.title}</h2>
            <p className="text-muted-foreground text-sm">{day.subtitle}</p>
          </div>
        </div>

        {/* Action toolbar */}
        <div className="mt-3 flex items-center gap-1 border-b pb-3">
          {hasTips && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-full px-3 text-xs"
              onClick={handleTipToggle}
            >
              {tipsOpen ? (
                <ChevronsUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronsDown className="h-3.5 w-3.5" />
              )}
              {tipsOpen ? "팁 닫기" : "팁 열기"}
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 rounded-full px-3 text-xs"
            disabled={!hasMemos}
            onClick={() => setDeleteMemosOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            메모 삭제
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 rounded-full px-3 text-xs"
            disabled={!hasMemos}
            onClick={handleMemoToggle}
          >
            <NotebookPen className="h-3.5 w-3.5" />
            {memosOpen ? "메모 닫기" : "메모 열기"}
          </Button>
        </div>

        {/* timeline */}
        <div className="relative mt-4">
          <div className="bg-border absolute top-0 left-1.5 h-full w-0.5" />
          <div className="flex flex-col gap-3">
            {day.items.map((item) => (
              <TimelineItem
                key={item.id}
                item={item}
                dayColor={day.color}
                collapseKey={collapseKey}
                expandKey={expandKey}
                memoCollapseKey={memoCollapseKey}
                memoExpandKey={memoExpandKey}
              />
            ))}
          </div>
        </div>
      </div>

      {/* delete all memos dialog */}
      <Dialog open={deleteMemosOpen} onOpenChange={setDeleteMemosOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>메모 전체 삭제</DialogTitle>
            <DialogDescription>
              이 날의 모든 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수
              없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeleteMemosOpen(false)}>
              취소
            </Button>
            <Button variant="destructive" onClick={handleDeleteAllMemos}>
              전체 삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
