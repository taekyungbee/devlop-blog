import Parser from "rss-parser";
import { getVideosFromDb, getNewsFromDb, saveVideos, saveNews, DbTrendItem } from "./db";

export type TrendItem = DbTrendItem;

export interface AiTrends {
    videos: TrendItem[];
    news: TrendItem[];
}

const parser = new Parser();

// YouTube Channel IDs
const YOUTUBE_CHANNELS = [
    { id: "UCBFxh_9Tr_J-u7RcYvrJ0Kg", name: "Two Minute Papers" },
    { id: "UCxgknM36W5jYZk6QY_194_g", name: "OpenAI" },
];

const SEED_VIDEOS: TrendItem[] = [
    {
        title: "Google Gemini의 '나노 바나나' 실용 활용 사례 Top 10 (+프롬프트 공개)",
        link: "https://www.youtube.com/watch?v=s_q_M5_J3hU",
        pubDate: "2025-12-20T18:00:00Z",
        source: "조코딩 JoCoding",
        thumbnail: "https://img.youtube.com/vi/s_q_M5_J3hU/mqdefault.jpg",
    },
    {
        title: "진정한 자동화의 시작... 클로드의 능력을 극대화하면 벌어지는 일",
        link: "https://www.youtube.com/watch?v=HK6y8DAPN_0",
        pubDate: "2025-12-20T09:00:00Z",
        source: "앤드플랜 AndPlan",
        thumbnail: "https://img.youtube.com/vi/HK6y8DAPN_0/mqdefault.jpg",
    },
    {
        title: "AI 에이전트 + 워크플로우 + 브라우저? FlowithOS 딥다이브",
        link: "https://www.youtube.com/watch?v=kYJjZkI5M3M",
        pubDate: "2025-12-19T14:00:00Z",
        source: "단테랩스 Dante Labs",
        thumbnail: "https://img.youtube.com/vi/kYJjZkI5M3M/mqdefault.jpg",
    },
    {
        title: "AI를 활용할 때 반드시 지킬 2가지 원칙 (자동화 기초)",
        link: "https://www.youtube.com/watch?v=yqTAXAXgTPHI",
        pubDate: "2025-12-03T10:00:00Z",
        source: "그랜트 Grant",
        thumbnail: "https://img.youtube.com/vi/yqTAXAXgTPHI/mqdefault.jpg",
    },
    {
        title: "[2026 로드맵] 12월 21일, 지금 당장 시작해야 할 개발 공부 순서",
        link: "https://www.youtube.com/watch?v=YP1K6W6Yq-Q",
        pubDate: "2025-12-21T08:00:00Z",
        source: "노마드 코더 Nomad Coders",
        thumbnail: "https://img.youtube.com/vi/YP1K6W6Yq-Q/mqdefault.jpg",
    },
    {
        title: "현직 개발팀장이 알려주는 클로드 코딩 노하우 (feat. 수지아빠)",
        link: "https://www.youtube.com/watch?v=TirDOyeur0lcc",
        pubDate: "2025-11-01T15:30:00Z",
        source: "수지아빠",
        thumbnail: "https://img.youtube.com/vi/TirDOyeur0lcc/mqdefault.jpg",
    },
    {
        title: "개발자를 위한 차세대 AI 검색 엔진 'Perplexity 4.0' 리뷰",
        link: "https://www.youtube.com/watch?v=F3x9Q5g6l7s",
        pubDate: "2025-12-18T11:00:00Z",
        source: "시민개발자 구씨",
        thumbnail: "https://img.youtube.com/vi/F3x9Q5g6l7s/mqdefault.jpg",
    },
    {
        title: "플러터 4.0 업데이트 총정리! 이제 진짜 네이티브 성능?",
        link: "https://www.youtube.com/watch?v=Z3x8_4G5H9I",
        pubDate: "2025-12-17T20:00:00Z",
        source: "코드팩토리",
        thumbnail: "https://img.youtube.com/vi/Z3x8_4G5H9I/mqdefault.jpg",
    },
    {
        title: "Git & GitHub, 2026년에는 이렇게 바뀝니다 (AI 기능 탑재)",
        link: "https://www.youtube.com/watch?v=1I3hMwQU6GU",
        pubDate: "2025-12-15T13:00:00Z",
        source: "얄팍한 코딩사전",
        thumbnail: "https://img.youtube.com/vi/1I3hMwQU6GU/mqdefault.jpg",
    },
    {
        title: "웹 4.0의 서막, 탈중앙화 AI와 블록체인의 결합",
        link: "https://www.youtube.com/watch?v=tZooW6PritE",
        pubDate: "2025-12-10T09:00:00Z",
        source: "생활코딩",
        thumbnail: "https://img.youtube.com/vi/tZooW6PritE/mqdefault.jpg",
    },
    {
        title: "AI 뉴스 - GPT-6 루머와 오픈AI의 새로운 행보",
        link: "https://www.youtube.com/watch?v=yYfG-fR9A7M",
        pubDate: "2025-12-21T07:00:00Z",
        source: "Metics Media | 한국어",
        thumbnail: "https://img.youtube.com/vi/yYfG-fR9A7M/mqdefault.jpg",
    },
    {
        title: "나도코딩의 파이썬 심화: AI 에이전트 만들기 실전",
        link: "https://www.youtube.com/watch?v=kWiCuklohdY",
        pubDate: "2025-12-16T18:00:00Z",
        source: "나도코딩",
        thumbnail: "https://img.youtube.com/vi/kWiCuklohdY/mqdefault.jpg",
    }
];

