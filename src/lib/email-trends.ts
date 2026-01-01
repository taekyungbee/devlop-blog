/**
 * Email Trends Summary
 * AI Trends 요약을 이메일로 발송
 */

import nodemailer from "nodemailer";
import { prisma } from "./prisma";

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
    throw new Error("Gmail credentials not configured");
  }
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });
  }
  return transporter;
}

export function isEmailConfigured(): boolean {
  return !!(GMAIL_USER && GMAIL_APP_PASSWORD);
}

interface SummaryVideo {
  title: string;
  link: string;
  source: string;
  summary: string;
  pubDate: Date;
}

/**
 * HTML 이메일 템플릿 생성
 */
function generateEmailHtml(videos: SummaryVideo[], date: string): string {
  const videoItems = videos
    .map(
      (v) => `
    <div style="margin-bottom: 24px; padding: 16px; background: #f9f9f9; border-radius: 8px;">
      <h3 style="margin: 0 0 8px 0; font-size: 16px;">
        <a href="${v.link}" style="color: #1a73e8; text-decoration: none;">${v.title}</a>
      </h3>
      <p style="margin: 0 0 8px 0; color: #666; font-size: 13px;">
        <strong>${v.source}</strong> · ${new Date(v.pubDate).toLocaleDateString("ko-KR")}
      </p>
      <div style="margin: 0 0 12px 0; color: #333; font-size: 14px; line-height: 1.8;">
        ${v.summary.replace(/\n/g, "<br>")}
      </div>
      <a href="${v.link}" style="display: inline-block; padding: 8px 16px; background: #1a73e8; color: white; text-decoration: none; border-radius: 4px; font-size: 13px;">
        ▶️ 영상 보기
      </a>
    </div>
  `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="text-align: center; margin-bottom: 32px;">
    <h1 style="color: #333; font-size: 24px; margin: 0;">🤖 AI Trends Daily</h1>
    <p style="color: #666; font-size: 14px; margin: 8px 0 0 0;">${date} 요약</p>
  </div>

  <div style="margin-bottom: 24px;">
    <p style="color: #333; font-size: 14px;">
      오늘 <strong>${videos.length}개</strong>의 영상이 요약되었습니다.
    </p>
  </div>

  ${videoItems}

  <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #eee; text-align: center;">
    <p style="color: #999; font-size: 12px; margin: 0;">
      이 메일은 AI Trends 자동 요약 시스템에서 발송되었습니다.
    </p>
  </div>
</body>
</html>
  `;
}

/**
 * 최근 요약된 영상을 이메일로 발송
 */
export async function sendTrendsSummaryEmail(limit: number = 10): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn("[Email] Not configured");
    return false;
  }

  // 최근 요약된 영상 조회
  const videos = await prisma.trendVideo.findMany({
    where: {
      summary: {
        not: null,
        notIn: ["[자막 없음]", "[URL 파싱 실패]", "[요약 실패]"],
      },
    },
    orderBy: { pubDate: "desc" },
    take: limit,
    select: {
      title: true,
      link: true,
      source: true,
      summary: true,
      pubDate: true,
    },
  });

  if (videos.length === 0) {
    console.log("[Email] No videos to send");
    return true;
  }

  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const transport = getTransporter();

    await transport.sendMail({
      from: `"AI Trends" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `🤖 AI Trends Daily - ${dateStr} (${videos.length}개 영상)`,
      html: generateEmailHtml(
        videos.map((v) => ({ ...v, summary: v.summary! })),
        dateStr
      ),
    });

    console.log(`[Email] Sent summary email with ${videos.length} videos`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return false;
  }
}

/**
 * 테스트 이메일 발송
 */
export async function sendTestEmail(): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn("[Email] Not configured");
    return false;
  }

  try {
    const transport = getTransporter();

    await transport.sendMail({
      from: `"AI Trends" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: "🤖 AI Trends - 테스트 메일",
      html: `
        <div style="font-family: sans-serif; padding: 20px;">
          <h1>AI Trends 이메일 설정 완료!</h1>
          <p>이메일 발송이 정상적으로 작동합니다.</p>
        </div>
      `,
    });

    console.log("[Email] Test email sent");
    return true;
  } catch (error) {
    console.error("[Email] Test failed:", error);
    return false;
  }
}

/**
 * 샘플 데이터로 테스트 이메일 발송
 */
export async function sendTestEmailWithSample(): Promise<boolean> {
  if (!isEmailConfigured()) {
    console.warn("[Email] Not configured");
    return false;
  }

  const sampleVideos: SummaryVideo[] = [
    {
      title: "AI 시대 개발자 생존 전략 - 코딩을 넘어서",
      link: "https://www.youtube.com/watch?v=sample1",
      source: "조코딩 JoCoding",
      summary: `**핵심 주제**
AI가 코딩을 대체하는 시대, 개발자는 어떻게 살아남아야 하는가

**주요 내용**
• AI 도구 활용 능력이 핵심 역량으로 부상
• 문제 정의와 아키텍처 설계 능력의 중요성
• 도메인 전문성과 비즈니스 이해도가 차별화 포인트
• 커뮤니케이션과 협업 능력이 더욱 중요해짐

**결론**
코딩 스킬보다 문제 해결 능력과 AI 활용 능력을 키워야 한다.`,
      pubDate: new Date(),
    },
    {
      title: "Next.js 16 새로운 기능 총정리",
      link: "https://www.youtube.com/watch?v=sample2",
      source: "Web Dev Simplified",
      summary: `**핵심 주제**
Next.js 16의 주요 변경사항과 새로운 기능 소개

**주요 내용**
• Turbopack 정식 출시로 빌드 속도 대폭 개선
• Server Actions 안정화
• 새로운 캐싱 전략과 성능 최적화
• React 19 완벽 지원

**결론**
프로덕션 환경에서 Turbopack 사용이 권장된다.`,
      pubDate: new Date(),
    },
  ];

  const today = new Date();
  const dateStr = today.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  try {
    const transport = getTransporter();

    await transport.sendMail({
      from: `"AI Trends" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      subject: `🤖 AI Trends Daily - ${dateStr} (${sampleVideos.length}개 영상) [테스트]`,
      html: generateEmailHtml(sampleVideos, dateStr),
    });

    console.log(`[Email] Sent test email with ${sampleVideos.length} sample videos`);
    return true;
  } catch (error) {
    console.error("[Email] Failed to send test:", error);
    return false;
  }
}
