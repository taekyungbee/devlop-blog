/**
 * Gemini API Integration
 * 유튜브 영상 요약을 위한 API
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;

function getGenAI() {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return genAI;
}

export async function summarizeText(
  text: string,
  options: {
    title?: string;
    maxLength?: number;
    language?: "ko" | "en";
  } = {}
): Promise<string> {
  const { title, maxLength = 500, language = "ko" } = options;

  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = language === "ko"
    ? `다음은 유튜브 영상의 자막입니다. 핵심 내용을 ${maxLength}자 이내로 요약해주세요.
${title ? `영상 제목: ${title}\n` : ""}
요약 시 다음 형식을 따라주세요:
- 핵심 주제 (1줄)
- 주요 내용 (3-5개 bullet point)
- 결론/시사점 (1줄)

자막:
${text}`
    : `Summarize the following YouTube video transcript in ${maxLength} characters or less.
${title ? `Video title: ${title}\n` : ""}
Format:
- Main topic (1 line)
- Key points (3-5 bullet points)
- Conclusion (1 line)

Transcript:
${text}`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("[Gemini API] Summarization failed:", error);
    throw error;
  }
}

export async function summarizeVideoBatch(
  videos: { videoId: string; title: string; transcript: string }[]
): Promise<Map<string, string>> {
  const summaries = new Map<string, string>();

  for (const video of videos) {
    try {
      // 자막이 너무 길면 앞부분만 사용 (약 15000자 = Gemini 토큰 한도 고려)
      const truncatedTranscript = video.transcript.slice(0, 15000);

      const summary = await summarizeText(truncatedTranscript, {
        title: video.title,
        language: /[가-힣]/.test(video.title) ? "ko" : "en",
      });

      summaries.set(video.videoId, summary);

      // Rate limit 방지 (분당 15회 제한)
      await new Promise((r) => setTimeout(r, 4500));
    } catch (error) {
      console.error(`[Gemini API] Failed to summarize ${video.videoId}:`, error);
      summaries.set(video.videoId, "요약 생성 실패");
    }
  }

  return summaries;
}

export function isGeminiConfigured(): boolean {
  return !!GEMINI_API_KEY;
}

/**
 * 영상 정보만으로 요약 생성 (자막 없을 때 fallback)
 */
export async function summarizeFromVideoInfo(info: {
  title: string;
  description: string;
  channelName: string;
  duration: string;
}): Promise<string> {
  const ai = getGenAI();
  const model = ai.getGenerativeModel({ model: "gemini-2.0-flash" });

  const language = /[가-힣]/.test(info.title) ? "ko" : "en";

  const prompt = language === "ko"
    ? `다음 유튜브 영상의 제목과 설명을 바탕으로 영상 내용을 추론하여 요약해주세요.

영상 제목: ${info.title}
채널명: ${info.channelName}
영상 길이: ${info.duration}
영상 설명:
${info.description.slice(0, 2000)}

다음 형식으로 작성해주세요:
- 예상 주제 (1줄)
- 예상 주요 내용 (3-5개 bullet point)
- 시청 추천 대상 (1줄)

※ 자막을 가져올 수 없어 영상 정보 기반으로 추론한 요약입니다.`
    : `Based on the following YouTube video title and description, infer and summarize the video content.

Video Title: ${info.title}
Channel: ${info.channelName}
Duration: ${info.duration}
Description:
${info.description.slice(0, 2000)}

Format:
- Expected topic (1 line)
- Expected key points (3-5 bullet points)
- Recommended audience (1 line)

※ This is an inferred summary based on video info as captions were unavailable.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("[Gemini API] Video info summarization failed:", error);
    throw error;
  }
}
