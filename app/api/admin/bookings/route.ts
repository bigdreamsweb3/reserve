import { NextResponse } from "next/server";

import { isAdminAuthorized } from "@/lib/admin";
import { listReserveBookings } from "@/lib/reserves";

export async function GET(request: Request) {
  if (!(await isAdminAuthorized(request))) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const bookings = await listReserveBookings();
  return NextResponse.json({ bookings });
}
