# 블로그 개편 전환 계획서

> 프론트엔드 개발 블로그 → AI/풀스택 개발자 블로그 전환

---

## 0. 완료된 작업 (2025-01-03)

### ✅ 포스트 데이터 소스 MDX 전환 완료

**변경 내용:**
- 포스트 데이터 소스: DB (Prisma) → MDX (velite) 전환
- 정적 생성(SSG) 활성화로 빌드 성능 향상
- DB 의존성 제거 → 빌드 시 DB 연결 불필요

**수정된 파일:**
| 파일 | 변경 내용 |
|------|-----------|
| `src/lib/posts.ts` | Prisma → velite import, 동기 함수로 변경 |
| `src/components/mdx/mdx-content.tsx` | MDXRemote → velite pre-compiled MDX 렌더링 |
| `src/app/posts/page.tsx` | `force-dynamic` 제거, 동기 함수로 변경 |
| `src/app/posts/[...slug]/page.tsx` | `generateStaticParams` 추가, SSG 활성화 |
| `src/app/tags/page.tsx` | `force-dynamic` 제거 |
| `src/app/tags/[tag]/page.tsx` | `generateStaticParams` 추가 |
| `src/app/sitemap.ts` | `force-dynamic` 제거 |
| `src/app/feed.xml/route.ts` | 동기 함수로 변경 |
| `tsconfig.json` | `#velite` alias 추가 |

**데이터 소스 구조 (하이브리드):**
```
MDX (velite) - 정적 콘텐츠
├── content/posts/*.mdx      ← 블로그 포스트
└── content/projects/*.mdx   ← 프로젝트 소개

DB (Prisma) - 동적 콘텐츠
├── TrendVideo              ← YouTube 영상 (자동 수집)
├── TrendNews               ← AI 뉴스 (자동 수집)
└── YouTubeChannel          ← 채널 관리
```

---

## 1. 현재 상태 분석

### 1.1 강점 (유지할 것)

| 영역 | 현재 상태 | 평가 |
|------|-----------|------|
| **AI 트렌드 시스템** | YouTube 26개 채널 RSS 수집 + Gemini 요약 + 이메일/Notion 동기화 | ⭐⭐⭐ 매우 우수 |
| **기술 스택** | Next.js 16, React 19, TypeScript, Turbopack | ⭐⭐⭐ 최신 |
| **배포 자동화** | Docker + Cloud Run + GitHub Actions | ⭐⭐⭐ 완성도 높음 |
| **UI/UX** | Tailwind CSS 4 + shadcn/ui + 다크모드 | ⭐⭐⭐ 모던 |
| **데이터베이스** | PostgreSQL + Prisma ORM | ⭐⭐⭐ 타입안전 |

### 1.2 약점 (개선할 것)

| 영역 | 현재 상태 | 문제점 |
|------|-----------|--------|
| **콘텐츠** | 포스트 3개 (모두 프론트엔드) | 백엔드/AI/DevOps 콘텐츠 없음 |
| **프로필** | "개발 블로그 운영하는 개발자" | 정체성/전문성 불명확 |
| **About 페이지** | React, Next.js, TypeScript만 언급 | 풀스택/AI 역량 미표현 |
| **카테고리** | 태그만 존재 (blog, nextjs, react) | 체계적 분류 부재 |
| **포트폴리오** | 없음 | 프로젝트 쇼케이스 필요 |

---

## 2. 목표 정의

### 2.1 블로그 정체성 재정의

```
AS-IS: "프론트엔드 개발 블로그"
       └── React, Next.js 위주의 프론트엔드 기술 공유

TO-BE: "AI/풀스택 개발자 블로그"
       └── AI 트렌드 + 풀스택 개발 경험 + 기술 실험 공유
       └── "탐험하고, 배우고, 기록하는" 정신 유지
```

### 2.2 콘텐츠 방향성

| 카테고리 | 비중 | 콘텐츠 유형 |
|----------|------|-------------|
| **AI/ML** | 35% | LLM 활용, Gemini API, AI 도구 리뷰, 프롬프트 엔지니어링 |
| **백엔드** | 25% | Node.js, Python, API 설계, DB 최적화 |
| **프론트엔드** | 20% | React, Next.js, UI/UX, 성능 최적화 |
| **DevOps** | 15% | Docker, Cloud Run, CI/CD, 인프라 |
| **프로젝트** | 5% | 풀스택 프로젝트 회고, 사이드 프로젝트 소개 |

### 2.3 타겟 독자

