import { getAllPosts } from "@/lib/posts";
import { Search } from "@/components/search";

export async function SearchWrapper() {
  const posts = await getAllPosts();

  const searchablePosts = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    description: post.description,
  }));

  return <Search posts={searchablePosts} />;
}
