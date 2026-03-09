import { siteConfig } from "@/config/site";
import { Badge } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata = {
  title: "About",
  description: "AI와 풀스택 개발을 탐험하는 개발자 소개",
};

const techStacks = {
  "AI/ML": [
    "Python",
    "Gemini API",
    "LangChain",
    "Prompt Engineering",
  ],
  "Backend": [
    "Node.js",
    "Express",
    "Python FastAPI",
    "PostgreSQL",
    "Prisma ORM",
  ],
  "Frontend": [
    "React",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
  ],
  "DevOps": [
    "Docker",
    "Google Cloud Run",
    "GitHub Actions",
    "Vercel",
  ],
};

const interests = [
  "AI 트렌드 및 LLM 활용",
  "풀스택 아키텍처 설계",
  "개발 생산성 향상",
  "자동화 시스템 구축",
];

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-bold text-4xl lg:text-5xl">About</h1>
          <p className="text-xl text-muted-foreground">
            {siteConfig.author.bio}
          </p>
        </div>
      </div>
      <hr className="my-8" />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>소개</h2>
        <p>
          안녕하세요! 저는 <strong>{siteConfig.author.role}</strong>입니다.
          프론트엔드에서 시작해 백엔드, 그리고 AI까지 영역을 넓혀가며
          다양한 기술을 탐험하고 있습니다.
        </p>
        <p>
          이 블로그에서는 AI 트렌드 분석, 풀스택 개발 경험, 그리고 다양한
          기술 실험의 결과를 공유합니다. &quot;탐험하고, 배우고, 기록하는&quot; 정신으로
          개발 여정을 기록하고 있습니다.
        </p>

        <h2>기술 스택</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2 my-6">
        {Object.entries(techStacks).map(([category, skills]) => (
          <Card key={category} className="bg-background/60 backdrop-blur-md border-muted/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-secondary/50"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h2>관심 분야</h2>
        <ul>
          {interests.map((interest) => (
            <li key={interest}>{interest}</li>
          ))}
        </ul>

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
        </ul>

        <h2>이 블로그에 대해</h2>
        <p>이 블로그는 다음 기술들로 만들어졌습니다:</p>
        <ul>
          <li>
            <strong>Next.js 16</strong> - React 프레임워크
          </li>
          <li>
            <strong>PostgreSQL + Prisma</strong> - 데이터베이스
          </li>
          <li>
            <strong>Gemini API</strong> - AI 영상 요약
          </li>
          <li>
            <strong>Velite</strong> - MDX 콘텐츠 관리
          </li>
          <li>
            <strong>Tailwind CSS + shadcn/ui</strong> - 스타일링
          </li>
          <li>
            <strong>Google Cloud Run</strong> - 배포
          </li>
        </ul>
      </div>
    </div>
  );
}
