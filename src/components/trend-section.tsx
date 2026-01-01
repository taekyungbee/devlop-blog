import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { AiTrends } from "@/lib/ai-trends";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TrendSectionProps {
    trends: AiTrends;
    limit?: number;
}

export function TrendSection({ trends, limit }: TrendSectionProps) {
    const displayVideos = limit ? trends.videos.slice(0, limit) : trends.videos;
    const displayNews = limit ? trends.news.slice(0, limit) : trends.news;

    return (
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">AI Trends</h2>
                    <span className="text-sm text-muted-foreground">Updated automatically</span>
                </div>
                {limit && (
                    <Link
                        href="/trends"
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
                    >
                        더보기
                        <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* YouTube Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <span className="text-red-500">▶</span> Latest Videos
                    </h3>
                    <div className="grid gap-4">
                        {displayVideos.map((video, i) => (
                            <a
                                key={i}
                                href={video.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <Card className="flex overflow-hidden hover:bg-muted/50 transition-colors border-none shadow-sm hover:shadow-md bg-secondary/20 h-full">
                                    <div className="relative w-40 min-w-40 bg-muted">
                                        {video.thumbnail && (
                                            <Image
                                                src={video.thumbnail}
                                                alt={video.title}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                                unoptimized
                                            />
                                        )}
                                    </div>
                                    <div className="p-4 flex flex-col justify-between flex-1">
                                        <div>
                                            <h4 className="font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                {video.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {video.source}
                                            </p>
                                        </div>
                                        <time className="text-xs text-muted-foreground mt-2">
                                            {new Date(video.pubDate).toLocaleDateString()}
                                        </time>
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>

                {/* News Section */}
                <div className="space-y-4">
                    <h3 className="text-xl font-semibold flex items-center gap-2">
                        <span className="text-blue-500">📰</span> AI News
                    </h3>
                    <div className="grid gap-4">
                        {displayNews.map((item, i) => (
                            <a
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group block"
                            >
                                <Card className="flex overflow-hidden hover:bg-muted/50 transition-colors border-none shadow-sm hover:shadow-md bg-secondary/20 h-full">
                                    <div className="relative w-40 min-w-40 bg-muted/50 flex items-center justify-center">
                                        <span className="text-3xl grayscale group-hover:grayscale-0 transition-all duration-300">📰</span>
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                    <div className="p-4 flex flex-col justify-between flex-1">
                                        <div>
                                            <h4 className="font-medium line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h4>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.source}
                                            </p>
                                        </div>
                                        <time className="text-xs text-muted-foreground mt-2">
                                            {new Date(item.pubDate).toLocaleDateString()}
                                        </time>
                                    </div>
                                </Card>
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
