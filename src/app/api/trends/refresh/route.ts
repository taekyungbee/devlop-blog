import { NextResponse } from "next/server";
import { updateAiTrends } from "@/lib/ai-trends";

export async function POST() {
    try {
        // YouTube RSS와 News RSS에서 새 데이터 가져오기 (upsert)
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
