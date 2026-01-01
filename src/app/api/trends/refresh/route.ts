import { NextRequest, NextResponse } from "next/server";
import { updateAiTrends } from "@/lib/ai-trends";

/**
 * POST /api/trends/refresh
 * 쿼리 파라미터:
 * - initialLoad=true: 2025년 7월 이후 모든 영상 수집
 * - 기본값: 전일자 영상만 수집
 */
export async function POST(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const initialLoad = searchParams.get("initialLoad") === "true";

        // YouTube RSS와 News RSS에서 새 데이터 가져오기 (upsert)
        await updateAiTrends({ initialLoad });

        return NextResponse.json({
            success: true,
            message: initialLoad
                ? "AI Trends data refreshed (initial load from July 2025)"
                : "AI Trends data refreshed (previous day only)"
        });
    } catch (error) {
        console.error("[API] Refresh trends error:", error);
        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}
