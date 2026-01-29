import { NextRequest, NextResponse } from "next/server";
import {
  getConferenceHallById,
  updateConferenceHall,
  deleteConferenceHall,
} from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const hall = await getConferenceHallById(Number(id));
    if (!hall) {
      return NextResponse.json(
        { error: "Conference hall not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(hall);
  } catch (error) {
    console.error("Error fetching conference hall:", error);
    return NextResponse.json(
      { error: "Failed to fetch conference hall" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const data = await request.json();
    const hall = await updateConferenceHall(Number(id), data);
    if (!hall) {
      return NextResponse.json(
        { error: "Conference hall not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(hall);
  } catch (error) {
    console.error("Error updating conference hall:", error);
    return NextResponse.json(
      { error: "Failed to update conference hall" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deleted = await deleteConferenceHall(Number(id));
    if (!deleted) {
      return NextResponse.json(
        { error: "Conference hall not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting conference hall:", error);
    return NextResponse.json(
      { error: "Failed to delete conference hall" },
      { status: 500 },
    );
  }
}
