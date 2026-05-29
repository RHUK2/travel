"use client";

import { useCallback } from "react";
import { RotateCcw } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTripStore } from "@/store/trip-store";
import { CHECKLIST_GROUPS } from "@/lib/trip-data";
import { TRIP_ID } from "@/lib/trip-data";
import { supabase } from "@/lib/supabase";

export function ChecklistTab() {
  const { states, upsert, setItemState } = useTripStore();

  const handleToggle = useCallback(
    (itemId: string, checked: boolean) => {
      upsert(itemId, { is_done: checked });
    },
    [upsert],
  );

  const handleReset = useCallback(async () => {
    const ids = CHECKLIST_GROUPS.flatMap((g) => g.items.map((i) => i.id));
    for (const id of ids) setItemState(id, { is_done: false });
    await supabase
      .from("item_states")
      .update({ is_done: false } as Record<string, unknown>)
      .eq("trip_id", TRIP_ID)
      .in("item_id", ids);
  }, [setItemState]);

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

      {CHECKLIST_GROUPS.map((group) => (
        <div key={group.label} className="flex flex-col gap-2">
          <p className="text-muted-foreground text-[11px] font-bold tracking-widest uppercase">
            {group.label}
          </p>
          <div className="overflow-hidden rounded-xl border">
            {group.items.map((item, idx) => {
              const isDone = states[item.id]?.is_done ?? false;
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
      ))}
    </div>
  );
}
