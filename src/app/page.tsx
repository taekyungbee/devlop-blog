import Image from "next/image";
import Link from "next/link";
import { posts } from "#site/content";
import { PostCard } from "@/components/post-card";
import { sortPosts } from "@/lib/utils";
import { getAiTrends } from "@/lib/ai-trends";
import { TrendSection } from "@/components/trend-section";

export default async function Home() {
  const latestPosts = sortPosts(posts.filter((post) => post.published)).slice(0, 6);
  const aiTrends = await getAiTrends();

  return (
    <div className="container max-w-6xl py-10 lg:py-16 space-y-16">
      <section className="flex flex-col items-center text-center space-y-6">
        <div className="relative w-32 h-32 md:w-40 md:h-40 animate-blob hover:scale-110 transition-transform duration-500">
          <Image
            src="/nano-banana.png"
            alt="Nano Banana Mascot"
            fill
            className="object-contain drop-shadow-[0_0_15px_rgba(139,92,246,0.6)]"
            priority
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent animate-in fade-in slide-in-from-bottom-4 duration-1000">
          Dev Blog
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-[700px] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
          탐험하고, 배우고, 기록하는 개발자의 여정
        </p>
      </section>

      <div className="border-t border-border/40" />

      <TrendSection trends={aiTrends} limit={5} />

      <div className="border-t border-border/40" />

      <section className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Latest Posts</h2>
          <Link
            href="/posts"
            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 group"
          >
            모두 보기
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </div>

        {latestPosts.length > 0 ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestPosts.map((post, index) => (
              <li
                key={post.slug}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PostCard
                  slug={post.slug}
                  title={post.title}
                  description={post.description}
                  date={post.date}
                  tags={post.tags}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-center py-20">아직 작성된 포스트가 없습니다.</p>
        )}
      </section>
    </div>
  );
}
