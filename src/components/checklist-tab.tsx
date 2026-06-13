"use client";

import { useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTripStore } from "@/store/trip-store";
import { CHECKLIST_GROUPS } from "@/lib/trip-data";
import { supabase } from "@/lib/supabase";

export function ChecklistTab() {
  const { personalStates, currentUser, upsertPersonal, setPersonalState } =
    useTripStore();

  const handleToggle = useCallback(
    (itemId: string, checked: boolean) => {
      upsertPersonal(itemId, { is_done: checked });
    },
    [upsertPersonal],
  );

  const handleReset = useCallback(async () => {
    if (!currentUser) return;
    const ids = CHECKLIST_GROUPS.flatMap((g) => g.items.map((i) => i.id));
    for (const id of ids) setPersonalState(id, { is_done: false });
    await supabase
      .from("personal_states")
      .update({ is_done: false } as Record<string, unknown>)
      .eq("user_id", currentUser.id)
      .in("item_id", ids);
  }, [currentUser, setPersonalState]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-muted-foreground text-sm font-bold tracking-widest uppercase">
          ✈️ 출발 전 체크리스트
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

      {CHECKLIST_GROUPS.map((group, idx) => {
        const prevGroup = CHECKLIST_GROUPS[idx - 1];
        const isNewSection = idx === 0 || prevGroup.section !== group.section;
        return (
          <div key={group.label} className="flex flex-col gap-2">
            {isNewSection && (
              <div className="flex items-center gap-2 pt-1">
                <span className="bg-primary text-primary-foreground rounded-full px-2.5 py-0.5 text-[11px] font-bold">
                  {group.section === "해외" ? "✈️ 해외" : "🏠 국내"}
                </span>
                <div className="bg-border h-px flex-1" />
              </div>
            )}
            <p className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
              {group.label}
            </p>
            <div className="overflow-hidden rounded-xl border">
              {group.items.map((item, idx) => {
                const isDone = personalStates[item.id]?.is_done ?? false;
                return (
                  <div key={item.id}>
                    <label className="hover:bg-muted/50 flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors">
                      <Checkbox
                        checked={isDone}
                        onCheckedChange={(checked) =>
                          handleToggle(item.id, !!checked)
                        }
                      />
                      <span
                        className={
                          isDone ? "text-muted-foreground line-through" : ""
                        }
                      >
                        {item.label}
                      </span>
                      {item.note && (
                        <span className="text-muted-foreground ml-auto text-xs">
                          {item.note}
                        </span>
                      )}
                    </label>
                    {idx < group.items.length - 1 && <Separator />}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
