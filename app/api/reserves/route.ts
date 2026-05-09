import { NextResponse } from "next/server";

import { listReserveListings } from "@/lib/reserves";

export async function GET() {
  const listings = await listReserveListings();
  return NextResponse.json({ listings });
}
