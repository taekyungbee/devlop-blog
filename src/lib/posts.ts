import { prisma } from "./prisma";
import { cache } from "react";

// Post type with tags for frontend use
export interface PostWithTags {
  id: number;
  slug: string;
  slugAsParams: string;
  title: string;
  description: string | null;
  content: string;
  published: boolean;
  date: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Transform DB post to frontend format
function transformPost(post: {
  id: number;
  slug: string;
  title: string;
  description: string | null;
  content: string;
  published: boolean;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
  postTags: { tag: { name: string } }[];
}): PostWithTags {
  return {
    id: post.id,
    slug: post.slug,
    slugAsParams: post.slug.split("/").slice(1).join("/"),
    title: post.title,
    description: post.description,
    content: post.content,
    published: post.published,
    date: post.date.toISOString(),
    tags: post.postTags.map((pt) => pt.tag.name),
    createdAt: post.createdAt,
    updatedAt: post.updatedAt,
  };
}

// Get all posts
export const getAllPosts = cache(async (): Promise<PostWithTags[]> => {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { date: "desc" },
    include: {
      postTags: {
        include: { tag: true },
      },
    },
  });

  return posts.map(transformPost);
});

// Get post by slug
export const getPostBySlug = cache(
  async (slug: string): Promise<PostWithTags | null> => {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    });

    if (!post) return null;
    return transformPost(post);
  }
);

// Get post by slugAsParams (e.g., "hello-world" from "posts/hello-world")
export const getPostBySlugParams = cache(
  async (slugParams: string): Promise<PostWithTags | null> => {
    const fullSlug = `posts/${slugParams}`;
    return getPostBySlug(fullSlug);
  }
);

// Get posts by tag
export const getPostsByTag = cache(
  async (tagName: string): Promise<PostWithTags[]> => {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
        postTags: {
          some: {
            tag: { name: tagName },
          },
        },
      },
      orderBy: { date: "desc" },
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    });

    return posts.map(transformPost);
  }
);

// Get all tags with count
export const getAllTags = cache(async (): Promise<Record<string, number>> => {
  const tags = await prisma.tag.findMany({
    include: {
      _count: {
        select: { postTags: true },
      },
    },
  });

  const tagCounts: Record<string, number> = {};
  for (const tag of tags) {
    if (tag._count.postTags > 0) {
      tagCounts[tag.name] = tag._count.postTags;
    }
  }

  return tagCounts;
});

// Sort posts by date (descending)
export function sortPosts(posts: PostWithTags[]): PostWithTags[] {
  return [...posts].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

// Get latest posts with limit
export const getLatestPosts = cache(
  async (limit: number = 5): Promise<PostWithTags[]> => {
    const posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
      take: limit,
      include: {
        postTags: {
          include: { tag: true },
        },
      },
    });

    return posts.map(transformPost);
  }
);
