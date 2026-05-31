import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const res = await fetch("https://open.er-api.com/v6/latest/JPY");
  if (!res.ok) {
    return NextResponse.json({ error: "환율 API 요청 실패" }, { status: 502 });
  }

  const json = await res.json();
  const rate: number | undefined = json?.rates?.KRW;

  if (typeof rate !== "number") {
    return NextResponse.json({ error: "KRW 환율 파싱 실패" }, { status: 502 });
  }

  const { error } = await supabase
    .from("rate_cache")
    .upsert({ trip_id: TRIP_ID, rate }, { onConflict: "trip_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, rate });
}
