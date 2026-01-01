import { NextResponse } from "next/server";
import { getAllPosts } from "@/lib/posts";

export async function GET() {
  try {
    const posts = await getAllPosts();

    const searchablePosts = posts.map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
    }));

    return NextResponse.json(searchablePosts);
  } catch (error) {
    console.error("[Search API] Error:", error);
    return NextResponse.json([], { status: 500 });
  }
}