const SEED_NEWS: TrendItem[] = [
    {
        title: "정부, 2026년까지 AI 인재 10만 양성 계획 발표",
        link: "https://news.google.com",
        pubDate: "2025-12-20T10:00:00Z",
        source: "대한민국 정책브리핑",
    },
    {
        title: "삼성전자, 차세대 AI 반도체 '마하-3' 공개 임박",
        link: "https://news.google.com",
        pubDate: "2025-12-19T14:30:00Z",
        source: "전자신문",
    },
    {
        title: "네이버, 한국형 LLM '하이퍼클로바Z 2.0' 글로벌 진출",
        link: "https://news.google.com",
        pubDate: "2025-12-18T09:15:00Z",
        source: "IT조선",
    },
    {
        title: "카카오, AI 비서 '카나나' 월간 사용자 1000만 돌파",
        link: "https://news.google.com",
        pubDate: "2025-12-21T11:00:00Z",
        source: "테크M",
    },
    {
        title: "[단독] LG AI연구원, 신물질 발견 AI 모델 '엑사원 디스커버리' 성과",
        link: "https://news.google.com",
        pubDate: "2025-12-17T16:45:00Z",
        source: "매일경제",
    }
];

export async function updateAiTrends() {
    console.log("[Scheduler] Starting AI Trends update...");
    const videos: TrendItem[] = [];
    const news: TrendItem[] = [];

    // 1. Fetch YouTube
    try {
        for (const channel of YOUTUBE_CHANNELS) {
            const feed = await parser.parseURL(
                `https://www.youtube.com/feeds/videos.xml?channel_id=${channel.id}`
            );

            feed.items.slice(0, 5).forEach((item) => {
                const videoId = item.id.replace("yt:video:", "");
                videos.push({
                    title: item.title || "No Title",
                    link: item.link || "#",
                    pubDate: item.pubDate || new Date().toISOString(),
                    source: channel.name,
                    thumbnail: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
                });
            });
        }
    } catch (error) {
        console.error("[Scheduler] YouTube fetch failed, using fallback/seed logic partly if needed", error);
    }

    // Always insert Seed Data if they are deeper in history or separate
    // For now, let's just merge seed data to ensure we have content
    videos.push(...SEED_VIDEOS);


    // 2. Fetch News
    try {
        const feed = await parser.parseURL(
            "https://news.google.com/rss/search?q=인공지능+when:7d&hl=ko&gl=KR&ceid=KR:ko"
        );
        feed.items.slice(0, 10).forEach((item) => {
            news.push({
                title: item.title || "No Title",
                link: item.link || "#",
                pubDate: item.pubDate || new Date().toISOString(),
                source: item.source || "Google News",
            });
        });
    } catch (error) {
        console.error("[Scheduler] News fetch failed", error);
    }

    news.push(...SEED_NEWS);

    // Save to DB
    saveVideos(videos);
    saveNews(news);
    console.log(`[Scheduler] Updated ${videos.length} videos and ${news.length} news items.`);
}

export async function getAiTrends(): Promise<AiTrends> {
    let videos = getVideosFromDb(20);
    let news = getNewsFromDb(20);

    // If DB is empty, trigger an update immediately (first run)
    if (videos.length === 0 && news.length === 0) {
        console.log("[DB] Empty, triggering initial update...");
        await updateAiTrends();
        videos = getVideosFromDb(20);
        news = getNewsFromDb(20);
    }

    return { videos, news };
}
