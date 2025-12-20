import { getAiTrends } from "@/lib/ai-trends";
import { TrendSection } from "@/components/trend-section";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "AI Trends - Dev Blog",
    description: "Daily updated AI news and videos from top creators",
};

export default async function TrendsPage() {
    const trends = await getAiTrends();

    return (
        <div className="container max-w-6xl py-10 lg:py-16 space-y-16">
            <div className="flex flex-col items-center text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                    Global AI Trends
                </h1>
                <p className="text-xl text-muted-foreground max-w-[700px]">
                    매일 00시 업데이트되는 최신 AI 뉴스와 비디오를 확인하세요.
                </p>
            </div>

            <div className="border-t border-border/40" />

            {/* Show ALL trends (no limit) */}
            <TrendSection trends={trends} />
        </div>
    );
}
