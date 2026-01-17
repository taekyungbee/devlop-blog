import { NextResponse } from "next/server";
import { getAllChannels } from "@/lib/db";

// GET - 모든 채널 조회 (조회 전용)
export async function GET() {
  try {
    const channels = await getAllChannels();
    return NextResponse.json(channels);
  } catch (error) {
    console.error("Failed to get channels:", error);
    return NextResponse.json({ error: "Failed to get channels" }, { status: 500 });
  }
}
