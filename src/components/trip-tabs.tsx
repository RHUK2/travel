"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DAYS } from "@/lib/trip-data";
import { useEffect, useRef, useState } from "react";
import { AirportTab } from "./airport-tab";
import { ChecklistTab } from "./checklist-tab";
import { DaySection } from "./day-section";
import { ExpenseTab } from "./expense-tab";

const TAB_STORAGE_KEY = "japan_active_tab";
const DEFAULT_TAB = "day1";

const DAY_LABELS = ["🏯 요나고", "🏖️ 돗토리·구라요시", "🎨 아다치·귀국"];

export function TripTabs() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_TAB;
    return localStorage.getItem(TAB_STORAGE_KEY) ?? DEFAULT_TAB;
  });

  const containerRef = useRef<HTMLDivElement>(null);
  const [mask, setMask] = useState<"none" | "left" | "right" | "both">("none");

  const updateMask = () => {
    const el = containerRef.current;
    if (!el) return;
    const canLeft = el.scrollLeft > 0;
    const canRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
    if (canLeft && canRight) setMask("both");
    else if (canLeft) setMask("left");
    else if (canRight) setMask("right");
    else setMask("none");
  };

  const drag = useRef({
    active: false,
    startX: 0,
    scrollLeft: 0,
    moved: false,
  });
  const pendingTab = useRef<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = containerRef.current;
    if (!el) return;
    pendingTab.current = null;
    drag.current = {
      active: true,
      startX: e.pageX - el.offsetLeft,
      scrollLeft: el.scrollLeft,
      moved: false,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!drag.current.active) return;
    e.preventDefault();
    const el = containerRef.current;
    if (!el) return;
    const walk = e.pageX - el.offsetLeft - drag.current.startX;
    if (Math.abs(walk) > 4) drag.current.moved = true;
    el.scrollLeft = drag.current.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    drag.current.active = false;
  };

  // Radix calls onValueChange on mousedown — store it without applying yet
  const handleValueChange = (value: string) => {
    pendingTab.current = value;
  };

  // Apply tab change only on click (after confirming no drag occurred)
  const handleContainerClick = () => {
    if (!drag.current.moved && pendingTab.current !== null) {
      setActiveTab(pendingTab.current);
      localStorage.setItem(TAB_STORAGE_KEY, pendingTab.current);
    }
    pendingTab.current = null;
    drag.current.moved = false;
  };

  return (
    <Tabs value={activeTab} onValueChange={handleValueChange}>
      <div
        ref={containerRef}
        className="cursor-grab [scrollbar-width:none] overflow-x-auto overflow-y-hidden select-none active:cursor-grabbing [&::-webkit-scrollbar]:hidden"
        style={{
          maskImage:
            mask === "both"
              ? "linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)"
              : mask === "left"
                ? "linear-gradient(to right, transparent 0%, black 5%)"
                : mask === "right"
                  ? "linear-gradient(to right, black 95%, transparent 100%)"
                  : undefined,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleContainerClick}
      >
        <TabsList className="gap-1.5 bg-transparent px-0 group-data-horizontal/tabs:h-auto py-1">
          {DAYS.map((day, i) => (
            <TabsTrigger
              key={`day${day.day}`}
              value={`day${day.day}`}
              className="data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-full border border-transparent px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm md:px-4 md:text-sm"
              style={
                activeTab === `day${day.day}`
                  ? {
                      backgroundColor: day.color,
                      color: "#fff",
                      borderColor: day.color,
                    }
                  : {}
              }
            >
              <span
                className="mr-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
                style={
                  activeTab === `day${day.day}`
                    ? { backgroundColor: "rgba(255,255,255,0.7)" }
                    : { backgroundColor: day.color }
                }
              />
              <span className="text-center leading-tight">
                6/{day.day} · {DAY_LABELS[i]}
              </span>
            </TabsTrigger>
          ))}
          <TabsTrigger
            value="info"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm md:px-4 md:text-sm"
          >
            🧳 준비물 &amp; 경비
          </TabsTrigger>
          <TabsTrigger
            value="airport"
            className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm md:px-4 md:text-sm"
          >
            ✈️ 공항 가이드
          </TabsTrigger>
        </TabsList>
      </div>

      {DAYS.map((day) => (
        <TabsContent
          key={`day${day.day}`}
          value={`day${day.day}`}
          className="mt-6"
        >
          <DaySection day={day} isActive={activeTab === `day${day.day}`} />
        </TabsContent>
      ))}

      <TabsContent value="info" className="mt-6 flex flex-col gap-8">
        <ChecklistTab />
        <ExpenseTab />
      </TabsContent>

      <TabsContent value="airport" className="mt-6">
        <AirportTab />
      </TabsContent>
    </Tabs>
  );
}