- AI 기술에 관심 있는 개발자
- 풀스택 전환을 고민하는 프론트엔드/백엔드 개발자
- 사이드 프로젝트에서 AI를 활용하고 싶은 개발자
- 최신 기술 트렌드를 빠르게 파악하고 싶은 개발자

### 2.4 성공 지표 (KPI)

| 지표 | 현재 | 목표 (6개월 후) | 측정 방법 | 확인 주기 |
|------|------|-----------------|-----------|-----------|
| **총 포스트 수** | 3개 | 15개 이상 | `content/posts` 폴더 파일 수 | 월 1회 |
| **카테고리 커버리지** | 1개 (frontend) | 5개 모두 | frontmatter `category` 필드 집계 | 월 1회 |
| **월간 페이지뷰** | 측정 안됨 | 1,000+ | Google Analytics → 행동 → 페이지뷰 | 월 1회 |
| **검색 유입률** | 측정 안됨 | 30% 이상 | Google Search Console → 실적 | 월 1회 |
| **RSS 구독자** | 0명 | 50명+ | FeedBurner 또는 자체 구독 API 구현 후 DB 집계 | 월 1회 |
| **이메일 구독자** | 0명 | 100명+ | Nodemailer DB 테이블 또는 외부 서비스(Mailchimp, Buttondown) 대시보드 | 월 1회 |

**KPI 측정 인프라 구축 필요:**
- [ ] RSS 구독 추적: FeedBurner 연동 또는 `/api/subscribe` 엔드포인트 + DB 테이블 생성
- [ ] 이메일 구독: 기존 `email-trends.ts` 확장 또는 Buttondown/Mailchimp 연동
- [ ] Google Analytics 4 설정 및 Search Console 연동

---

## 3. 개편 작업 목록

### Phase 1: 정체성 확립 (기본 설정 변경)

**완료 조건:**
- [ ] 사이트 설정 3개 항목 변경 완료
- [ ] About 페이지에 5개 기술 스택 영역 표시
- [ ] 새 메타데이터로 OG 프리뷰 정상 표시

#### 3.1 사이트 설정 업데이트

**파일:** `src/config/site.ts`

```typescript
// AS-IS
export const siteConfig = {
  name: "Dev Blog",
  description: "개발 블로그",
  // ...
}

// TO-BE
export const siteConfig = {
  name: "AI Dev Lab",  // 또는 원하는 이름
  description: "AI와 풀스택 개발을 탐험하는 개발자의 기술 블로그",
  author: {
    name: "이름",
    role: "풀스택 개발자 & AI 엔지니어",
    bio: "프론트엔드, 백엔드, AI를 넘나드는 풀스택 개발자입니다.",
  },
  // ...
}
```

#### 3.2 About 페이지 전면 개편

**파일:** `src/app/about/page.tsx`

**변경 내용:**
- 자기소개: 풀스택 개발자 + AI 관심사 명시
- 기술 스택 확장:
  - **AI/ML:** Python, Gemini API, LangChain, 프롬프트 엔지니어링
  - **백엔드:** Node.js, Express, Python FastAPI, PostgreSQL, Prisma
  - **프론트엔드:** React, Next.js, TypeScript, Tailwind CSS
  - **DevOps:** Docker, Google Cloud Run, GitHub Actions
- 관심 분야: AI 트렌드, 풀스택 아키텍처, 개발 생산성

#### 3.3 헤더 네비게이션 개선

**파일:** `src/components/layout/header.tsx`

**현재:**
```
Home | Posts | Tags | About
```

**개선:**
```
Home | Posts | AI Trends | Projects | About
```

**라우팅 상세:**

| 메뉴 | 경로 | 데이터 소스 | 비고 |
|------|------|-------------|------|
| Home | `/` | - | 기존 유지 |
| Posts | `/posts` | `content/posts/*.mdx` | 기존 유지 |
| AI Trends | `/trends` | `TrendVideo`, `TrendNews` 테이블 | **기존 페이지 활용** (이미 구현됨) |
| Projects | `/projects` | `content/projects/*.mdx` 또는 하드코딩 | **신규 생성** |
| About | `/about` | 하드코딩 | 기존 유지 |

---

### Phase 2: 콘텐츠 구조 개선

**완료 조건:**
- [ ] 카테고리 시스템 방식 결정 및 적용
- [ ] 기존 3개 포스트 category 필드 추가 완료
- [ ] velite 설정에 category 필드 추가

#### 3.4 카테고리 시스템 도입

##### 의사결정: 태그 기반 vs 디렉토리 기반

