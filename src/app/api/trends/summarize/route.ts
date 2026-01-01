import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getTranscript, extractVideoId } from "@/lib/youtube-transcript";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

/**
 * GET /api/trends/summarize
 * 요약 상태 조회
 */
export async function GET() {
  try {
    const pendingCount = await prisma.trendVideo.count({
      where: { summary: null },
    });

    const summarizedCount = await prisma.trendVideo.count({
      where: { summary: { not: null } },
    });

    const pendingVideos = await prisma.trendVideo.findMany({
      where: { summary: null },
      orderBy: { pubDate: "desc" },
      take: 10,
      select: { title: true, source: true },
    });

    return NextResponse.json({
      geminiConfigured: !!GEMINI_API_KEY,
      pendingCount,
      summarizedCount,
      pendingVideos,
    });
  } catch (error) {
    console.error("[Summarize API] GET Error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

// Gemini로 요약
async function summarizeWithGemini(text: string, title: string): Promise<string> {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const isKorean = /[가-힣]/.test(title);
  const prompt = isKorean
    ? `다음 유튜브 영상 자막을 300자 이내로 요약해주세요.
제목: ${title}

핵심 내용만 간결하게 정리해주세요.

자막:
${text.slice(0, 10000)}`
    : `Summarize this YouTube video transcript in 300 characters or less.
Title: ${title}

Transcript:
${text.slice(0, 10000)}`;

  const result = await model.generateContent(prompt);
  return result.response.text();
}

/**
 * POST /api/trends/summarize
 * 영상 요약 실행
 */
export async function POST(request: NextRequest) {
  try {
    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API not configured" },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { limit = 5 } = body;

    const videos = await prisma.trendVideo.findMany({
      where: { summary: null },
      orderBy: { pubDate: "desc" },
      take: limit,
      select: { id: true, title: true, link: true, source: true },
    });

    const results: { title: string; status: string }[] = [];

    for (const video of videos) {
      try {
        const videoId = extractVideoId(video.link);
        if (!videoId) {
          await prisma.trendVideo.update({
            where: { id: video.id },
            data: { summary: "[URL 파싱 실패]" },
          });
          results.push({ title: video.title, status: "invalid_url" });
          continue;
        }

        const transcript = await getTranscript(videoId);
        if (!transcript) {
          // 자막 없음으로 표시하되, 나중에 재시도할 수 있도록 null로 유지
          // 일부 영상은 rate limit으로 인해 임시로 실패할 수 있음
          results.push({ title: video.title, status: "no_transcript_or_rate_limited" });
          continue;
        }

        const summary = await summarizeWithGemini(transcript, video.title);
        await prisma.trendVideo.update({
          where: { id: video.id },
          data: { summary },
        });
        results.push({ title: video.title, status: "success" });

        // Rate limit (분당 15회)
        await new Promise((r) => setTimeout(r, 4500));
      } catch (err) {
        await prisma.trendVideo.update({
          where: { id: video.id },
          data: { summary: "[요약 실패]" },
        });
        results.push({ title: video.title, status: `error: ${err}` });
      }
    }

    return NextResponse.json({
      processed: videos.length,
      results,
    });
  } catch (error) {
    console.error("[Summarize API] POST Error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
