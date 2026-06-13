"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TAB_KEY } from "@/lib/constants";
import { DAYS } from "@/lib/trip-data";
import type { Category } from "@/lib/types";
import { useEffect, useRef, useState } from "react";
import { AirportTab } from "./airport-tab";
import { CategoryTab } from "./category-tab";
import { ChecklistTab } from "./checklist-tab";
import { ExpenseTab } from "./expense-tab";
import { MapSection } from "./map-section";

const DEFAULT_TAB = "sight";

const CATEGORY_GROUPS: {
  value: string;
  label: string;
  icon: string;
  categories: Category[];
}[] = [
  {
    value: "sight",
    label: "관광 & 체험",
    icon: "🏛️",
    categories: ["sight", "sight2", "hot"],
  },
  { value: "food", label: "식사", icon: "🍜", categories: ["food"] },
  { value: "move", label: "이동", icon: "🚌", categories: ["move"] },
  { value: "sleep", label: "숙박", icon: "🛏", categories: ["sleep"] },
  { value: "shop", label: "쇼핑", icon: "🛍", categories: ["shop"] },
  { value: "etc", label: "기타", icon: "📌", categories: ["etc"] },
];

const ALL_ITEMS = DAYS.flatMap((day) => day.items);
const ALL_SPOTS = DAYS.flatMap((day) => day.mapSpots);

export function TripTabs() {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window === "undefined") return DEFAULT_TAB;
    return localStorage.getItem(TAB_KEY) ?? DEFAULT_TAB;
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

  // Apply tab change only if no drag occurred
  const handleContainerClick = () => {
    if (!drag.current.moved && pendingTab.current !== null) {
      setActiveTab(pendingTab.current);
      localStorage.setItem(TAB_KEY, pendingTab.current);
    }
    pendingTab.current = null;
    drag.current.moved = false;
  };

  return (
    <div className="flex flex-col gap-6">
      <MapSection spots={ALL_SPOTS} color="#6366f1" />
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
          <TabsList className="gap-1.5 bg-transparent px-0 py-1 group-data-horizontal/tabs:h-auto">
            {CATEGORY_GROUPS.map((group) => (
              <TabsTrigger
                key={group.value}
                value={group.value}
                className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm md:px-4 md:text-sm"
              >
                {group.icon} {group.label}
              </TabsTrigger>
            ))}
            <TabsTrigger
              value="checklist"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm md:px-4 md:text-sm"
            >
              🧳 준비물
            </TabsTrigger>
            <TabsTrigger
              value="expense"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm md:px-4 md:text-sm"
            >
              💴 경비
            </TabsTrigger>
            <TabsTrigger
              value="airport"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all data-[state=active]:shadow-sm md:px-4 md:text-sm"
            >
              ✈️ 공항 가이드
            </TabsTrigger>
          </TabsList>
        </div>

        {CATEGORY_GROUPS.map((group) => (
          <TabsContent key={group.value} value={group.value} className="mt-6">
            <CategoryTab
              items={ALL_ITEMS.filter((item) =>
                group.categories.includes(item.category),
              )}
            />
          </TabsContent>
        ))}

        <TabsContent value="checklist" className="mt-6">
          <ChecklistTab />
        </TabsContent>

        <TabsContent value="expense" className="mt-6">
          <ExpenseTab />
        </TabsContent>

        <TabsContent value="airport" className="mt-6">
          <AirportTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
