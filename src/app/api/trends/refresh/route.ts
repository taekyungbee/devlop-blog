import { NextResponse } from "next/server";
import { clearAllTrends } from "@/lib/db";
import { updateAiTrends } from "@/lib/ai-trends";

export async function POST() {
    try {
        // 1. DB에서 모든 기존 데이터 삭제
        await clearAllTrends();

        // 2. YouTube RSS와 News RSS에서 새 데이터 가져오기
        await updateAiTrends();

        return NextResponse.json({
            success: true,
            message: "AI Trends data refreshed successfully"
        });
    } catch (error) {
        console.error("[API] Refresh trends error:", error);
        return NextResponse.json(
            { success: false, error: String(error) },
            { status: 500 }
        );
    }
}
