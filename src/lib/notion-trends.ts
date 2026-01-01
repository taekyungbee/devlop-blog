/**
 * Notion Trends Integration
 * AI Trends 요약을 노션 데이터베이스에 저장
 */

import { Client } from "@notionhq/client";
import { prisma } from "./prisma";

const NOTION_API_KEY = process.env.NOTION_TRENDS_API_KEY;
const NOTION_TRENDS_DB_ID = process.env.NOTION_TRENDS_DB_ID;

let notionClient: Client | null = null;

function getNotionClient(): Client {
  if (!NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY is not configured");
  }
  if (!notionClient) {
    notionClient = new Client({ auth: NOTION_API_KEY });
  }
  return notionClient;
}

export function isNotionConfigured(): boolean {
  return !!(NOTION_API_KEY && NOTION_TRENDS_DB_ID);
}

interface VideoForNotion {
  id: number;
  title: string;
  link: string;
  source: string;
  summary: string;
  pubDate: Date;
}

/**
 * 요약된 영상을 노션에 등록
 */
export async function addVideoToNotion(video: VideoForNotion): Promise<boolean> {
  try {
    const notion = getNotionClient();

    await notion.pages.create({
      parent: { database_id: NOTION_TRENDS_DB_ID! },
      properties: {
        Title: {
          title: [{ text: { content: video.title } }],
        },
        Source: {
          select: { name: video.source },
        },
        Summary: {
          rich_text: [{ text: { content: video.summary.slice(0, 2000) } }],
        },
        Link: {
          url: video.link,
        },
        PubDate: {
          date: { start: video.pubDate.toISOString().split("T")[0] },
        },
      },
    });

    console.log(`[Notion] Added: ${video.title.slice(0, 50)}...`);
    return true;
  } catch (error) {
    console.error(`[Notion] Failed to add video:`, error);
    return false;
  }
}

/**
 * 오늘 요약된 영상들을 노션에 일괄 등록
 */
export async function syncTodaySummariesToNotion(): Promise<{
  total: number;
  success: number;
  failed: number;
}> {
  if (!isNotionConfigured()) {
    console.warn("[Notion] Not configured");
    return { total: 0, success: 0, failed: 0 };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 오늘 요약된 영상 조회 (실제 요약이 있는 것만)
  const videos = await prisma.trendVideo.findMany({
    where: {
      summary: {
        not: null,
        notIn: ["[자막 없음]", "[URL 파싱 실패]", "[요약 실패]"],
      },
      createdAt: { gte: today },
    },
    orderBy: { pubDate: "desc" },
    select: {
      id: true,
      title: true,
      link: true,
      source: true,
      summary: true,
      pubDate: true,
    },
  });

  console.log(`[Notion] Syncing ${videos.length} videos...`);

  let success = 0;
  let failed = 0;

  for (const video of videos) {
    if (!video.summary) continue;

    const result = await addVideoToNotion({
      ...video,
      summary: video.summary,
    });

    if (result) {
      success++;
    } else {
      failed++;
    }

    // Rate limit 방지
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`[Notion] Sync complete: ${success}/${videos.length} success`);

  return { total: videos.length, success, failed };
}

/**
 * 최근 요약된 영상 N개를 노션에 등록
 */
export async function syncRecentSummariesToNotion(
  limit: number = 10
): Promise<{ total: number; success: number; failed: number }> {
  if (!isNotionConfigured()) {
    console.warn("[Notion] Not configured");
    return { total: 0, success: 0, failed: 0 };
  }

  const videos = await prisma.trendVideo.findMany({
    where: {
      summary: {
        not: null,
        notIn: ["[자막 없음]", "[URL 파싱 실패]", "[요약 실패]"],
      },
    },
    orderBy: { pubDate: "desc" },
    take: limit,
    select: {
      id: true,
      title: true,
      link: true,
      source: true,
      summary: true,
      pubDate: true,
    },
  });

  console.log(`[Notion] Syncing ${videos.length} recent videos...`);

  let success = 0;
  let failed = 0;

  for (const video of videos) {
    if (!video.summary) continue;

    const result = await addVideoToNotion({
      ...video,
      summary: video.summary,
    });

    if (result) {
      success++;
    } else {
      failed++;
    }

    await new Promise((r) => setTimeout(r, 500));
  }

  return { total: videos.length, success, failed };
}
