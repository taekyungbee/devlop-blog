import { posts, Post } from "#velite";

// Re-export Post type for use in components
export type { Post };

// Post type with computed fields (for backwards compatibility)
export interface PostWithTags {
  id?: number;
  slug: string;
  slugAsParams: string;
  title: string;
  description: string | null;
  content: string;
  published: boolean;
  category: string | null;
  date: string;
  tags: string[];
  body: string;
}

// Transform velite post to PostWithTags format
function transformPost(post: Post): PostWithTags {
  return {
    slug: post.slug,
    slugAsParams: post.slugAsParams,
    title: post.title,
    description: post.description ?? null,
    content: post.body, // MDX body as content
    published: post.published,
    category: post.category ?? null,
    date: post.date,
    tags: post.tags,
    body: post.body,
  };
}

// Get all published posts
export function getAllPosts(): PostWithTags[] {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(transformPost);
}

// Get post by slug (full path like "posts/hello-world")
export function getPostBySlug(slug: string): PostWithTags | null {
  const post = posts.find((p) => p.slug === slug && p.published);
  return post ? transformPost(post) : null;
}

// Get post by slugAsParams (e.g., "hello-world")
export function getPostBySlugParams(slugParams: string): PostWithTags | null {
  const post = posts.find((p) => p.slugAsParams === slugParams && p.published);
  return post ? transformPost(post) : null;
}

// Get posts by tag
export function getPostsByTag(tagName: string): PostWithTags[] {
  return posts
    .filter((post) => post.published && post.tags.includes(tagName))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(transformPost);
}

// Get posts by category
export function getPostsByCategory(categoryName: string): PostWithTags[] {
  return posts
    .filter((post) => post.published && post.category === categoryName)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(transformPost);
}

// Get all tags with count
export function getAllTags(): Record<string, number> {
  const tagCounts: Record<string, number> = {};

  posts
    .filter((post) => post.published)
    .forEach((post) => {
      post.tags.forEach((tag) => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

  return tagCounts;
}

// Get all categories with count
export function getAllCategories(): Record<string, number> {
  const categoryCounts: Record<string, number> = {};

  posts
    .filter((post) => post.published && post.category)
    .forEach((post) => {
      const category = post.category!;
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });

  return categoryCounts;
}

// Sort posts by date (descending)
export function sortPosts(postsToSort: PostWithTags[]): PostWithTags[] {
  return [...postsToSort].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get latest posts with limit
export function getLatestPosts(limit: number = 5): PostWithTags[] {
  return getAllPosts().slice(0, limit);
}

// Get raw velite post (for MDX rendering)
export function getRawPost(slugParams: string): Post | null {
  return posts.find((p) => p.slugAsParams === slugParams && p.published) ?? null;
}

// Get all raw posts (for sitemap, etc.)
export function getAllRawPosts(): Post[] {
  return posts.filter((post) => post.published);
}
