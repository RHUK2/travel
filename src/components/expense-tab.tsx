"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { EXPENSE_ROWS } from "@/lib/trip-data";
import { useTripStore } from "@/store/trip-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { RotateCcw } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const budgetSchema = z.object(
  Object.fromEntries(EXPENSE_ROWS.map((r) => [r.id, z.string()])),
) as z.ZodObject<Record<string, z.ZodString>>;
type BudgetForm = z.infer<typeof budgetSchema>;

export function ExpenseTab() {
  const { personalStates, upsertPersonal } = useTripStore();
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  useEffect(() => {
    const timers = debounceTimers.current;
    return () => { Object.values(timers).forEach(clearTimeout); };
  }, []);

  const { register, watch, reset } = useForm<BudgetForm>({
    resolver: zodResolver(budgetSchema),
    defaultValues: Object.fromEntries(EXPENSE_ROWS.map((r) => [r.id, ""])),
  });

  // sync store → form once personal data loads
  useEffect(() => {
    const values = Object.fromEntries(
      EXPENSE_ROWS.map((r) => [r.id, personalStates[r.id]?.value ?? ""]),
    );
    reset(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(personalStates).length]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const allValues = watch();
  const total = EXPENSE_ROWS.reduce((sum, r) => {
    const v = Number(allValues[r.id]?.replace(/,/g, "") || 0);
    return sum + (isNaN(v) ? 0 : v);
  }, 0);

  const handleChange = useCallback(
    (id: string, value: string) => {
      if (debounceTimers.current[id]) clearTimeout(debounceTimers.current[id]);
      debounceTimers.current[id] = setTimeout(() => {
        upsertPersonal(id, { value });
      }, 600);
    },
    [upsertPersonal],
  );

  const handleReset = useCallback(async () => {
    reset(Object.fromEntries(EXPENSE_ROWS.map((r) => [r.id, ""])));
    for (const r of EXPENSE_ROWS) upsertPersonal(r.id, { value: "" });
  }, [reset, upsertPersonal]);

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
        {/* 헤더: sm 이상에서만 표시 */}
        <div className="bg-muted/50 hidden grid-cols-[1fr_1fr_auto] items-center border-b px-4 py-2.5 sm:grid">
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">항목</span>
          <span className="text-muted-foreground text-[10px] font-bold tracking-wider uppercase">예상 금액</span>
          <span className="text-muted-foreground text-right text-[10px] font-bold tracking-wider uppercase">내 예산(원)</span>
        </div>

        {EXPENSE_ROWS.map((row) => (
          <div key={row.id}>
            {/* 모바일: 2줄 / 데스크탑: 1줄 3열 */}
            <div className="border-b px-4 py-3 last:border-0 sm:grid sm:grid-cols-[1fr_1fr_auto] sm:items-center">
              {/* 1열: 항목명 */}
              <span className="block font-medium sm:font-normal">{row.label}</span>
              {/* 2열 + 3열: 모바일에서 한 줄에 나란히 */}
              <div className="mt-1.5 flex items-center justify-between sm:contents">
                <span className="text-muted-foreground text-xs sm:text-sm">{row.estimate}</span>
                <Input
                  type="number"
                  min={0}
                  step={10000}
                  placeholder="0"
                  {...register(row.id, {
                    onChange: (e) => handleChange(row.id, e.target.value),
                  })}
                  className="w-24 text-right tabular-nums"
                />
              </div>
            </div>
            {row.subRows?.map((sub, i) => (
              <div
                key={`${row.id}_sub_${i}`}
                className="bg-muted/30 border-b px-4 py-2 text-xs text-muted-foreground last:border-0"
              >
                {sub.label}
              </div>
            ))}
          </div>
        ))}
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
      <p className="text-muted-foreground text-xs leading-relaxed">
        · 환율 기준: 9.44원/엔 (2026년 5월)
        <br />
        · 숙박 등급 및 식비 수준에 따라 크게 달라질 수 있음
        <br />· 쇼핑 예산은 개인 취향에 따라 조정
      </p>
    </div>
  );
}
