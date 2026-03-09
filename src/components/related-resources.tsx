"use client";

import { useState, useEffect } from "react";
import { Sparkles, ExternalLink, Loader2 } from "lucide-react";
import { Card } from "@/components/ui";
import { Badge } from "@/components/ui";

interface RelatedItem {
  title: string;
  url: string;
  source: string;
  sourceType: string;
  summary?: string;
  publishedAt: string;
}

interface RelatedResourcesProps {
  title: string;
  tags: string[];
}

export function RelatedResources({ title, tags }: RelatedResourcesProps) {
  const [items, setItems] = useState<RelatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const query = [title, ...tags].join(" ");
        const res = await fetch("/api/trends/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query, limit: 5 }),
        });
        const data = await res.json();

        if (data.success && data.data?.results) {
          setItems(
            data.data.results.map(
              (r: {
                title: string;
                url: string;
                sourceType: string;
                summary?: string;
                publishedAt: string;
                metadata?: Record<string, unknown>;
                tags?: string[];
              }) => ({
                title: r.title,
                url: r.url,
                source:
                  (r.metadata?.source as string) ??
                  r.tags?.[0] ??
                  r.sourceType,
                sourceType: r.sourceType,
                summary: r.summary || undefined,
                publishedAt: r.publishedAt,
              })
            )
          );
        }
      } catch (error) {
        console.error("Failed to fetch related resources:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [title, tags]);

  if (loading) {
    return (
      <div className="space-y-3">
        <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          관련 자료
        </h3>
        <div className="flex items-center justify-center py-4 text-muted-foreground">
          <Loader2 className="w-4 h-4 animate-spin" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold flex items-center gap-2 text-muted-foreground">
        <Sparkles className="w-4 h-4" />
        관련 자료
      </h3>
      <div className="space-y-2">
        {items.map((item, i) => (
          <a
            key={`${item.url}-${i}`}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <Card className="p-3 bg-background/40 border-muted/50 hover:bg-muted/50 transition-colors">
              <div className="flex items-start gap-2">
                <ExternalLink className="w-3 h-3 mt-1 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                <div className="min-w-0">
                  <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">
                    {item.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className="text-[9px] h-4 px-1 font-normal"
                    >
                      {item.source}
                    </Badge>
                    <time className="text-[10px] text-muted-foreground">
                      {new Date(item.publishedAt).toLocaleDateString()}
                    </time>
                  </div>
                </div>
              </div>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
