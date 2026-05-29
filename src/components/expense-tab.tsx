"use client";

import { useEffect, useCallback, useRef, Fragment } from "react";
import { RotateCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useTripStore } from "@/store/trip-store";
import { EXPENSE_ROWS } from "@/lib/trip-data";

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

      <div className="overflow-hidden rounded-xl border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="text-muted-foreground px-4 py-2.5 text-left text-[10px] font-bold tracking-wider uppercase">
                항목
              </th>
              <th className="text-muted-foreground px-4 py-2.5 text-left text-[10px] font-bold tracking-wider uppercase">
                예상 금액
              </th>
              <th className="text-muted-foreground px-4 py-2.5 text-right text-[10px] font-bold tracking-wider uppercase">
                내 예산(원)
              </th>
            </tr>
          </thead>
          <tbody>
            {EXPENSE_ROWS.map((row) => (
              <Fragment key={row.id}>
                <tr className="border-b last:border-0">
                  <td className="px-4 py-3">{row.label}</td>
                  <td className="text-muted-foreground px-4 py-3">
                    {row.estimate}
                  </td>
                  <td className="px-4 py-3 text-right">
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
                  </td>
                </tr>
                {row.subRows?.map((sub, i) => (
                  <tr
                    key={`${row.id}_sub_${i}`}
                    className="bg-muted/30 border-b last:border-0"
                  >
                    <td
                      colSpan={3}
                      className="text-muted-foreground px-4 py-2 text-xs"
                    >
                      {sub.label}
                    </td>
                  </tr>
                ))}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <Card className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/50">
        <CardContent className="flex items-center justify-between px-4 py-3">
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
