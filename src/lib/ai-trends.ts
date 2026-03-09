/**
 * AI Trends - rag-collector API를 통한 조회
 * 수집/가공은 rag-collector 프로젝트에서 처리
 */

import {
  searchVideos,
  searchNews,
  type RagSearchResult,
} from "./rag-search";

export interface TrendItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  thumbnail?: string;
  summary?: string;
}

export interface AiTrends {
  videos: TrendItem[];
  news: TrendItem[];
}

/**
 * RagSearchResult → TrendItem 변환
 */
function toTrendItem(result: RagSearchResult): TrendItem {
  const metadata = result.metadata as Record<string, unknown>;
  return {
    title: result.title,
    link: result.url,
    pubDate: result.publishedAt,
    source: (metadata?.source as string) ?? extractSource(result),
    thumbnail: (metadata?.thumbnail as string) ?? undefined,
    summary: result.summary || undefined,
  };
}

/**
 * sourceType/tags에서 source 이름 추출
 */
function extractSource(result: RagSearchResult): string {
  if (result.tags.length > 0) {
    return result.tags[0];
  }
  return result.sourceType;
}

/**
 * AI Trends 데이터 조회 (rag-collector API)
 */
export async function getAiTrends(): Promise<AiTrends> {
  const [videoResults, newsResults] = await Promise.all([
    searchVideos("", 50),
    searchNews("", 20),
  ]);

  return {
    videos: videoResults.map(toTrendItem),
    news: newsResults.map(toTrendItem),
  };
}
