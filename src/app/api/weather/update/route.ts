import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";
import type { WeatherDay } from "@/lib/types";

const WMO_EMOJI: Record<number, string> = {
  0: "☀️",
  1: "🌤", 2: "🌤",
  3: "⛅",
  45: "🌫", 48: "🌫",
  51: "🌧", 53: "🌧", 55: "🌧",
  61: "🌧", 63: "🌧", 65: "🌧",
  71: "❄️", 73: "❄️", 75: "❄️", 77: "❄️",
  80: "🌦", 81: "🌦", 82: "🌦",
  85: "🌨", 86: "🌨",
  95: "⛈", 96: "⛈", 99: "⛈",
};

function wmoEmoji(code: number): string {
  if (WMO_EMOJI[code]) return WMO_EMOJI[code];
  if (code >= 45 && code <= 48) return "🌫";
  if (code >= 51 && code <= 67) return "🌧";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌦";
  if (code >= 85 && code <= 86) return "🌨";
  if (code >= 95) return "⛈";
  return "⛅";
}

const DAY_LABELS = ["6/1 · Day 1", "6/2 · Day 2", "6/3 · Day 3"];

const OPEN_METEO_URL =
  "https://api.open-meteo.com/v1/forecast" +
  "?latitude=35.43&longitude=133.33" +
  "&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min" +
  ",precipitation_probability_max,weathercode,uv_index_max,wind_speed_10m_max,sunrise,sunset" +
  "&timezone=Asia/Tokyo&start_date=2026-06-01&end_date=2026-06-03";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch(OPEN_METEO_URL);
  if (!res.ok) {
    return NextResponse.json({ error: "Open-Meteo 요청 실패" }, { status: 502 });
  }

  const json = await res.json();
  const d = json.daily as {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    precipitation_probability_max: number[];
    weathercode: number[];
    uv_index_max: number[];
    wind_speed_10m_max: number[];
    sunrise: string[];
    sunset: string[];
  };

  const weather: WeatherDay[] = d.time.map((_, i) => ({
    label: DAY_LABELS[i],
    icon: wmoEmoji(d.weathercode[i]),
    temp: `${Math.round(d.temperature_2m_min[i])}° ~ ${Math.round(d.temperature_2m_max[i])}°C`,
    feelsLike: `${Math.round(d.apparent_temperature_min[i])}° ~ ${Math.round(d.apparent_temperature_max[i])}°C`,
    rain: `🌧 강수 ${d.precipitation_probability_max[i]}%`,
    uv: Math.round(d.uv_index_max[i]),
    wind: Math.round(d.wind_speed_10m_max[i]),
    sunrise: d.sunrise[i].slice(11, 16),
    sunset: d.sunset[i].slice(11, 16),
  }));

  const { error } = await supabase
    .from("weather_cache")
    .upsert({ trip_id: TRIP_ID, data: weather }, { onConflict: "trip_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, updated: weather.length });
}
