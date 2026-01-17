/**
 * Database Operations - 조회 전용
 * 수집/저장은 ai-trends-collector 프로젝트에서 처리
 */

import { prisma } from "./prisma";

export interface DbTrendItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  thumbnail?: string;
  summary?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function getVideosFromDb(limit = 10): Promise<DbTrendItem[]> {
  const videos = await prisma.trendVideo.findMany({
    orderBy: { pubDate: "desc" },
    take: limit,
  });

  return videos.map((v) => ({
    title: v.title,
    link: v.link,
    pubDate: v.pubDate.toISOString(),
    source: v.source,
    thumbnail: v.thumbnail ?? undefined,
    summary: v.summary ?? undefined,
  }));
}

export async function getVideosPaginated(
  page = 1,
  pageSize = 20,
  source?: string
): Promise<PaginatedResult<DbTrendItem>> {
  const where = source ? { source } : {};

  const [videos, total] = await Promise.all([
    prisma.trendVideo.findMany({
      where,
      orderBy: { pubDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.trendVideo.count({ where }),
  ]);

  return {
    items: videos.map((v) => ({
      title: v.title,
      link: v.link,
      pubDate: v.pubDate.toISOString(),
      source: v.source,
      thumbnail: v.thumbnail ?? undefined,
      summary: v.summary ?? undefined,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function getNewsFromDb(limit = 10): Promise<DbTrendItem[]> {
  const news = await prisma.trendNews.findMany({
    orderBy: { pubDate: "desc" },
    take: limit,
  });

  return news.map((n) => ({
    title: n.title,
    link: n.link,
    pubDate: n.pubDate.toISOString(),
    source: n.source,
    summary: n.summary ?? undefined,
  }));
}

export async function getNewsPaginated(
  page = 1,
  pageSize = 20
): Promise<PaginatedResult<DbTrendItem>> {
  const [news, total] = await Promise.all([
    prisma.trendNews.findMany({
      orderBy: { pubDate: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.trendNews.count(),
  ]);

  return {
    items: news.map((n) => ({
      title: n.title,
      link: n.link,
      pubDate: n.pubDate.toISOString(),
      source: n.source,
      summary: n.summary ?? undefined,
    })),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

// YouTube Channel 조회
export interface YouTubeChannelData {
  channelId: string;
  name: string;
  category: "korean" | "global";
}

export async function getActiveChannels(): Promise<YouTubeChannelData[]> {
  const channels = await prisma.youTubeChannel.findMany({
    where: { active: true },
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });

  return channels.map((c) => ({
    channelId: c.channelId,
    name: c.name,
    category: c.category as "korean" | "global",
  }));
}

export async function getAllChannels() {
  return prisma.youTubeChannel.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

// 비디오를 채널별로 그룹화해서 조회
export async function getVideosBySource(limit = 5): Promise<Record<string, DbTrendItem[]>> {
  const videos = await prisma.trendVideo.findMany({
    orderBy: { pubDate: "desc" },
    take: 100,
  });

  const grouped: Record<string, DbTrendItem[]> = {};
  for (const v of videos) {
    if (!grouped[v.source]) {
      grouped[v.source] = [];
    }
    if (grouped[v.source].length < limit) {
      grouped[v.source].push({
        title: v.title,
        link: v.link,
        pubDate: v.pubDate.toISOString(),
        source: v.source,
        thumbnail: v.thumbnail ?? undefined,
      });
    }
  }

  return grouped;
}
