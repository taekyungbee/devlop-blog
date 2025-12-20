import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui/badge";

export const metadata = {
  title: "About",
  description: "블로그 소개 페이지입니다.",
};

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-bold text-4xl lg:text-5xl">About</h1>
          <p className="text-xl text-muted-foreground">
            개발 블로그를 운영하는 {siteConfig.author}입니다.
          </p>
        </div>
      </div>
      <hr className="my-8" />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>소개</h2>
        <p>
          안녕하세요! 이 블로그는 개발 여정을 기록하고 공유하기 위해
          만들었습니다. 주로 웹 개발, 특히 프론트엔드 기술에 관한 글을 작성하고
          있습니다.
        </p>

        <h2>기술 스택</h2>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <Badge>TypeScript</Badge>
          <Badge>React</Badge>
          <Badge>Next.js</Badge>
          <Badge>Node.js</Badge>
          <Badge>Tailwind CSS</Badge>
        </div>

        <h2>연락처</h2>
        <ul>
          <li>
            GitHub:{" "}
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.links.github}
            </a>
          </li>
          <li>
            Twitter:{" "}
            <a
              href={siteConfig.links.twitter}
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.links.twitter}
            </a>
          </li>
        </ul>

        <h2>이 블로그에 대해</h2>
        <p>이 블로그는 다음 기술들로 만들어졌습니다:</p>
        <ul>
          <li>
            <strong>Next.js 16</strong> - React 프레임워크
          </li>
          <li>
            <strong>Velite</strong> - MDX 콘텐츠 관리
          </li>
          <li>
            <strong>Tailwind CSS</strong> - 스타일링
          </li>
          <li>
            <strong>shadcn/ui</strong> - UI 컴포넌트
          </li>
          <li>
            <strong>Giscus</strong> - 댓글 시스템
          </li>
        </ul>
      </div>
    </div>
  );
}
