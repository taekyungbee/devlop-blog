/**
 * AI Trends - 조회 전용
 * 수집/가공은 ai-trends-collector 프로젝트에서 처리
 */

import {
  getVideosFromDb,
  getNewsFromDb,
  DbTrendItem,
} from "./db";

export type TrendItem = DbTrendItem;

export interface AiTrends {
  videos: TrendItem[];
  news: TrendItem[];
}

/**
 * AI Trends 데이터 조회 (DB에서 읽기만)
 */
export async function getAiTrends(): Promise<AiTrends> {
  const videos = await getVideosFromDb(50);
  const news = await getNewsFromDb(20);

  return { videos, news };
}
