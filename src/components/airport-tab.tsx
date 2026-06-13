"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AIRPORT_BLOCKS, TRAVEL_TIPS } from "@/lib/trip-data";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";

export function AirportTab() {
  return (
    <div className="flex flex-col gap-5">
      {/* Accordion */}
      <Accordion type="multiple" className="flex flex-col gap-2">
        {AIRPORT_BLOCKS.map((block, idx) => (
          <AccordionItem
            key={block.title}
            value={`block-${idx}`}
            className="overflow-hidden rounded-xl border"
          >
            <AccordionTrigger className="hover:bg-muted/50 rounded-none px-4 py-3.5 hover:no-underline">
              <span className="flex flex-1 items-center justify-between pr-2">
                <span className="font-semibold">{block.title}</span>
                <span className="text-muted-foreground text-xs">
                  {block.steps.length}단계
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="p-0">
              <div className="border-t">
                {block.steps.map((step, stepIdx) => (
                  <div
                    key={step.num}
                    className={cn(
                      "px-4 py-3.5",
                      stepIdx < block.steps.length - 1 && "border-b",
                    )}
                  >
                    <div className="flex gap-3">
                      <span className="bg-primary text-primary-foreground flex h-5 w-5 shrink-0 items-center justify-center self-start rounded-full text-[11px] font-bold">
                        {step.num}
                      </span>
                      <div className="flex flex-1 flex-col gap-1.5">
                        <Badge
                          variant="secondary"
                          className="w-fit rounded-full text-[10px] font-bold tracking-wide"
                        >
                          {step.tag}
                        </Badge>
                        <div className="font-semibold">{step.title}</div>
                        <div className="text-muted-foreground text-sm">
                          {step.body}
                        </div>
                        {step.tip && (
                          <div className="border-muted-foreground/30 bg-muted/50 text-muted-foreground rounded-r-lg border-l-2 p-2.5 text-xs leading-relaxed">
                            {step.tip}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* Travel Tips */}
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground px-1 text-xs font-semibold tracking-wide uppercase">
          알아두면 좋은 팁
        </p>
        {TRAVEL_TIPS.map((tip) => (
          <Card key={tip.title} className="bg-muted/40">
            <CardContent className="flex gap-3 px-4 py-3.5">
              <Info className="text-muted-foreground mt-0.5 h-4 w-4 shrink-0" />
              <div className="flex flex-col gap-0.5">
                <p className="font-semibold">{tip.title}</p>
                <p className="text-muted-foreground text-sm">{tip.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
