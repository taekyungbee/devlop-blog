# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

개발자 블로그 프로젝트 - Next.js 16, PostgreSQL, shadcn/ui 기반 개인/기술 블로그 + AI 트렌드 수집

## Tech Stack

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Language**: TypeScript 5.x
- **Database**: PostgreSQL + Prisma ORM
- **Styling**: Tailwind CSS 4.x + shadcn/ui
- **AI**: Gemini 3 Flash (YouTube 요약)
- **Deployment**: Google Cloud Run (GitHub Actions CI/CD)

## Build Commands

```bash
npm run dev          # 개발 서버 (localhost:7000)
npm run build        # 프로덕션 빌드 (prisma generate + next build)
npm run lint         # ESLint
npm run type-check   # TypeScript 검사

# Database
npm run db:pull      # DB 스키마 → Prisma 동기화
npm run db:generate  # Prisma Client 생성

# Deployment
npm run docker:build # Docker 이미지 빌드
npm run deploy       # Cloud Run 배포 스크립트
```

## Architecture

### Routes

| Route | Description |
|-------|-------------|
| `/` | 홈 (최근 포스트 + AI 트렌드) |
| `/posts` | 전체 포스트 목록 |
| `/posts/[...slug]` | 포스트 상세 (MDX 렌더링 + Giscus 댓글) |
| `/tags`, `/tags/[tag]` | 태그 목록/필터 |
| `/trends` | AI 트렌드 전용 페이지 |
| `/admin` | 관리자 페이지 |

### API Endpoints

| Endpoint | Description |
|----------|-------------|
| `POST /api/trends/refresh` | YouTube RSS 수집 → DB 저장 |
| `POST /api/trends/summarize` | Gemini로 영상 요약 생성 |
| `POST /api/trends/send-email` | 요약 이메일 발송 |
| `POST /api/trends/sync-notion` | Notion DB 동기화 |
| `GET /api/trends/videos` | 트렌드 영상 조회 |
| `GET /api/channels` | YouTube 채널 목록 |

### Database Schema (Prisma)

```
Post ─┬─ PostTag ─── Tag
      └─ Series

TrendVideo (YouTube 영상 + Gemini 요약)
TrendNews (AI 뉴스)
YouTubeChannel (구독 채널 관리)
```

### Key Libraries

| 파일 | 역할 |
|------|------|
| `lib/prisma.ts` | Prisma Client 싱글톤 |
| `lib/posts.ts` | 블로그 포스트 CRUD |
| `lib/ai-trends.ts` | 트렌드 데이터 조회 |
| `lib/youtube-api.ts` | YouTube RSS 파싱 |
| `lib/gemini-api.ts` | Gemini API 호출 |
| `lib/video-summarizer.ts` | 영상 요약 파이프라인 |
| `lib/email-trends.ts` | Nodemailer 이메일 |
| `lib/notion-trends.ts` | Notion API 연동 |

### Dynamic Rendering

모든 DB 의존 페이지는 `export const dynamic = "force-dynamic"` 설정 (빌드 시 DB 연결 불필요)

### Environment Variables

```env
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
NOTION_API_KEY=...
NOTION_DATABASE_ID=...
NOTION_TRENDS_API_KEY=...
NOTION_TRENDS_DB_ID=...
GMAIL_USER=...
GMAIL_APP_PASSWORD=...
```

## Deployment

GitHub Actions로 `main`/`develop` 브랜치 푸시 시 자동 배포:
1. Docker 이미지 빌드 (standalone 모드)
2. GCR 푸시
3. Cloud Run 배포 (asia-northeast3)
