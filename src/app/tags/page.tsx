import { posts } from "#site/content";
import { getAllTags } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export const metadata = {
  title: "Tags",
  description: "모든 태그 목록입니다.",
};

export default function TagsPage() {
  const tags = getAllTags(posts);
  const sortedTags = Object.entries(tags).sort((a, b) => b[1] - a[1]);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-bold text-4xl lg:text-5xl">Tags</h1>
          <p className="text-xl text-muted-foreground">
            총 {sortedTags.length}개의 태그가 있습니다.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      <div className="flex flex-wrap gap-3">
        {sortedTags.map(([tag, count]) => (
          <Link key={tag} href={`/tags/${tag}`}>
            <Badge
              variant="secondary"
              className="px-4 py-2 text-base hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
            >
              {tag} ({count})
            </Badge>
          </Link>
        ))}
      </div>
    </div>
  );
}
