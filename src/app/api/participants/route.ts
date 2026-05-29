import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function GET() {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("trip_id", TRIP_ID)
    .order("joined_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
