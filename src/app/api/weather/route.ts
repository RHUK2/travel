import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function GET() {
  const { data, error } = await supabase
    .from("weather_cache")
    .select("data")
    .eq("trip_id", TRIP_ID)
    .single();

  if (error || !data) return NextResponse.json([]);

  return NextResponse.json(data.data);
}
