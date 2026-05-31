import type { WeatherDay } from "./types";
import { WEATHER } from "./trip-data";

export async function fetchWeather(): Promise<WeatherDay[]> {
  try {
    const res = await fetch("/api/weather");
    if (!res.ok) return WEATHER;
    const json = await res.json();
    return Array.isArray(json) && json.length ? json : WEATHER;
  } catch {
    return WEATHER;
  }
}
