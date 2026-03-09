import { NextRequest, NextResponse } from "next/server";
import { ragSearch } from "@/lib/rag-search";

/**
 * POST /api/trends/search
 * rag-collector 벡터 검색 프록시
 *
 * Body: { query: string, limit?: number, sourceTypes?: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { query, limit = 20, sourceTypes } = body as {
      query: string;
      limit?: number;
      sourceTypes?: string[];
    };

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        { error: "query is required" },
        { status: 400 }
      );
    }

    const response = await ragSearch({
      query,
      limit: Math.min(limit, 100),
      sourceTypes,
      threshold: 0.1,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("Failed to search:", error);
    return NextResponse.json(
      { error: "Failed to search" },
      { status: 500 }
    );
  }
}
