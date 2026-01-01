import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/post-card";

export const metadata = {
  title: "Posts",
  description: "모든 블로그 포스트 목록입니다.",
};

export default async function PostsPage() {
  const sortedPosts = await getAllPosts();

  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-bold text-4xl lg:text-5xl">
            All Posts
          </h1>
          <p className="text-xl text-muted-foreground">
            총 {sortedPosts.length}개의 포스트가 있습니다.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      {sortedPosts.length > 0 ? (
        <ul className="flex flex-col gap-4">
          {sortedPosts.map((post) => (
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
        <p className="text-muted-foreground">아직 작성된 포스트가 없습니다.</p>
      )}
    </div>
  );
}
