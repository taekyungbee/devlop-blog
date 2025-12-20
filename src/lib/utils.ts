import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Post } from "#site/content"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function sortPosts(posts: Post[]) {
  return posts.sort((a, b) => {
    if (a.date > b.date) return -1
    if (a.date < b.date) return 1
    return 0
  })
}

export function getAllTags(posts: Post[]) {
  const tags: Record<string, number> = {}
  posts.forEach((post) => {
    if (post.published) {
      post.tags?.forEach((tag) => {
        tags[tag] = (tags[tag] ?? 0) + 1
      })
    }
  })
  return tags
}

export function getPostsByTag(posts: Post[], tag: string) {
  return posts.filter((post) => {
    if (!post.published) return false
    return post.tags?.includes(tag)
  })
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-ㄱ-ㅎㅏ-ㅣ가-힣]+/g, "")
}
