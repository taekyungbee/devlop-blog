/**
 * RAG Collector API Client
 * rag-collector 서비스의 검색 API를 호출하는 클라이언트
 */

const RAG_COLLECTOR_URL =
  process.env.RAG_COLLECTOR_URL || "http://localhost:11008";

export interface RagSearchResult {
  id: string;
  title: string;
  content: string;
  url: string;
  score: number;
  sourceType: string;
  summary: string;
  metadata: Record<string, unknown>;
  tags: string[];
  publishedAt: string;
}

export interface RagSearchResponse {
  success: boolean;
  data: {
    results: RagSearchResult[];
    total: number;
  };
}

export interface RagSearchParams {
  query: string;
  limit?: number;
  threshold?: number;
  sourceTypes?: string[];
  tags?: string[];
}

/**
 * rag-collector 검색 API 호출
 */
export async function ragSearch(
  params: RagSearchParams
): Promise<RagSearchResponse> {
  try {
    const res = await fetch(`${RAG_COLLECTOR_URL}/api/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(
        `[rag-search] API error: ${res.status} ${res.statusText}`
      );
      return { success: false, data: { results: [], total: 0 } };
    }

    return (await res.json()) as RagSearchResponse;
  } catch (error) {
    console.error("[rag-search] Failed to call rag-collector:", error);
    return { success: false, data: { results: [], total: 0 } };
  }
}

/**
 * YouTube 영상 검색 (sourceTypes: YOUTUBE_CHANNEL)
 */
export async function searchVideos(
  query = "",
  limit = 50,
  threshold = 0
): Promise<RagSearchResult[]> {
  const params: RagSearchParams = {
    query: query || "AI technology",
    limit,
    threshold,
    sourceTypes: ["YOUTUBE_CHANNEL"],
  };

  const response = await ragSearch(params);
  return response.data.results;
}

/**
 * 뉴스 검색 (sourceTypes: RSS_FEED 등 YouTube 이외)
 */
export async function searchNews(
  query = "",
  limit = 20,
  threshold = 0
): Promise<RagSearchResult[]> {
  const params: RagSearchParams = {
    query: query || "AI technology news",
    limit,
    threshold,
    sourceTypes: ["RSS_FEED", "WEB_CRAWL"],
  };

  const response = await ragSearch(params);
  return response.data.results;
}

/**
 * 전체 소스 통계 조회
 */
export async function getStats(): Promise<{
  videos: { count: number; latest: string | null };
  news: { count: number; latest: string | null };
}> {
  try {
    // 비디오 통계
    const videosRes = await ragSearch({
      query: "AI",
      limit: 1,
      sourceTypes: ["YOUTUBE_CHANNEL"],
    });

    // 뉴스 통계
    const newsRes = await ragSearch({
      query: "AI",
      limit: 1,
      sourceTypes: ["RSS_FEED", "WEB_CRAWL"],
    });

    return {
      videos: {
        count: videosRes.data.total,
        latest: videosRes.data.results[0]?.publishedAt ?? null,
      },
      news: {
        count: newsRes.data.total,
        latest: newsRes.data.results[0]?.publishedAt ?? null,
      },
    };
  } catch (error) {
    console.error("[rag-search] Failed to get stats:", error);
    return {
      videos: { count: 0, latest: null },
      news: { count: 0, latest: null },
    };
  }
}

/**
 * 관련 자료 추천 (블로그 포스트 기반)
 */
export async function getRelatedResources(
  title: string,
  tags: string[] = [],
  limit = 5
): Promise<RagSearchResult[]> {
  const query = [title, ...tags].join(" ");
  const params: RagSearchParams = {
    query,
    limit,
    threshold: 0.3,
  };

  const response = await ragSearch(params);
  return response.data.results;
}
