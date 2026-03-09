import { getRawPost, getAllRawPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { MDXContent } from "@/components/mdx/mdx-content";
import { GiscusComments } from "@/components/giscus-comments";
import { TableOfContents } from "@/components/toc";
import { RelatedResources } from "@/components/related-resources";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPostFromParams(params: PostPageProps["params"]) {
  const { slug } = await params;
  const slugStr = slug?.join("/");
  const post = getRawPost(slugStr);
  return post;
}

export function generateStaticParams() {
  const posts = getAllRawPosts();
  return posts.map((post) => ({
    slug: post.slugAsParams.split("/"),
  }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const post = await getPostFromParams(params);

  if (!post) {
    return {};
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description ?? undefined,
      type: "article",
      url: `${siteConfig.url}/${post.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description ?? undefined,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await getPostFromParams(params);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex gap-10">
        {/* 메인 콘텐츠 */}
        <article className="flex-1 min-w-0 max-w-3xl">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              {post.category && (
                <>
                  <span>•</span>
                  <Badge variant="outline">{post.category}</Badge>
                </>
              )}
            </div>
            <h1 className="font-bold text-4xl lg:text-5xl">{post.title}</h1>
            {post.description && (
              <p className="text-xl text-muted-foreground">{post.description}</p>
            )}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link key={tag} href={`/tags/${tag}`}>
                    <Badge variant="secondary">{tag}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <hr className="my-8" />
          <div className="prose prose-neutral dark:prose-invert max-w-none">
            <MDXContent code={post.body} />
          </div>
          <hr className="my-8" />
          <GiscusComments />
        </article>

        {/* 우측 사이드바: TOC + 관련 자료 */}
        <aside className="hidden xl:block w-64 shrink-0 space-y-8">
          <TableOfContents />
          <RelatedResources
            title={post.title}
            tags={post.tags ?? []}
          />
        </aside>
      </div>
    </div>
  );
}
