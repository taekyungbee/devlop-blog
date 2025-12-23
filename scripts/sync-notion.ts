import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import fs from "fs";
import path from "path";

const NOTION_API_KEY = process.env.NOTION_API_KEY;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error("NOTION_API_KEY와 NOTION_DATABASE_ID 환경변수가 필요합니다.");
  process.exit(1);
}

const notion = new Client({ auth: NOTION_API_KEY });
const n2m = new NotionToMarkdown({ notionClient: notion });

interface NotionPage {
  id: string;
  properties: {
    Title?: { title: Array<{ plain_text: string }> };
    Slug?: { rich_text: Array<{ plain_text: string }> };
    Tags?: { multi_select: Array<{ name: string }> };
    Published?: { checkbox: boolean };
    Date?: { date: { start: string } | null };
    Description?: { rich_text: Array<{ plain_text: string }> };
  };
}

async function getPublishedPosts(): Promise<NotionPage[]> {
  const response = await notion.databases.query({
    database_id: NOTION_DATABASE_ID!,
    filter: {
      property: "Published",
      checkbox: {
        equals: true,
      },
    },
    sorts: [
      {
        property: "Date",
        direction: "descending",
      },
    ],
  });

  return response.results as NotionPage[];
}

function getProperty(page: NotionPage) {
  const props = page.properties;

  const title =
    props.Title?.title?.map((t) => t.plain_text).join("") || "Untitled";
  const slug =
    props.Slug?.rich_text?.map((t) => t.plain_text).join("") ||
    title.toLowerCase().replace(/\s+/g, "-");
  const tags = props.Tags?.multi_select?.map((t) => t.name) || [];
  const date = props.Date?.date?.start || new Date().toISOString().split("T")[0];
  const description =
    props.Description?.rich_text?.map((t) => t.plain_text).join("") || "";

  return { title, slug, tags, date, description };
}

async function pageToMdx(page: NotionPage): Promise<string> {
  const { title, slug, tags, date, description } = getProperty(page);

  const mdBlocks = await n2m.pageToMarkdown(page.id);
  const mdString = n2m.toMarkdownString(mdBlocks);

  const frontmatter = `---
title: "${title}"
description: "${description}"
date: ${date}
tags: [${tags.map((t) => `"${t}"`).join(", ")}]
published: true
---

`;

  return { content: frontmatter + mdString.parent, slug };
}

async function syncNotionPosts() {
  console.log("노션에서 포스트 동기화 시작...");

  const posts = await getPublishedPosts();
  console.log(`발행된 포스트 ${posts.length}개 발견`);

  const postsDir = path.join(process.cwd(), "content", "posts");

  // notion-sync 폴더 생성 (노션에서 가져온 글 구분)
  const notionPostsDir = path.join(postsDir, "notion");
  if (!fs.existsSync(notionPostsDir)) {
    fs.mkdirSync(notionPostsDir, { recursive: true });
  }

  // 기존 노션 포스트 삭제 (동기화)
  const existingFiles = fs.readdirSync(notionPostsDir);
  for (const file of existingFiles) {
    fs.unlinkSync(path.join(notionPostsDir, file));
  }

  for (const page of posts) {
    try {
      const { content, slug } = await pageToMdx(page);
      const filePath = path.join(notionPostsDir, `${slug}.mdx`);

      fs.writeFileSync(filePath, content);
      console.log(`✓ ${slug}.mdx 생성됨`);
    } catch (error) {
      console.error(`✗ 포스트 변환 실패:`, error);
    }
  }

  console.log("동기화 완료!");
}

syncNotionPosts().catch(console.error);
