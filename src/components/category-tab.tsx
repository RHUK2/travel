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
import type { TripItem } from "@/lib/types";
import { useTripStore } from "@/store/trip-store";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  ChevronsDown,
  ChevronsUp,
  NotebookPen,
  Trash2,
} from "lucide-react";
import { useMemo, useState } from "react";
import { PlaceCard } from "./timeline-item";

type SortOrder = "name_asc" | "name_desc";
type FilterMode = "all" | "undone" | "done";

interface CategoryTabProps {
  items: TripItem[];
}

export function CategoryTab({ items }: CategoryTabProps) {
  const [collapseKey, setCollapseKey] = useState(0);
  const [expandKey, setExpandKey] = useState(0);
  const [tipsOpen, setTipsOpen] = useState(true);
  const [memoCollapseKey, setMemoCollapseKey] = useState(0);
  const [memoExpandKey, setMemoExpandKey] = useState(0);
  const [memosOpen, setMemosOpen] = useState(false);
  const [deleteMemosOpen, setDeleteMemosOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("name_asc");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const { personalStates, upsertPersonal, states } = useTripStore();

  const hasTips = items.some((item) => item.tip);
  const hasMemos = items.some((item) => personalStates[item.id]?.memo);

  const displayItems = useMemo(() => {
    let result = items.filter((item) => {
      if (filterMode === "undone") return !states[item.id]?.is_done;
      if (filterMode === "done") return !!states[item.id]?.is_done;
      return true;
    });
    if (sortOrder === "name_asc")
      result = [...result].sort((a, b) => a.name.localeCompare(b.name, "ko"));
    if (sortOrder === "name_desc")
      result = [...result].sort((a, b) => b.name.localeCompare(a.name, "ko"));
    return result;
  }, [items, filterMode, sortOrder, states]);

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
      items
        .filter((item) => personalStates[item.id]?.memo)
        .map((item) => upsertPersonal(item.id, { memo: "" })),
    );
    setDeleteMemosOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-1 border-b pb-3">
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

      {/* 정렬 / 필터 */}
      <div className="flex flex-wrap items-center gap-1 border-b pb-3">
        <Button
          variant={sortOrder === "name_asc" ? "secondary" : "outline"}
          size="sm"
          className="h-7 gap-1 rounded-full px-3 text-xs"
          onClick={() => setSortOrder("name_asc")}
        >
          <ArrowDownAZ className="h-3.5 w-3.5" />
          이름순
        </Button>
        <Button
          variant={sortOrder === "name_desc" ? "secondary" : "outline"}
          size="sm"
          className="h-7 gap-1 rounded-full px-3 text-xs"
          onClick={() => setSortOrder("name_desc")}
        >
          <ArrowUpAZ className="h-3.5 w-3.5" />
          이름역순
        </Button>
        <div className="bg-border mx-1 h-4 w-px" />
        <Button
          variant={filterMode === "all" ? "secondary" : "outline"}
          size="sm"
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => setFilterMode("all")}
        >
          전체
        </Button>
        <Button
          variant={filterMode === "done" ? "secondary" : "outline"}
          size="sm"
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => setFilterMode("done")}
        >
          완료
        </Button>
        <Button
          variant={filterMode === "undone" ? "secondary" : "outline"}
          size="sm"
          className="h-7 rounded-full px-3 text-xs"
          onClick={() => setFilterMode("undone")}
        >
          미완료
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {displayItems.map((item) => (
          <PlaceCard
            key={item.id}
            item={item}
            collapseKey={collapseKey}
            expandKey={expandKey}
            memoCollapseKey={memoCollapseKey}
            memoExpandKey={memoExpandKey}
          />
        ))}
      </div>

      <Dialog open={deleteMemosOpen} onOpenChange={setDeleteMemosOpen}>
        <DialogContent className="max-w-xs">
          <DialogHeader>
            <DialogTitle>메모 전체 삭제</DialogTitle>
            <DialogDescription>
              이 카테고리의 모든 메모를 삭제하시겠습니까? 이 작업은 되돌릴 수
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
