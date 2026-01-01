import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { MetadataRoute } from "next";

// 빌드 시 DB 연결 없이 동적 렌더링
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  const publishedPosts = posts.map((post) => ({
    url: `${siteConfig.url}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const routes = ["", "/posts", "/tags", "/about"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes, ...publishedPosts];
}
