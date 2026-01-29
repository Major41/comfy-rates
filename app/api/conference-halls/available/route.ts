import { NextRequest, NextResponse } from "next/server";
import { getAvailableConferenceHalls } from "@/lib/db";

export async function GET() {
  try {
    const halls = await getAvailableConferenceHalls();
    return NextResponse.json(halls);
  } catch (error) {
    console.error("Error fetching available conference halls:", error);
    return NextResponse.json(
      { error: "Failed to fetch conference halls" },
      { status: 500 },
    );
  }
}
