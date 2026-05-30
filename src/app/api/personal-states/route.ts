import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const { data, error } = await supabase
    .from("personal_states")
    .select("*")
    .eq("trip_id", TRIP_ID)
    .eq("user_id", userId);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
