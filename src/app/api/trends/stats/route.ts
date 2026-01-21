import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const videoCount = await prisma.trendVideo.count();
    const newsCount = await prisma.trendNews.count();
    const channelCount = await prisma.youTubeChannel.count({ where: { active: true } });

    const latestVideo = await prisma.trendVideo.findFirst({ orderBy: { pubDate: "desc" } });
    const oldestVideo = await prisma.trendVideo.findFirst({ orderBy: { pubDate: "asc" } });
    const latestNews = await prisma.trendNews.findFirst({ orderBy: { pubDate: "desc" } });
    const oldestNews = await prisma.trendNews.findFirst({ orderBy: { pubDate: "asc" } });

    return NextResponse.json({
      channels: channelCount,
      videos: {
        count: videoCount,
        oldest: oldestVideo?.pubDate,
        latest: latestVideo?.pubDate,
      },
      news: {
        count: newsCount,
        oldest: oldestNews?.pubDate,
        latest: latestNews?.pubDate,
      },
    });
  } catch {
    // 테이블이 없을 경우 기본값 반환
    return NextResponse.json({
      channels: 0,
      videos: { count: 0, oldest: null, latest: null },
      news: { count: 0, oldest: null, latest: null },
    });
  }
}