| 기준 | 태그 기반 (권장) | 디렉토리 기반 |
|------|------------------|---------------|
| **구현 난이도** | ⭐ 쉬움 (frontmatter만 수정) | ⭐⭐ 보통 (velite 설정 변경 필요) |
| **기존 URL 영향** | 없음 | `/posts/[slug]` → `/posts/[category]/[slug]` 변경 |
| **리다이렉트 필요** | 없음 | 기존 3개 포스트 리다이렉트 필요 |
| **포스트 이동** | frontmatter만 수정 | 파일 이동 필요 |
| **다중 카테고리** | 가능 (배열) | 불가능 (1개 폴더에만 존재) |
| **velite 수정** | schema에 필드 추가만 | collections 재구성 필요 |

**결정 게이트:**
- Phase 2 시작 전에 아래 질문에 답하고 결정
- [ ] Q1: URL에 카테고리를 포함하고 싶은가? (`/posts/ai/gemini-guide` vs `/posts/gemini-guide`)
- [ ] Q2: 하나의 포스트가 여러 카테고리에 속할 수 있어야 하는가?
- [ ] Q3: 기존 URL 유지가 중요한가? (SEO, 외부 링크)

**권장: 태그 기반** (기존 URL 유지, 빠른 적용, 유연성)

##### 태그 기반 구현 (권장)

**1. velite 스키마 수정** (`velite.config.ts`)

```typescript
const posts = defineCollection({
  // ...
  schema: s.object({
    // 기존 필드...
    category: s.enum(["ai", "backend", "frontend", "devops", "project"]).optional(),
    // ...
  }),
})
```

**2. 포스트 frontmatter 예시**

```yaml
---
title: "Gemini API로 영상 요약 자동화하기"
date: "2025-01-15"
description: "YouTube 영상을 자동으로 요약하는 시스템 구축기"
category: ai
tags: [gemini, api, automation, python]
published: true
---
```

##### 디렉토리 기반 구현 (선택 시)

**1. 폴더 구조 변경**

```
content/posts/
├── ai/
│   └── gemini-video-summarizer.mdx
├── backend/
│   └── prisma-guide.mdx
├── frontend/
│   ├── hello-world.mdx (이동)
│   └── nextjs-15-features.mdx (이동)
└── devops/
    └── docker-cloud-run.mdx
```

**2. 리다이렉트 설정 필요** (`next.config.ts`)

```typescript
async redirects() {
  return [
    { source: '/posts/hello-world', destination: '/posts/frontend/hello-world', permanent: true },
    { source: '/posts/nextjs-15-features', destination: '/posts/frontend/nextjs-15-features', permanent: true },
  ]
}
```

#### 3.5 기존 포스트 마이그레이션

**대상 파일 (3개):**

| 파일 | 현재 frontmatter | 추가할 필드 |
|------|------------------|-------------|
| `hello-world.mdx` | `published: true`, tags: [blog, intro] | `category: frontend` |
| `nextjs-15-features.mdx` | `published: true`, tags: [nextjs, react, frontend] | `category: frontend` |
| `web-editor-test.mdx` | `published: true` | `category: frontend` |

**마이그레이션 스크립트** (`scripts/migrate-category.ts`)

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const POSTS_DIR = 'content/posts'
const CATEGORY_MAP: Record<string, string> = {
  'hello-world.mdx': 'frontend',
  'nextjs-15-features.mdx': 'frontend',
  'web-editor-test.mdx': 'frontend',
}

async function migrate() {
  for (const [filename, category] of Object.entries(CATEGORY_MAP)) {
    const filePath = path.join(POSTS_DIR, filename)
    if (!fs.existsSync(filePath)) continue

    const content = fs.readFileSync(filePath, 'utf-8')
    const { data, content: body } = matter(content)

    if (data.category) {
      console.log(`[SKIP] ${filename} - already has category: ${data.category}`)
      continue
    }

    data.category = category
    const newContent = matter.stringify(body, data)
    fs.writeFileSync(filePath, newContent)
    console.log(`[OK] ${filename} - category: ${category}`)
  }
}

migrate()
```

**실행:**
```bash
npx tsx scripts/migrate-category.ts
```

**검증 체크리스트:**
- [ ] 모든 포스트에 category 필드 존재
- [ ] velite build 성공 (`npm run build`)
- [ ] 포스트 목록 페이지에서 정상 표시
- [ ] 개별 포스트 페이지 정상 렌더링

#### 3.6 포스트 템플릿 표준화

**현재 사용 중인 필드 (실제 포스트 기준):**
- `title`: 제목
- `description`: 설명
- `date`: 날짜 (YYYY-MM-DD)
- `tags`: 태그 배열
- `published`: 발행 여부 (boolean) ← **현재 사용 중**

**새 포스트 템플릿:** (`content/posts/_template.mdx`)

```yaml
---
title: "제목"
description: "2-3줄 요약"
date: "YYYY-MM-DD"
category: ai | backend | frontend | devops | project
tags: [태그1, 태그2]
published: true
series: "시리즈명" # 선택
---

