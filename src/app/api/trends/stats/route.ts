import { NextResponse } from "next/server";
import { getStats } from "@/lib/rag-search";

/**
 * GET /api/trends/stats
 * rag-collector 기반 트렌드 통계
 */
export async function GET() {
  try {
    const stats = await getStats();

    return NextResponse.json({
      channels: 0, // rag-collector에서는 별도 채널 카운트 불필요
      videos: {
        count: stats.videos.count,
        oldest: null,
        latest: stats.videos.latest,
      },
      news: {
        count: stats.news.count,
        oldest: null,
        latest: stats.news.latest,
      },
    });
  } catch {
    return NextResponse.json({
      channels: 0,
      videos: { count: 0, oldest: null, latest: null },
      news: { count: 0, oldest: null, latest: null },
    });
  }
}
