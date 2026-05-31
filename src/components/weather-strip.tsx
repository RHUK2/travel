"use client";

import { useQuery } from "@tanstack/react-query";
import { WEATHER } from "@/lib/trip-data";
import { fetchWeather } from "@/lib/weather-queries";

interface WeatherStripProps {
  dayIndex: number;
}

function uvLabel(uv: number): string {
  if (uv <= 2) return "낮음";
  if (uv <= 5) return "보통";
  if (uv <= 7) return "높음";
  if (uv <= 10) return "매우높음";
  return "위험";
}

function uvClass(uv: number): string {
  if (uv <= 2) return "text-green-600 dark:text-green-400";
  if (uv <= 5) return "text-yellow-600 dark:text-yellow-400";
  if (uv <= 7) return "text-orange-500 dark:text-orange-400";
  return "text-red-500 dark:text-red-400";
}

export function WeatherStrip({ dayIndex }: WeatherStripProps) {
  const { data: weather = WEATHER } = useQuery({
    queryKey: ["weather"],
    queryFn: fetchWeather,
    staleTime: 60 * 60 * 1000,
  });

  const w = weather[dayIndex];
  if (!w) return null;

  return (
    <div className="rounded-xl border px-4 py-3 space-y-3">
      {/* 기온 */}
      <div className="flex items-center gap-3">
        <span className="text-3xl leading-none">{w.icon}</span>
        <div className="space-y-0.5">
          <p className="text-sm font-semibold leading-tight">{w.temp}</p>
          <p className="text-muted-foreground text-xs">체감 {w.feelsLike}</p>
        </div>
        <span className="ml-auto text-xs text-blue-500 font-medium">{w.rain}</span>
      </div>

      {/* 보조 정보 */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium ${uvClass(w.uv)}`}>
          ☀️ UV {w.uv} <span className="text-muted-foreground font-normal">({uvLabel(w.uv)})</span>
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          💨 {w.wind}km/h
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          🌅 {w.sunrise}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
          🌇 {w.sunset}
        </span>
      </div>
    </div>
  );
}
