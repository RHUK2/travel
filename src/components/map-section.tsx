"use client";

import { useEffect, useRef } from "react";
import { LocateFixed } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MapSpot } from "@/lib/types";

interface MapSectionProps {
  spots: MapSpot[];
  color: string;
}

export function MapSection({ spots, color }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const initialBoundsRef = useRef<[number, number][] | null>(null);

  const handleReset = () => {
    if (!mapInstanceRef.current || !initialBoundsRef.current) return;
    // @ts-expect-error leaflet map instance
    mapInstanceRef.current.fitBounds(initialBoundsRef.current, {
      padding: [40, 40],
      maxZoom: 13,
    });
  };

  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((L) => {
      if (mapInstanceRef.current) {
        // @ts-expect-error leaflet map instance
        mapInstanceRef.current.remove();
      }

      const map = L.map(mapRef.current!, {
        zoomControl: true,
        scrollWheelZoom: false,
      });
      mapInstanceRef.current = map;

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      const bounds: [number, number][] = [];
      const seen = new Set<string>();

      spots.forEach((s) => {
        const key = `${s.lat},${s.lng}`;
        if (seen.has(key)) return;
        seen.add(key);
        bounds.push([s.lat, s.lng]);

        const icon = L.divIcon({
          className: "",
          html: `<div style="width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid rgba(255,255,255,0.9);box-shadow:0 2px 8px rgba(0,0,0,0.35);display:flex;align-items:center;justify-content:center;"><span style="transform:rotate(45deg);font-size:14px;line-height:1">${s.emoji}</span></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 32],
          popupAnchor: [0, -34],
        });

        L.marker([s.lat, s.lng], { icon })
          .addTo(map)
          .bindPopup(
            `<strong style="font-size:13px">${s.name}</strong><br><span style="font-size:12px;color:#555">${s.desc}</span>`,
            { maxWidth: 220 },
          );
      });

      if (bounds.length > 0) {
        initialBoundsRef.current = bounds;
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        // @ts-expect-error leaflet map instance
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [spots, color]);

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="relative">
        <div ref={mapRef} className="h-[300px] w-full" />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleReset}
          className="absolute right-3 bottom-3 z-[1000] h-8 gap-1.5 rounded-full text-xs shadow-md"
        >
          <LocateFixed className="h-3.5 w-3.5" />
          초기화
        </Button>
      </div>
    </div>
  );
}
