"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { Search, X, Loader2 } from "lucide-react";
import { TrendItem } from "@/lib/ai-trends";
import { YouTubeChannelData, DbTrendItem, PaginatedResult } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrendsClientProps {
  initialVideos: PaginatedResult<DbTrendItem>;
  initialNews: PaginatedResult<DbTrendItem>;
  channels: YouTubeChannelData[];
}

export function TrendsClient({ initialVideos, initialNews, channels }: TrendsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "korean" | "global">("all");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Videos pagination state
  const [videos, setVideos] = useState<DbTrendItem[]>(initialVideos.items);
  const [videosPage, setVideosPage] = useState(1);
  const [videosTotalPages, setVideosTotalPages] = useState(initialVideos.totalPages);
  const [videosTotal, setVideosTotal] = useState(initialVideos.total);
  const [videosLoading, setVideosLoading] = useState(false);

  // News pagination state
  const [news, setNews] = useState<DbTrendItem[]>(initialNews.items);
  const [newsPage, setNewsPage] = useState(1);
  const [newsTotalPages, setNewsTotalPages] = useState(initialNews.totalPages);
  const [newsTotal, setNewsTotal] = useState(initialNews.total);
  const [newsLoading, setNewsLoading] = useState(false);

  // 채널을 카테고리별로 그룹화
  const koreanChannels = channels.filter((c) => c.category === "korean");
  const globalChannels = channels.filter((c) => c.category === "global");

  // 채널 선택 시 서버에서 새로 조회
  useEffect(() => {
    const fetchVideosForSource = async () => {
      setVideosLoading(true);
      try {
        const params = new URLSearchParams({
          page: "1",
          pageSize: "20",
        });
        if (selectedSource) {
          params.append("source", selectedSource);
        }

        const res = await fetch(`/api/trends/videos?${params}`);
        const data: PaginatedResult<DbTrendItem> = await res.json();

        setVideos(data.items);
        setVideosPage(1);
        setVideosTotalPages(data.totalPages);
        setVideosTotal(data.total);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setVideosLoading(false);
      }
    };

    fetchVideosForSource();
  }, [selectedSource]);

  // 검색 및 필터링된 비디오 (서버에서 source 필터링 완료, 클라이언트에서 카테고리/검색어만 필터)
  const filteredVideos = useMemo(() => {
    let result = videos;

    // 카테고리 필터 (source 선택 안 했을 때만)
    if (selectedCategory !== "all" && !selectedSource) {
      const channelNames = channels
        .filter((c) => c.category === selectedCategory)
        .map((c) => c.name);
      result = result.filter((v) => channelNames.includes(v.source));
    }

    // 검색어 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (v) =>
          v.title.toLowerCase().includes(query) ||
          v.source.toLowerCase().includes(query)
      );
    }

    return result;
  }, [videos, selectedCategory, selectedSource, searchQuery, channels]);

  // 검색 및 필터링된 뉴스
  const filteredNews = useMemo(() => {
    if (!searchQuery.trim()) return news;

    const query = searchQuery.toLowerCase();
    return news.filter(
      (n) =>
        n.title.toLowerCase().includes(query) ||
        n.source.toLowerCase().includes(query)
    );
  }, [news, searchQuery]);

  // Load more videos
  const loadMoreVideos = useCallback(async () => {
    if (videosLoading || videosPage >= videosTotalPages) return;

    setVideosLoading(true);
    try {
      const nextPage = videosPage + 1;
      const params = new URLSearchParams({
        page: nextPage.toString(),
        pageSize: "20",
      });
      if (selectedSource) {
        params.append("source", selectedSource);
      }

      const res = await fetch(`/api/trends/videos?${params}`);
      const data: PaginatedResult<DbTrendItem> = await res.json();

      setVideos((prev) => [...prev, ...data.items]);
      setVideosPage(nextPage);
      setVideosTotalPages(data.totalPages);
      setVideosTotal(data.total);
    } catch (error) {
      console.error("Failed to load more videos:", error);
    } finally {
      setVideosLoading(false);
    }
  }, [videosLoading, videosPage, videosTotalPages, selectedSource]);

  // Load more news
  const loadMoreNews = useCallback(async () => {
    if (newsLoading || newsPage >= newsTotalPages) return;

    setNewsLoading(true);
    try {
      const nextPage = newsPage + 1;
      const res = await fetch(`/api/trends/news?page=${nextPage}&pageSize=20`);
      const data: PaginatedResult<DbTrendItem> = await res.json();

      setNews((prev) => [...prev, ...data.items]);
      setNewsPage(nextPage);
      setNewsTotalPages(data.totalPages);
      setNewsTotal(data.total);
    } catch (error) {
      console.error("Failed to load more news:", error);
    } finally {
      setNewsLoading(false);
    }
  }, [newsLoading, newsPage, newsTotalPages]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedSource(null);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== "all" || selectedSource;

  return (
    <div className="container max-w-6xl py-10 lg:py-16 space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
          AI Trends
        </h1>
        <p className="text-xl text-muted-foreground max-w-[700px]">
          매일 00시 업데이트되는 최신 AI 뉴스와 비디오
        </p>
        <div className="flex gap-4 text-sm text-muted-foreground">
          <span>Videos: {videosTotal}개</span>
          <span>News: {newsTotal}개</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        {hasActiveFilters && (
          <Button variant="outline" onClick={clearFilters} className="gap-2">
            <X className="w-4 h-4" />
            필터 초기화
          </Button>
        )}
      </div>

      {/* Category Tabs */}
      <Tabs value={selectedCategory} onValueChange={(v) => {
        setSelectedCategory(v as "all" | "korean" | "global");
        setSelectedSource(null);
      }}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="korean">한국 채널</TabsTrigger>
          <TabsTrigger value="global">글로벌 채널</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Channel Filter */}
      <div className="flex flex-wrap gap-2">
        {(selectedCategory === "all" ? channels : selectedCategory === "korean" ? koreanChannels : globalChannels).map((channel) => (
          <Badge
            key={channel.channelId}
            variant={selectedSource === channel.name ? "default" : "outline"}
            className="cursor-pointer hover:bg-primary/20 transition-colors"
            onClick={() => setSelectedSource(selectedSource === channel.name ? null : channel.name)}
          >
            {channel.name}
          </Badge>
        ))}
      </div>

      <div className="border-t border-border/40" />

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Videos Section - 2 columns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span className="text-red-500">▶</span> Videos
              <span className="text-sm font-normal text-muted-foreground">
                ({filteredVideos.length} / {videosTotal})
              </span>
            </h2>
          </div>

          {filteredVideos.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              검색 결과가 없습니다.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredVideos.map((video, i) => (
                  <VideoCard key={`${video.link}-${i}`} video={video} />
                ))}
              </div>

              {/* Load More Button */}
              {videosPage < videosTotalPages && !searchQuery && (
                <div className="flex justify-center pt-4">
                  <Button
                    variant="outline"
                    onClick={loadMoreVideos}
                    disabled={videosLoading}
                    className="gap-2"
                  >
                    {videosLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        로딩 중...
                      </>
                    ) : (
                      <>더 보기 ({videosPage}/{videosTotalPages})</>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>

        {/* News Section - 1 column */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="text-blue-500">📰</span> News
            <span className="text-sm font-normal text-muted-foreground">
              ({filteredNews.length} / {newsTotal})
            </span>
          </h2>

          <Card className="bg-background/40 backdrop-blur border-muted/50">
            <CardContent className="p-0">
              {filteredNews.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  검색 결과가 없습니다.
                </div>
              ) : (
                <>
                  <ul className="divide-y divide-border/50 max-h-[600px] overflow-y-auto">
                    {filteredNews.map((item, i) => (
                      <li key={`${item.link}-${i}`}>
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-4 hover:bg-muted/50 transition-colors"
                        >
                          <h4 className="font-medium hover:text-primary transition-colors line-clamp-2 text-sm">
                            {item.title}
                          </h4>
                          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
                              {item.source}
                            </Badge>
                            <time>{new Date(item.pubDate).toLocaleDateString()}</time>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>

                  {/* Load More Button for News */}
                  {newsPage < newsTotalPages && !searchQuery && (
                    <div className="p-4 border-t border-border/50">
                      <Button
                        variant="ghost"
                        onClick={loadMoreNews}
                        disabled={newsLoading}
                        className="w-full gap-2"
                        size="sm"
                      >
                        {newsLoading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            로딩 중...
                          </>
                        ) : (
                          <>더 보기 ({newsPage}/{newsTotalPages})</>
                        )}
                      </Button>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function VideoCard({ video }: { video: DbTrendItem }) {
  const hasSummary = video.summary && !video.summary.startsWith("[");

  return (
    <a
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <Card className="overflow-hidden hover:bg-muted/50 transition-all border-none shadow-sm hover:shadow-lg bg-secondary/20">
        <div className="relative aspect-video bg-muted">
          {video.thumbnail && (
            <Image
              src={video.thumbnail}
              alt={video.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              unoptimized
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <div className="p-4">
          <h4 className="font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors text-sm">
            {video.title}
          </h4>
          {hasSummary && (
            <p className="mt-2 text-xs text-muted-foreground line-clamp-3">
              {video.summary}
            </p>
          )}
          <div className="flex items-center justify-between mt-2">
            <Badge variant="secondary" className="text-[10px] h-5 px-1.5">
              {video.source}
            </Badge>
            <time className="text-xs text-muted-foreground">
              {new Date(video.pubDate).toLocaleDateString()}
            </time>
          </div>
        </div>
      </Card>
    </a>
  );
}
