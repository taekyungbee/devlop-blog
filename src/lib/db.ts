/**
 * Database Types & Utilities
 *
 * 트렌드 데이터 조회는 rag-collector API로 전환됨.
 * 이 파일은 기존 코드 호환을 위한 타입 정의만 유지.
 */

import {
  searchVideos,
  searchNews,
  ragSearch,
  type RagSearchResult,
} from "./rag-search";

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

export interface YouTubeChannelData {
  channelId: string;
  name: string;
  category: "korean" | "global";
}

/**
 * RagSearchResult → DbTrendItem 변환
 */
function toDbTrendItem(result: RagSearchResult): DbTrendItem {
  const metadata = result.metadata as Record<string, unknown>;
  return {
    title: result.title,
    link: result.url,
    pubDate: result.publishedAt,
    source: (metadata?.source as string) ?? result.tags[0] ?? result.sourceType,
    thumbnail: (metadata?.thumbnail as string) ?? undefined,
    summary: result.summary || undefined,
  };
}

/**
 * 비디오 페이지네이션 조회 (rag-collector API)
 */
export async function getVideosPaginated(
  page = 1,
  pageSize = 20,
  source?: string
): Promise<PaginatedResult<DbTrendItem>> {
  try {
    const limit = pageSize;
    const query = source ? `AI ${source}` : "AI technology";

    const response = await ragSearch({
      query,
      limit: limit * page, // 전체를 가져와서 페이지네이션
      sourceTypes: ["YOUTUBE_CHANNEL"],
      ...(source ? { tags: [source] } : {}),
    });

    const allItems = response.data.results.map(toDbTrendItem);
    const total = response.data.total;
    const startIdx = (page - 1) * pageSize;
    const items = allItems.slice(startIdx, startIdx + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch {
    console.warn("[db.ts] video paginated 조회 실패 - 빈 결과 반환");
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }
}

/**
 * 뉴스 페이지네이션 조회 (rag-collector API)
 */
export async function getNewsPaginated(
  page = 1,
  pageSize = 20
): Promise<PaginatedResult<DbTrendItem>> {
  try {
    const response = await ragSearch({
      query: "AI technology news",
      limit: pageSize * page,
      sourceTypes: ["RSS_FEED", "WEB_CRAWL"],
    });

    const allItems = response.data.results.map(toDbTrendItem);
    const total = response.data.total;
    const startIdx = (page - 1) * pageSize;
    const items = allItems.slice(startIdx, startIdx + pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  } catch {
    console.warn("[db.ts] news paginated 조회 실패 - 빈 결과 반환");
    return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }
}

/**
 * 활성 채널 조회 (rag-collector sources에서 추출)
 */
export async function getActiveChannels(): Promise<YouTubeChannelData[]> {
  try {
    // rag-collector에서 YouTube 소스 전체를 가져와 채널 이름 추출
    const response = await ragSearch({
      query: "AI",
      limit: 200,
      sourceTypes: ["YOUTUBE_CHANNEL"],
    });

    // 고유 채널 이름 추출
    const channelMap = new Map<string, YouTubeChannelData>();
    for (const result of response.data.results) {
      const metadata = result.metadata as Record<string, unknown>;
      const name =
        (metadata?.source as string) ??
        result.tags[0] ??
        "Unknown";
      const category =
        (metadata?.category as "korean" | "global") ?? "global";

      if (!channelMap.has(name)) {
        channelMap.set(name, {
          channelId: name, // rag-collector에는 channelId가 없으므로 name으로 대체
          name,
          category,
        });
      }
    }

    return Array.from(channelMap.values()).sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.name.localeCompare(b.name);
    });
  } catch {
    console.warn("[db.ts] channels 조회 실패 - 빈 배열 반환");
    return [];
  }
}

/**
 * @deprecated rag-collector로 전환됨. getActiveChannels 사용.
 */
export async function getAllChannels(): Promise<YouTubeChannelData[]> {
  return getActiveChannels();
}

/**
 * 비디오 조회 (단순 목록)
 */
export async function getVideosFromDb(limit = 10): Promise<DbTrendItem[]> {
  const results = await searchVideos("", limit);
  return results.map(toDbTrendItem);
}

/**
 * 뉴스 조회 (단순 목록)
 */
export async function getNewsFromDb(limit = 10): Promise<DbTrendItem[]> {
  const results = await searchNews("", limit);
  return results.map(toDbTrendItem);
}
