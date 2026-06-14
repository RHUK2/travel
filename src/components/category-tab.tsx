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
  Map as MapIcon,
  NotebookPen,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { PlaceCard } from "./timeline-item";

type SortOrder = "name_asc" | "name_desc";
type FilterMode = "all" | "undone" | "done";

interface CategoryTabProps {
  items: TripItem[];
  onMapOpen?: () => void;
}

function useScrollDrag() {
  const ref = useRef<HTMLDivElement>(null);
  const drag = useRef({ active: false, startX: 0, scrollLeft: 0, moved: false });
  const [mask, setMask] = useState<"none" | "left" | "right" | "both">("none");

  const updateMask = () => {
    const el = ref.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 0;
    const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    if (canLeft && canRight) setMask("both");
    else if (canLeft) setMask("left");
    else if (canRight) setMask("right");
    else setMask("none");
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    updateMask();
    el.addEventListener("scroll", updateMask, { passive: true });
    const ro = new ResizeObserver(updateMask);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", updateMask);
      ro.disconnect();
    };
  }, []);

  const handlers = {
    onMouseDown: (e: React.MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      drag.current = { active: true, startX: e.pageX - el.offsetLeft, scrollLeft: el.scrollLeft, moved: false };
    },
    onMouseMove: (e: React.MouseEvent) => {
      if (!drag.current.active) return;
      e.preventDefault();
      const el = ref.current;
      if (!el) return;
      const walk = e.pageX - el.offsetLeft - drag.current.startX;
      if (Math.abs(walk) > 4) drag.current.moved = true;
      el.scrollLeft = drag.current.scrollLeft - walk;
    },
    onMouseUp: () => { drag.current.active = false; },
    onMouseLeave: () => { drag.current.active = false; },
    onClickCapture: (e: React.MouseEvent) => {
      if (drag.current.moved) {
        e.stopPropagation();
        drag.current.moved = false;
      }
    },
  };

  const maskStyle: React.CSSProperties = {
    maskImage:
      mask === "both"
        ? "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
        : mask === "left"
          ? "linear-gradient(to right, transparent 0%, black 5%)"
          : mask === "right"
            ? "linear-gradient(to right, black 95%, transparent 100%)"
            : undefined,
  };

  return { ref, handlers, maskStyle };
}

export function CategoryTab({ items, onMapOpen }: CategoryTabProps) {
  const [collapseKey, setCollapseKey] = useState(0);
  const [expandKey, setExpandKey] = useState(0);
  const [tipsOpen, setTipsOpen] = useState(true);
  const [memoCollapseKey, setMemoCollapseKey] = useState(0);
  const [memoExpandKey, setMemoExpandKey] = useState(0);
  const [memosOpen, setMemosOpen] = useState(false);
  const [deleteMemosOpen, setDeleteMemosOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("name_asc");
  const [filterMode, setFilterMode] = useState<FilterMode>("all");

  const { ref: actionRef, handlers: actionHandlers, maskStyle: actionMaskStyle } = useScrollDrag();
  const { ref: filterRef, handlers: filterHandlers, maskStyle: filterMaskStyle } = useScrollDrag();

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
      {/* 액션 버튼 바 */}
      <div
        ref={actionRef}
        className="cursor-grab select-none overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b pb-3 active:cursor-grabbing"
        style={actionMaskStyle}
        {...actionHandlers}
      >
        <div className="flex items-center gap-1 w-max">
          {onMapOpen && (
            <>
              <Button
                variant="outline"
                size="sm"
                className="h-7 gap-1.5 rounded-full px-3 text-xs whitespace-nowrap"
                onClick={onMapOpen}
              >
                <MapIcon className="h-3.5 w-3.5" />
                지도
              </Button>
              <div className="bg-border mx-1 h-4 w-px shrink-0" />
            </>
          )}
          {hasTips && (
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 rounded-full px-3 text-xs whitespace-nowrap"
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
            className="h-7 gap-1.5 rounded-full px-3 text-xs whitespace-nowrap"
            disabled={!hasMemos}
            onClick={() => setDeleteMemosOpen(true)}
          >
            <Trash2 className="h-3.5 w-3.5" />
            메모 삭제
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 gap-1.5 rounded-full px-3 text-xs whitespace-nowrap"
            disabled={!hasMemos}
            onClick={handleMemoToggle}
          >
            <NotebookPen className="h-3.5 w-3.5" />
            {memosOpen ? "메모 닫기" : "메모 열기"}
          </Button>
        </div>
      </div>

      {/* 정렬 / 필터 바 */}
      <div
        ref={filterRef}
        className="cursor-grab select-none overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-b pb-3 active:cursor-grabbing"
        style={filterMaskStyle}
        {...filterHandlers}
      >
        <div className="flex items-center gap-1 w-max">
          <Button
            variant={sortOrder === "name_asc" ? "secondary" : "outline"}
            size="sm"
            className="h-7 gap-1 rounded-full px-3 text-xs whitespace-nowrap"
            onClick={() => setSortOrder("name_asc")}
          >
            <ArrowDownAZ className="h-3.5 w-3.5" />
            이름순
          </Button>
          <Button
            variant={sortOrder === "name_desc" ? "secondary" : "outline"}
            size="sm"
            className="h-7 gap-1 rounded-full px-3 text-xs whitespace-nowrap"
            onClick={() => setSortOrder("name_desc")}
          >
            <ArrowUpAZ className="h-3.5 w-3.5" />
            이름역순
          </Button>
          <div className="bg-border mx-1 h-4 w-px shrink-0" />
          <Button
            variant={filterMode === "all" ? "secondary" : "outline"}
            size="sm"
            className="h-7 rounded-full px-3 text-xs whitespace-nowrap"
            onClick={() => setFilterMode("all")}
          >
            전체
          </Button>
          <Button
            variant={filterMode === "done" ? "secondary" : "outline"}
            size="sm"
            className="h-7 rounded-full px-3 text-xs whitespace-nowrap"
            onClick={() => setFilterMode("done")}
          >
            완료
          </Button>
          <Button
            variant={filterMode === "undone" ? "secondary" : "outline"}
            size="sm"
            className="h-7 rounded-full px-3 text-xs whitespace-nowrap"
            onClick={() => setFilterMode("undone")}
          >
            미완료
          </Button>
        </div>
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
