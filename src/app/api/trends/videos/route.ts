import { NextRequest, NextResponse } from "next/server";
import { getVideosPaginated } from "@/lib/db";

/**
 * GET /api/trends/videos
 * 페이징된 비디오 목록 조회
 *
 * Query params:
 * - page: 페이지 번호 (기본값: 1)
 * - pageSize: 페이지당 개수 (기본값: 20, 최대: 100)
 * - source: 채널명 필터 (선택)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Math.max(1, parseInt(searchParams.get("page") || "1"));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get("pageSize") || "20")));
    const source = searchParams.get("source") || undefined;

    const result = await getVideosPaginated(page, pageSize, source);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to get videos:", error);
    return NextResponse.json({ error: "Failed to get videos" }, { status: 500 });
  }
}
