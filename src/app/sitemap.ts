import { getAllPosts } from "@/lib/posts";
import { siteConfig } from "@/config/site";
import { MetadataRoute } from "next";
import { projects } from "#site/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const publishedPosts = posts.map((post) => ({
    url: `${siteConfig.url}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const projectPages = projects.map((project) => ({
    url: `${siteConfig.url}/${project.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const routes = ["", "/posts", "/projects", "/trends", "/tags", "/about"].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return [...routes, ...publishedPosts, ...projectPages];
}
