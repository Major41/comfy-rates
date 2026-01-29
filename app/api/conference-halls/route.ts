import { NextRequest, NextResponse } from "next/server";
import { getConferenceHalls, createConferenceHall } from "@/lib/db";

export async function GET() {
  try {
    const halls = await getConferenceHalls();
    return NextResponse.json(halls);
  } catch (error) {
    console.error("Error fetching conference halls:", error);
    return NextResponse.json(
      { error: "Failed to fetch conference halls" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const hall = await createConferenceHall(data);
    return NextResponse.json(hall);
  } catch (error) {
    console.error("Error creating conference hall:", error);
    return NextResponse.json(
      { error: "Failed to create conference hall" },
      { status: 500 },
    );
  }
}
