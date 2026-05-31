const FALLBACK_RATE = 9.44;

export async function fetchRate(): Promise<number> {
  try {
    const res = await fetch("/api/rate");
    if (!res.ok) return FALLBACK_RATE;
    const json = await res.json();
    return typeof json.rate === "number" ? json.rate : FALLBACK_RATE;
  } catch {
    return FALLBACK_RATE;
  }
}
