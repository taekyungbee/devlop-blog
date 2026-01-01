import { PostCard } from "@/components/post-card";
import { getPostsByTag } from "@/lib/posts";
import { Metadata } from "next";

// 빌드 시 DB 연결 없이 동적 렌더링
export const dynamic = "force-dynamic";

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  return {
    title: `#${decodedTag}`,
    description: `${decodedTag} 태그가 포함된 포스트 목록입니다.`,
  };
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const tagPosts = await getPostsByTag(decodedTag);

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-bold text-4xl lg:text-5xl">
            #{decodedTag}
          </h1>
          <p className="text-xl text-muted-foreground">
            {tagPosts.length}개의 포스트가 있습니다.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {tagPosts.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {tagPosts.map((post) => (
            <li key={post.slug}>
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
        <p className="text-muted-foreground">포스트가 없습니다.</p>
      )}
    </div>
  );
}
