"use client";

import { useRef } from "react";
import { LocateFixed } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  type MapRef,
} from "@/components/ui/map";
import type { MapSpot } from "@/lib/types";

interface MapSectionProps {
  spots: MapSpot[];
  color: string;
  className?: string;
}

export function MapSection({ spots, color, className }: MapSectionProps) {
  const mapRef = useRef<MapRef>(null);

  const uniqueSpots = spots.filter(
    (s, i, arr) =>
      arr.findIndex((x) => x.lat === s.lat && x.lng === s.lng) === i,
  );

  const lngs = uniqueSpots.map((s) => s.lng);
  const lats = uniqueSpots.map((s) => s.lat);
  const initialBounds: [[number, number], [number, number]] | undefined =
    uniqueSpots.length > 0
      ? [
          [Math.min(...lngs), Math.min(...lats)],
          [Math.max(...lngs), Math.max(...lats)],
        ]
      : undefined;

  const fitBounds = () => {
    if (!mapRef.current || !initialBounds) return;
    mapRef.current.fitBounds(initialBounds, {
      padding: 60,
      maxZoom: 13,
      duration: 600,
    });
  };

  return (
    <div className={cn("overflow-hidden rounded-xl border", className)}>
      <div className="relative isolate h-full min-h-[300px]">
        <Map
          ref={mapRef}
          bounds={initialBounds}
          fitBoundsOptions={{ padding: 60, maxZoom: 13 }}
          className="h-full w-full"
        >
          {uniqueSpots.map((s) => (
            <MapMarker
              key={`${s.lat},${s.lng}`}
              longitude={s.lng}
              latitude={s.lat}
            >
              <MarkerContent>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50% 50% 50% 0",
                    transform: "rotate(-45deg)",
                    background: color,
                    border: "2px solid rgba(255,255,255,0.9)",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      transform: "rotate(45deg)",
                      fontSize: 14,
                      lineHeight: 1,
                    }}
                  >
                    {s.emoji}
                  </span>
                </div>
              </MarkerContent>
              <MarkerPopup closeButton>
                <p className="text-sm font-semibold">{s.name}</p>
                <p className="text-muted-foreground text-xs">{s.desc}</p>
              </MarkerPopup>
            </MapMarker>
          ))}
        </Map>
        <Button
          variant="secondary"
          size="sm"
          onClick={fitBounds}
          className="absolute bottom-3 right-3 z-[1000] h-8 gap-1.5 rounded-full text-xs shadow-md"
        >
          <LocateFixed data-icon="inline-start" />
          초기화
        </Button>
      </div>
    </div>
  );
}
