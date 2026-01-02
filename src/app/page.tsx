import Image from "next/image";
import Link from "next/link";
import { getLatestPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";
import { getAiTrends } from "@/lib/ai-trends";
import { TrendSection } from "@/components/trend-section";

// 빌드 시 DB 연결 없이 동적 렌더링
export const dynamic = "force-dynamic";

export default async function Home() {
  const latestPosts = getLatestPosts(6);
  const aiTrends = await getAiTrends();

  return (
    <div className="container max-w-6xl py-10 lg:py-16 space-y-16">
      <section className="relative w-full h-[400px] md:h-[500px] rounded-3xl overflow-hidden flex flex-col items-center justify-center text-center space-y-6 shadow-2xl border border-white/20 group">
        <Image
          src="/hero-bg-lazybee.png"
          alt="AI Dev Lab Hero Background"
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
          priority
        />
        <div className="absolute inset-0 bg-white/5 dark:bg-black/20 backdrop-blur-[1px]" />

        {/* Text Content - No Box, Just Text */}
        <div className="relative z-10 flex flex-col items-center gap-2 mt-40 md:mt-48 transition-transform hover:-translate-y-1 duration-300">
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-4 duration-1000">
            AI Dev Lab
          </h1>
          <p className="text-lg md:text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
            by <span className="text-yellow-300">lazybee</span>
          </p>
          <p className="mt-2 text-sm md:text-base font-medium text-white/90 drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            AI와 함께, 더 가치 있는 일에 몰입합니다.
          </p>
        </div>
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
                  category={post.category ?? undefined}
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
