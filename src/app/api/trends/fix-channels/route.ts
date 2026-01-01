import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { fetchHistoricalVideos } from "@/lib/youtube-api";
import { saveVideos } from "@/lib/db";

// 수정할 채널 ID 매핑
const CHANNEL_FIXES = [
  {
    name: "코딩애플",
    oldId: "UCVHFbqXqoYvEWM1Ddxl0QKg",
    newId: "UCSLrpBAzr-ROVGHQ5EmxnUg",
  },
  {
    name: "생활코딩",
    oldId: "UC7e5wDphCNmPxQbkVOLbUTQ",
    newId: "UCvc8kv-i5fvFTJBFAk6n1SA",
  },
  {
    name: "개발바닥",
    oldId: "UCsrN-kJNb3EAPDtxOFDFSdA",
    newId: "UCSEOUzkGNCT_29EU_vnBYjg",
  },
  {
    name: "Two Minute Papers",
    oldId: "UCBFxh_9Tr_J-u7RcYvrJ0Kg",
    newId: "UCbfYPyITQ-7l4upoX8nvctg",
  },
  {
    name: "OpenAI",
    oldId: "UCxgknM36W5jYZk6QY_194_g",
    newId: "UCXZCJLdBC09xxGZ6gcdrc6A",
  },
];

export async function POST() {
  try {
    const results = [];

    // 1. Delete old channel records with wrong IDs
    for (const fix of CHANNEL_FIXES) {
      // Check if old record exists
      const oldRecord = await prisma.youTubeChannel.findUnique({
        where: { channelId: fix.oldId },
      });

      if (oldRecord) {
        await prisma.youTubeChannel.delete({
          where: { channelId: fix.oldId },
        });
        results.push(`Deleted old record: ${fix.name} (${fix.oldId})`);
      }

      // Check if new record exists
      const newRecord = await prisma.youTubeChannel.findUnique({
        where: { channelId: fix.newId },
      });

      if (!newRecord) {
        // Create new record with correct ID
        await prisma.youTubeChannel.create({
          data: {
            channelId: fix.newId,
            name: fix.name,
            category: fix.name.match(/[가-힣]/) ? "korean" : "global",
            active: true,
          },
        });
        results.push(`Created new record: ${fix.name} (${fix.newId})`);
      } else {
        results.push(`Already exists: ${fix.name} (${fix.newId})`);
      }
    }

    // 2. Backfill videos for updated channels
    const channels = CHANNEL_FIXES.map((c) => ({
      channelId: c.newId,
      name: c.name,
    }));

    const startDate = "2025-11-01";
    const videos = await fetchHistoricalVideos(channels, startDate);

    if (videos.length > 0) {
      await saveVideos(videos);
    }

    // 3. Get updated stats
    const totalVideos = await prisma.trendVideo.count();

    return NextResponse.json({
      success: true,
      channelUpdates: results,
      backfill: {
        channelsProcessed: channels.length,
        videosFound: videos.length,
        startDate,
      },
      totalVideos,
    });
  } catch (error) {
    console.error("Fix channels error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

export async function GET() {
  // 현재 채널 상태 조회
  const channels = await prisma.youTubeChannel.findMany({
    where: { active: true },
    orderBy: { name: "asc" },
  });

  const videoCount = await prisma.trendVideo.groupBy({
    by: ["source"],
    _count: { source: true },
    orderBy: { _count: { source: "desc" } },
  });

  return NextResponse.json({
    channels: channels.map((c) => ({
      name: c.name,
      channelId: c.channelId,
      category: c.category,
    })),
    videoCounts: videoCount,
  });
}
