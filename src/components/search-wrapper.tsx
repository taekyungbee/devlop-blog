import { posts } from "#site/content";
import { Search } from "@/components/search";

export function SearchWrapper() {
  const searchablePosts = posts
    .filter((post) => post.published)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
    }));

  return <Search posts={searchablePosts} />;
}
