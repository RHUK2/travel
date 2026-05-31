"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { fetchRate } from "@/lib/rate-queries";
import { EXPENSE_NOTE, EXPENSE_ROWS } from "@/lib/trip-data";
import type { ExpenseRow } from "@/lib/types";
import { useTripStore } from "@/store/trip-store";
import { useQuery } from "@tanstack/react-query";
import { Plus, RotateCcw, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

function formatEstimate(row: ExpenseRow, rate: number): string {
  if (!row.jpyRange) return row.estimate;
  const [min, max] = row.jpyRange;
  const krwMin = (min * rate / 10000).toFixed(1);
  const krwMax = (max * rate / 10000).toFixed(1);
  return `${min.toLocaleString()}~${max.toLocaleString()}엔 (약 ${krwMin}~${krwMax}만원)`;
}

type ExpenseChild = { id: string; label: string; amount: string };

function emptyChild(): ExpenseChild {
  return { id: crypto.randomUUID(), label: "", amount: "" };
}

function parseChildren(raw: string): ExpenseChild[] {
  if (!raw) return [emptyChild()];
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) return parsed;
  } catch {
    // 구 포맷: 단순 숫자 문자열 → 단일 항목으로 마이그레이션
    return [{ id: crypto.randomUUID(), label: "", amount: raw }];
  }
  return [emptyChild()];
}

export function ExpenseTab() {
  const { personalStates, upsertPersonal } = useTripStore();
  const { data: rate = 9.44 } = useQuery({
    queryKey: ["rate"],
    queryFn: fetchRate,
    staleTime: 60 * 60 * 1000,
  });
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  const [children, setChildren] = useState<Record<string, ExpenseChild[]>>(
    () =>
      Object.fromEntries(EXPENSE_ROWS.map((r) => [r.id, [emptyChild()]])),
  );

  useEffect(() => {
    const timers = debounceTimers.current;
    return () => {
      Object.values(timers).forEach(clearTimeout);
    };
  }, []);

  // sync store → state once personal data loads
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setChildren(
      Object.fromEntries(
        EXPENSE_ROWS.map((r) => {
          const raw = personalStates[r.id]?.value ?? "";
          return [r.id, parseChildren(raw)];
        }),
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(personalStates).length]);

  const sync = useCallback(
    (rowId: string, rows: ExpenseChild[]) => {
      if (debounceTimers.current[rowId])
        clearTimeout(debounceTimers.current[rowId]);
      debounceTimers.current[rowId] = setTimeout(() => {
        upsertPersonal(rowId, { value: JSON.stringify(rows) });
      }, 600);
    },
    [upsertPersonal],
  );

  const handleChildChange = useCallback(
    (rowId: string, childId: string, field: "label" | "amount", val: string) => {
      setChildren((prev) => {
        const updated = prev[rowId].map((c) =>
          c.id === childId ? { ...c, [field]: val } : c,
        );
        sync(rowId, updated);
        return { ...prev, [rowId]: updated };
      });
    },
    [sync],
  );

  const handleAddChild = useCallback(
    (rowId: string) => {
      setChildren((prev) => {
        const updated = [...prev[rowId], emptyChild()];
        sync(rowId, updated);
        return { ...prev, [rowId]: updated };
      });
    },
    [sync],
  );

  const handleRemoveChild = useCallback(
    (rowId: string, childId: string) => {
      setChildren((prev) => {
        const filtered = prev[rowId].filter((c) => c.id !== childId);
        const updated = filtered.length > 0 ? filtered : [emptyChild()];
        sync(rowId, updated);
        return { ...prev, [rowId]: updated };
      });
    },
    [sync],
  );

  const handleReset = useCallback(() => {
    const reset = Object.fromEntries(
      EXPENSE_ROWS.map((r) => [r.id, [emptyChild()]]),
    );
    setChildren(reset);
    for (const r of EXPENSE_ROWS) {
      upsertPersonal(r.id, { value: JSON.stringify(reset[r.id]) });
    }
  }, [upsertPersonal]);

  const rowSubtotal = (rowId: string) =>
    (children[rowId] ?? []).reduce((s, c) => {
      const n = Number(c.amount.replace(/,/g, "") || 0);
      return s + (isNaN(n) ? 0 : n);
    }, 0);

  const total = EXPENSE_ROWS.reduce((sum, r) => sum + rowSubtotal(r.id), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
          💰 예상 경비 (1인 기준)
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="gap-1.5"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          초기화
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border text-sm">
        {EXPENSE_ROWS.map((row, rowIdx) => {
          const rowChildren = children[row.id] ?? [emptyChild()];
          const subtotal = rowSubtotal(row.id);
          const showSubtotal = rowChildren.length >= 2 && subtotal > 0;

          return (
            <div
              key={row.id}
              className={rowIdx < EXPENSE_ROWS.length - 1 ? "border-b" : ""}
            >
              {/* 카테고리 헤더 */}
              <div className="bg-muted/30 flex items-center justify-between px-4 py-2.5">
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium">{row.label}</span>
                  <span className="text-muted-foreground text-xs">
                    {formatEstimate(row, rate)}
                  </span>
                </div>
                {showSubtotal && (
                  <span className="text-muted-foreground tabular-nums text-xs">
                    소계 {subtotal.toLocaleString("ko-KR")}원
                  </span>
                )}
              </div>

              {/* 정적 설명 subRows */}
              {row.subRows?.map((sub, i) => (
                <div
                  key={`${row.id}_sub_${i}`}
                  className="bg-muted/20 text-muted-foreground border-t px-4 py-1.5 text-xs"
                >
                  {sub.label}
                </div>
              ))}

              {/* 자식 항목 입력 목록 */}
              <div className="divide-y">
                {rowChildren.map((child) => (
                  <div
                    key={child.id}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <Input
                      type="text"
                      placeholder="항목명"
                      value={child.label}
                      onChange={(e) =>
                        handleChildChange(row.id, child.id, "label", e.target.value)
                      }
                      className="h-8 min-w-0 flex-1 text-sm"
                    />
                    <Input
                      type="number"
                      min={0}
                      step={10000}
                      placeholder="0"
                      value={child.amount}
                      onChange={(e) =>
                        handleChildChange(row.id, child.id, "amount", e.target.value)
                      }
                      className="h-8 w-28 shrink-0 text-right tabular-nums text-sm"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-muted-foreground hover:text-foreground h-8 w-8 shrink-0"
                      onClick={() => handleRemoveChild(row.id, child.id)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* 항목 추가 버튼 */}
              <div className="px-4 pb-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-muted-foreground hover:text-foreground h-7 gap-1 text-xs"
                  onClick={() => handleAddChild(row.id)}
                >
                  <Plus className="h-3 w-3" />
                  항목 추가
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50">
        <CardContent className="flex items-center justify-between px-4">
          <span className="font-semibold text-green-700 dark:text-green-400">
            💰 내 예산 합계
          </span>
          <span className="text-lg font-bold text-green-700 tabular-nums dark:text-green-400">
            {total.toLocaleString("ko-KR")}원
          </span>
        </CardContent>
      </Card>

      <Separator />
      <div className="space-y-1.5">
        <p className="text-muted-foreground text-xs">
          💱 현재 환율: <span className="font-semibold">{rate.toFixed(2)}원/엔</span>
        </p>
        <p className="text-muted-foreground text-xs leading-relaxed whitespace-pre-line">
          {EXPENSE_NOTE}
        </p>
      </div>
    </div>
  );
}
