import { NextResponse } from "next/server";
import { getActiveChannels } from "@/lib/db";

/**
 * GET /api/channels
 * rag-collector 기반 채널 목록 조회
 */
export async function GET() {
  try {
    const channels = await getActiveChannels();
    return NextResponse.json(channels);
  } catch (error) {
    console.error("Failed to get channels:", error);
    return NextResponse.json({ error: "Failed to get channels" }, { status: 500 });
  }
}
