# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

개발자 블로그 프로젝트 - Next.js 16, Velite, shadcn/ui 기반 개인/기술 블로그

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.x
- **Styling**: Tailwind CSS 4.x + shadcn/ui
- **Content**: Velite (MDX 기반 타입 안전 콘텐츠 관리)
- **Code Highlighting**: shiki + rehype-pretty-code
- **Theme**: next-themes (다크/라이트 모드)
- **Comments**: Giscus (GitHub Discussions 기반)
- **Search**: cmdk (Command palette)

## Build Commands

```bash
npm run dev          # 개발 서버 (velite watch + next dev)
npm run build        # 프로덕션 빌드 (velite build + next build)
npm run start        # 프로덕션 실행
npm run lint         # 린트
npm run type-check   # 타입 체크
```

## Architecture

### Routes

| Route | Description |
|-------|-------------|
| `/` | 홈 (최근 포스트 5개) |
| `/posts` | 전체 포스트 목록 |
| `/posts/[...slug]` | 포스트 상세 (MDX 렌더링 + 댓글) |
| `/tags` | 전체 태그 목록 |
| `/tags/[tag]` | 태그별 포스트 목록 |
| `/about` | 소개 페이지 |
| `/feed.xml` | RSS 피드 |
| `/sitemap.xml` | 사이트맵 |
| `/robots.txt` | robots.txt |

### Content System

- MDX 포스트: `content/posts/*.mdx`
- Velite 빌드 결과: `.velite/` (gitignore)
- 콘텐츠 import: `#site/content` 별칭

```typescript
import { posts } from "#site/content";
```

### MDX Frontmatter

```yaml
---
title: 포스트 제목 (필수)
description: 포스트 설명 (선택)
date: 2024-12-18 (필수, ISO 형식)
tags: ["tag1", "tag2"] (선택)
series: 시리즈명 (선택)
published: true (기본값: true)
---
```

### Directory Structure

```
src/
├── app/
│   ├── page.tsx              # 홈
│   ├── posts/page.tsx        # 포스트 목록
│   ├── posts/[...slug]/      # 포스트 상세
│   ├── tags/page.tsx         # 태그 목록
│   ├── tags/[tag]/           # 태그별 포스트
│   ├── about/page.tsx        # 소개
│   ├── feed.xml/route.ts     # RSS
│   ├── sitemap.ts            # 사이트맵
│   └── robots.ts             # robots.txt
├── components/
│   ├── ui/                   # shadcn/ui
│   ├── mdx/                  # MDX 컴포넌트
│   ├── layout/               # Header, Footer, ThemeToggle
│   ├── post-card.tsx         # 포스트 카드
│   ├── search.tsx            # 검색 (Cmd+K)
│   └── giscus-comments.tsx   # 댓글
├── config/site.ts            # 사이트 설정
└── lib/utils.ts              # 유틸리티

content/posts/                # MDX 포스트 파일
velite.config.ts              # Velite 스키마
```

### Key Utils (lib/utils.ts)

- `cn()` - Tailwind 클래스 병합
- `formatDate()` - 한국어 날짜 포맷
- `sortPosts()` - 최신순 정렬
- `getAllTags()` - 태그 집계
- `getPostsByTag()` - 태그별 필터

### MDX 커스텀 컴포넌트

- `<Callout type="info|warning|danger|default">` - 알림 박스
- `<Image>` - Next.js 이미지 최적화

### Giscus 설정

`src/components/giscus-comments.tsx`에서 다음 값을 실제 값으로 변경:
- `data-repo`: GitHub 저장소
- `data-repo-id`: 저장소 ID
- `data-category-id`: Discussions 카테고리 ID

## Future Roadmap

**Phase 3**: 뉴스레터 구독, 애널리틱스 (Umami), PWA 지원