## 개요

## 본문

## 마무리
```

> **참고:** 기존 포스트는 `published: true`를 사용하므로 이를 유지합니다. `draft` 필드는 사용하지 않습니다.

---

### Phase 3: 신규 콘텐츠 제작

**완료 조건:**
- [ ] 카테고리별 최소 1개 포스트 게시 (5개)
- [ ] 대표 포스트 3개 이상 완성 (AI 카테고리 우선)
- [ ] 시리즈 1개 시작 (최소 2편)

#### 3.7 콘텐츠 발행 계획

**발행 주기:** 월 2회 (격주 발행)
**작성 시간:** 포스트당 4-6시간 예상

| 월 | 주차 | 제목 | 카테고리 | 우선순위 |
|----|------|------|----------|----------|
| 1월 | 2주 | Gemini API로 YouTube 영상 자동 요약 시스템 만들기 | ai | P0 |
| 1월 | 4주 | 프롬프트 엔지니어링 실전 가이드 | ai | P0 |
| 2월 | 2주 | Prisma ORM 실전 활용기 | backend | P1 |
| 2월 | 4주 | Docker + Cloud Run 배포 자동화 | devops | P1 |
| 3월 | 2주 | AI 트렌드 자동 수집 파이프라인 구축기 | ai | P0 |
| 3월 | 4주 | Next.js API Routes 설계 패턴 | backend | P2 |

**포스트 작성 워크플로우:**
1. 아이디어/주제 선정 (30분)
2. 아웃라인 작성 (1시간)
3. 초안 작성 (2-3시간)
4. 코드 예제 정리 (1시간)
5. 검토 및 발행 (30분)

#### 3.8 우선 작성 포스트 상세

**AI/ML (현재 블로그의 강점 활용)**

| 순서 | 제목 | 태그 | 설명 | 소스 코드 |
|------|------|------|------|-----------|
| 1 | Gemini API로 YouTube 영상 자동 요약 시스템 만들기 | gemini, api, automation | 현재 구현된 기능 상세 설명 | `lib/video-summarizer.ts` |
| 2 | 프롬프트 엔지니어링 실전 가이드 | prompt, llm, ai | 요약 프롬프트 최적화 경험 | `lib/gemini-api.ts` |
| 3 | AI 트렌드 자동 수집 파이프라인 구축기 | rss, automation, ai | RSS + Gemini + 이메일 통합 | `lib/ai-trends.ts` |

**백엔드**

| 순서 | 제목 | 태그 | 설명 | 소스 코드 |
|------|------|------|------|-----------|
| 4 | Prisma ORM 실전 활용기 | prisma, postgresql, orm | DB 스키마 설계 ~ 쿼리 최적화 | `prisma/schema.prisma` |
| 5 | Next.js API Routes 설계 패턴 | nextjs, api, backend | 현재 블로그 API 구조 해설 | `src/app/api/` |

**DevOps**

| 순서 | 제목 | 태그 | 설명 | 소스 코드 |
|------|------|------|------|-----------|
| 6 | Docker + Cloud Run 배포 자동화 | docker, cloudrun, cicd | 현재 배포 파이프라인 설명 | `Dockerfile`, `.github/workflows/` |
| 7 | GitHub Actions 워크플로우 설계 | github-actions, cicd | CI/CD 구성 가이드 | `.github/workflows/` |

#### 3.9 시리즈 기획

**시리즈 1: "AI 블로그 자동화 구축기"** (5편 예정)
1. 시스템 아키텍처 설계
2. YouTube RSS 수집기 구현
3. Gemini API 연동과 프롬프트 최적화
4. 자막 추출 및 오디오 fallback 처리
5. 이메일/Notion 연동

**시리즈 2: "풀스택 프로젝트 회고"** (프로젝트별 1편)
- 각 사이드 프로젝트의 기획 → 구현 → 배포 과정

---

### Phase 4: UI/UX 개선

**완료 조건:**
- [ ] 포스트 카드에 카테고리 배지 표시
- [ ] 헤더에 AI Trends, Projects 메뉴 추가
- [ ] Projects 페이지 생성 및 1개 이상 프로젝트 표시

#### 3.10 홈페이지 레이아웃 개선

**현재 구조:**
```
[Hero Section] → 타이틀 + 설명
[AI Trends]    → YouTube 영상 + AI 뉴스
[Latest Posts] → 최근 포스트 6개
```

**개선 구조:**
```
[Hero Section]     → 타이틀 + 풀스택/AI 개발자 소개
[AI Trends]        → (유지) YouTube + 뉴스
[Featured Posts]   → 카테고리별 대표 포스트
[Latest Posts]     → 최근 포스트 (카테고리 배지 추가)
[Projects]         → 사이드 프로젝트 쇼케이스 (선택)
```

#### 3.11 포스트 카드 개선

**현재:** 태그만 표시
**개선:** 카테고리 배지 추가 (AI, Backend, Frontend, DevOps 색상 구분)

```tsx
// 카테고리별 색상
const categoryColors = {
  ai: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  backend: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  frontend: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  devops: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  project: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
}
```

#### 3.12 Projects 페이지 신설

**경로:** `/projects`
**파일:** `src/app/projects/page.tsx`

**데이터 구조 옵션:**

**옵션 A: 하드코딩 (빠른 구현)**
```typescript
const projects = [
  {
    title: "AI Dev Lab (이 블로그)",
    description: "AI 트렌드 자동 수집 + 기술 블로그",
    stack: ["Next.js", "Gemini", "PostgreSQL", "Cloud Run"],
    github: "https://github.com/...",
    demo: "https://...",
  },
  // ...
]
```

**옵션 B: MDX 기반 (확장성)**
```
content/projects/
├── ai-dev-lab.mdx
└── other-project.mdx
```

**내용:**
- 사이드 프로젝트 카드 형태로 표시
- 기술 스택, 설명, GitHub 링크, 데모 링크
- 현재 블로그도 프로젝트로 소개

---

### Phase 5: SEO & 메타데이터

**완료 조건:**
- [ ] 메타데이터 업데이트 완료
- [ ] OG 이미지 자동 생성 또는 새 이미지 적용
- [ ] sitemap.xml에 새 페이지 포함
- [ ] robots.txt 확인

#### 3.13 메타데이터 개선

**파일:** `src/app/layout.tsx`

```typescript
export const metadata: Metadata = {
  title: {
    default: "AI Dev Lab | 풀스택 개발자 기술 블로그",
    template: "%s | AI Dev Lab",
  },
  description: "AI와 풀스택 개발을 탐험하는 개발자의 기술 블로그. Gemini API, Next.js, Node.js, Docker 등 다양한 기술 경험을 공유합니다.",
  keywords: ["AI", "풀스택", "Gemini", "Next.js", "Node.js", "개발 블로그"],
  authors: [{ name: "작성자명" }],
  creator: "작성자명",
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://your-domain.com",
    siteName: "AI Dev Lab",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@your_twitter",
  },
  robots: {
    index: true,
    follow: true,
  },
}
```

#### 3.14 SEO 인프라 체크리스트

| 항목 | 실제 파일 경로 | 상태 | 작업 |
|------|----------------|------|------|
| **sitemap.xml** | `src/app/sitemap.ts` | ✅ 존재 | `/projects`, `/trends` 추가 확인 |
| **robots.txt** | `src/app/robots.ts` | ✅ 존재 | 크롤링 허용 확인 |
| **RSS Feed** | `src/app/feed.xml/route.ts` | ✅ 존재 | category 필드 반영 |
| **Canonical URL** | 각 페이지 metadata | 확인 필요 | 중복 방지 |
| **OG 이미지** | `public/og-image.png` | 새로 제작 | 1200x630 권장 |

#### 3.15 OG 이미지 자동화 (선택)

**Next.js OG 이미지 생성** (`src/app/og/route.tsx`)

```typescript
import { ImageResponse } from 'next/og'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') || 'AI Dev Lab'
  const category = searchParams.get('category') || ''

  return new ImageResponse(
    (
      <div style={{ /* 스타일 */ }}>
        {category && <span>{category.toUpperCase()}</span>}
        <h1>{title}</h1>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
```

#### 3.16 URL 변경 시 리다이렉트 (해당 시)

디렉토리 기반 카테고리 선택 시에만 필요:

```typescript
// next.config.ts
async redirects() {
  return [
    // 기존 포스트 URL 리다이렉트
    {
      source: '/posts/hello-world',
      destination: '/posts/frontend/hello-world',
      permanent: true, // 301
    },
    // ...
  ]
}
```

---

## 4. 작업 우선순위 및 완료 기준

### Phase 1: 정체성 확립 (즉시 실행)

| 순서 | 작업 | 난이도 | 완료 기준 |
|------|------|--------|-----------|
| 1 | `site.ts` 설정 업데이트 | ⭐ | 블로그명, 설명, 저자 정보 변경 |
| 2 | About 페이지 개편 | ⭐ | 5개 기술 영역 표시, 풀스택 소개 |
| 3 | 메타데이터 수정 | ⭐ | OG 프리뷰 정상 표시 |

**Phase 1 완료 기준:**
- [ ] 새 블로그명으로 브라우저 탭 표시
- [ ] About 페이지에서 AI/백엔드 기술 확인 가능
- [ ] SNS 공유 시 새 OG 정보 표시

---

### Phase 2: 콘텐츠 구조 (단기)

| 순서 | 작업 | 난이도 | 완료 기준 |
|------|------|--------|-----------|
| 4 | 카테고리 방식 결정 | - | 의사결정 문서화 |
| 5 | velite 스키마 수정 | ⭐ | category 필드 추가 |
| 6 | 기존 포스트 마이그레이션 | ⭐ | 3개 포스트 category 적용 |
| 7 | 포스트 카드 배지 추가 | ⭐⭐ | 카테고리별 색상 배지 표시 |

**Phase 2 완료 기준:**
- [ ] 모든 포스트에 category 필드 존재
- [ ] 포스트 목록에서 카테고리 배지 표시
- [ ] `npm run build` 성공

---

### Phase 3: 신규 콘텐츠 (중기)

| 순서 | 작업 | 난이도 | 완료 기준 |
|------|------|--------|-----------|
| 8 | AI 포스트 1편 | ⭐⭐ | Gemini 요약 시스템 설명 |
| 9 | AI 포스트 2편 | ⭐⭐ | 프롬프트 엔지니어링 가이드 |
| 10 | 백엔드 포스트 1편 | ⭐⭐ | Prisma ORM 가이드 |
| 11 | DevOps 포스트 1편 | ⭐⭐ | Docker + Cloud Run |

**Phase 3 완료 기준:**
- [ ] 총 포스트 7개 이상
- [ ] 3개 이상 카테고리에 콘텐츠 존재
- [ ] AI 카테고리 포스트 3개 이상

---

### Phase 4: UI/UX 개선 (중기)

| 순서 | 작업 | 난이도 | 완료 기준 |
|------|------|--------|-----------|
| 12 | 헤더 네비게이션 업데이트 | ⭐ | AI Trends, Projects 메뉴 추가 |
| 13 | Projects 페이지 생성 | ⭐⭐ | 최소 1개 프로젝트 표시 |
| 14 | 홈페이지 개선 | ⭐⭐ | Featured Posts 섹션 추가 |

**Phase 4 완료 기준:**
- [ ] 헤더에서 모든 주요 페이지 접근 가능
- [ ] Projects 페이지 정상 작동
- [ ] 홈페이지에서 카테고리별 포스트 확인 가능

---

### Phase 5: SEO & 인프라 (중기)

| 순서 | 작업 | 난이도 | 완료 기준 |
|------|------|--------|-----------|
| 15 | sitemap 업데이트 | ⭐ | 모든 페이지 포함 |
| 16 | OG 이미지 제작 | ⭐ | 1200x630 이미지 적용 |
| 17 | Google Search Console 등록 | ⭐ | 사이트 인증 완료 |
| 18 | Google Analytics 설정 | ⭐ | 페이지뷰 추적 시작 |

**Phase 5 완료 기준:**
- [ ] Google에서 사이트 검색 가능
- [ ] Search Console에서 인덱싱 상태 확인
- [ ] Analytics에서 방문자 데이터 수집

---

## 5. 마이그레이션 체크리스트

### 설정 변경
- [ ] `src/config/site.ts` - 블로그명, 설명, 저자 정보 업데이트
- [ ] `src/app/layout.tsx` - 메타데이터 수정
- [ ] `src/app/about/page.tsx` - About 페이지 전면 개편
- [ ] `public/images/` - 새 OG 이미지, 로고 (선택)

### 콘텐츠 구조
- [ ] 카테고리 방식 결정 (태그 기반 vs 디렉토리 기반)
- [ ] `velite.config.ts` - category 필드 추가
- [ ] 마이그레이션 스크립트 실행 또는 수동 수정
- [ ] 기존 3개 포스트 category 적용 검증

### UI 개선
- [ ] `src/components/post-card.tsx` - 카테고리 배지 추가
- [ ] `src/components/layout/header.tsx` - 네비게이션 업데이트
- [ ] `src/app/projects/page.tsx` - Projects 페이지 생성

### SEO
- [ ] `src/app/sitemap.ts` - 신규 페이지 추가
- [ ] `src/app/robots.ts` - 크롤링 설정 확인
- [ ] `src/app/feed.xml/route.ts` - category 필드 반영
- [ ] OG 이미지 - 새 브랜딩 적용

### 신규 콘텐츠
- [ ] "Gemini API 영상 요약 시스템" 포스트 작성
- [ ] "프롬프트 엔지니어링 가이드" 포스트 작성
- [ ] "Prisma ORM 실전 가이드" 포스트 작성
- [ ] "Docker + Cloud Run 배포" 포스트 작성

### 분석 도구
- [ ] Google Analytics 설정
- [ ] Google Search Console 등록
- [ ] RSS 구독 추적 (선택)

---

## 6. 발행 캘린더 및 운영 리듬

### 2025년 1분기 캘린더

| 주차 | 날짜 | 작업 | 카테고리 | 상태 |
|------|------|------|----------|------|
| W1 | 1/6 | Phase 1 완료 (설정 변경) | - | 예정 |
| W2 | 1/13 | Phase 2 완료 (카테고리 적용) | - | 예정 |
| W2 | 1/15 | **포스트: Gemini 영상 요약** | AI | 예정 |
| W4 | 1/29 | **포스트: 프롬프트 엔지니어링** | AI | 예정 |
| **W4** | **1/31** | **월말 회고 & KPI 점검** | - | 예정 |
| W6 | 2/12 | **포스트: Prisma ORM 가이드** | Backend | 예정 |
| W8 | 2/26 | **포스트: Docker + Cloud Run** | DevOps | 예정 |
| **W8** | **2/28** | **월말 회고 & KPI 점검** | - | 예정 |
| W10 | 3/12 | **포스트: AI 트렌드 파이프라인** | AI | 예정 |
| W12 | 3/26 | **포스트: API Routes 패턴** | Backend | 예정 |
| **W12** | **3/31** | **분기 회고 & KPI 점검** | - | 예정 |

### 발행 루틴

**격주 수요일 발행 (권장)**

| 요일 | 작업 |
|------|------|
| 월 | 주제 선정, 아웃라인 작성 |
| 화 | 초안 작성 |
| 수 (발행일) | 검토, 발행 |
| 목-금 | 피드백 확인, 오류 수정 |

### 월말 회고 체크리스트 (매월 마지막 주)

**콘텐츠 점검:**
- [ ] 이번 달 발행 포스트 수: ___개 (목표: 2개)
- [ ] 카테고리 분포 확인
- [ ] 다음 달 포스트 주제 2개 확정

**KPI 점검:**
- [ ] Google Analytics 월간 페이지뷰: ___
- [ ] Google Search Console 검색 유입: ___
- [ ] RSS/이메일 구독자 변화: ___

**기술 점검:**
- [ ] 빌드 에러 없음 확인
- [ ] 깨진 링크 확인
- [ ] 새 기능 아이디어 기록

### 분기 회고 (3월, 6월, 9월, 12월)

**전체 진행 상황:**
- [ ] Phase 완료 현황 점검
- [ ] KPI 목표 대비 달성률 분석
- [ ] 다음 분기 우선순위 재조정

**의사결정 로그 업데이트:**
- [ ] 미결정 사항 정리
- [ ] 새로운 결정 사항 기록

---

## 7. 결론

현재 블로그는 **AI 트렌드 자동화 기능이 매우 우수**하며, 이를 기반으로 "AI/풀스택 개발자 블로그"로 자연스럽게 전환할 수 있습니다.

**핵심 전략:**
1. **기존 강점 유지**: AI 트렌드 시스템, 최신 기술 스택
2. **정체성 명확화**: 프로필과 About 페이지 개편
3. **콘텐츠 다양화**: 현재 구현된 기능을 포스트로 문서화
4. **점진적 개선**: 급격한 변화 없이 단계적 전환
5. **측정 가능한 목표**: KPI 설정 및 주기적 점검

**첫 번째 실행 권장 작업:**
1. `site.ts` 설정 변경
2. About 페이지 개편
3. 카테고리 방식 결정 (태그 기반 권장)
4. 현재 AI 기능을 설명하는 첫 번째 포스트 작성

이미 구현된 Gemini 영상 요약, RSS 수집, 이메일 연동 기능은 그 자체로 **훌륭한 포스트 소재**이며, 이를 문서화하는 것만으로도 AI/풀스택 개발자 블로그로서의 정체성을 확립할 수 있습니다.

---

## 부록 A: 의사결정 로그

| 날짜 | 결정 사항 | 담당자 | 선택 | 이유 | 다음 액션 |
|------|-----------|--------|------|------|-----------|
| - | 카테고리 시스템 | - | (결정 필요) | - | Phase 2 시작 전 결정 |
| - | Projects 데이터 구조 | - | (결정 필요) | - | Phase 4 시작 전 결정 |
| - | 블로그명 | - | (결정 필요) | - | Phase 1에서 확정 |
| - | RSS/이메일 구독 추적 방식 | - | (결정 필요) | - | KPI 측정 전 결정 |

---

## 부록 B: Frontmatter 필드 명세

**현재 사용 중인 필드 (기존 포스트 기준):**

```yaml
---
title: string        # 필수 - 포스트 제목
description: string  # 필수 - 포스트 설명 (SEO, 카드 표시용)
date: string         # 필수 - 발행일 (YYYY-MM-DD 형식)
tags: string[]       # 선택 - 태그 배열
published: boolean   # 필수 - true: 발행, false: 비발행 (draft 역할)
slug: string         # 선택 - URL 슬러그 (미지정 시 파일명 사용)
---
```

**추가 예정 필드:**

```yaml
---
category: enum       # 선택 - ai | backend | frontend | devops | project
series: string       # 선택 - 시리즈명 (연재물용)
---
```

**현재 포스트별 slug 사용 현황:**

| 파일 | slug 필드 | 실제 URL |
|------|-----------|----------|
| `hello-world.mdx` | (없음) | `/posts/hello-world` (파일명 기반) |
| `nextjs-15-features.mdx` | (없음) | `/posts/nextjs-15-features` (파일명 기반) |
| `web-editor-test.mdx` | `web-editor-test` | `/posts/web-editor-test` |

> **권장:** `slug` 필드는 파일명과 URL을 다르게 하고 싶을 때만 사용. 파일명 = URL인 경우 생략 가능.

**주의사항:**
- `draft` 필드는 사용하지 않음 (대신 `published: false` 사용)
- `date` 형식은 `YYYY-MM-DD` (따옴표 없이 사용 가능)
- `tags`는 배열 형식 `["tag1", "tag2"]` 또는 `[tag1, tag2]`
- `slug`는 선택 필드 - 파일명과 동일하면 생략 권장

---

## 부록 C: Slug/URL 정책 및 라우팅 점검

### Slug 적용 정책

- **기본 원칙:** 파일명 = URL인 경우 `slug` 생략
- **사용 시점:** 파일명을 유지하되 URL을 다르게 하고 싶을 때만 `slug` 사용
- **형식 규칙:** 소문자, 숫자, 하이픈(kebab-case), ASCII 권장
- **고유성:** `slug`는 전 포스트 기준 유일해야 함 (중복 시 라우팅 충돌)
- **변경 시 대응:** `slug` 변경 시 기존 URL 301 리다이렉트 설정 고려

**Slug 사용 결정 체크리스트:**
- [ ] 파일명과 URL이 동일한가? → 예: `slug` 생략
- [ ] URL에 한글/특수문자가 들어가는가? → 예: `slug` 사용
- [ ] 기존 링크/공유 URL이 존재하는가? → 예: 리다이렉트 필요

### URL/라우팅 규칙 정리

| 영역 | 경로 패턴 | 비고 |
|------|-----------|------|
| 홈 | `/` | 기본 진입 |
| 포스트 목록 | `/posts` | 전체 포스트 리스트 |
| 포스트 상세 (태그 기반) | `/posts/[slug]` | category는 URL에 포함하지 않음 |
| 포스트 상세 (디렉토리 기반) | `/posts/[category]/[slug]` | 디렉토리 방식 선택 시 적용 |
| 태그 | `/tags/[tag]` | 태그 필터 페이지 |
| AI Trends | `/trends` | 기존 페이지 활용 |
| Projects | `/projects` | 신규 페이지 |

### 라우팅/SEO 점검 체크리스트

- [ ] `/posts`에서 모든 포스트 노출 확인
- [ ] 개별 포스트 URL 접속 정상 동작
- [ ] `slug`가 있는 포스트 URL 정상 동작
- [ ] `/tags/[tag]` 페이지 정상 동작
- [ ] `/trends`, `/projects`, `/about` 접근 가능
- [ ] `sitemap.xml`, `robots.txt`, `feed.xml` 응답 정상
- [ ] canonical URL이 실제 URL과 일치
