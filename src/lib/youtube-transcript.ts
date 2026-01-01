/**
 * YouTube Transcript Extraction
 * YouTube 페이지에서 직접 자막 추출
 */

/**
 * YouTube 페이지에서 자막 URL 추출
 */
async function getCaptionUrl(videoId: string): Promise<string | null> {
  try {
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
      },
    });

    if (!response.ok) {
      console.log(`[Transcript] YouTube page error ${response.status} for ${videoId}`);
      return null;
    }

    const html = await response.text();

    // captionTracks JSON 추출
    const captionMatch = html.match(/"captionTracks":(\[.*?\])/);
    if (!captionMatch) {
      console.log(`[Transcript] No caption tracks found for ${videoId}`);
      return null;
    }

    const captionTracks = JSON.parse(captionMatch[1]);
    if (!captionTracks || captionTracks.length === 0) {
      return null;
    }

    // 한국어 우선, 없으면 영어
    let track = captionTracks.find(
      (t: { languageCode: string }) =>
        t.languageCode === "ko" || t.languageCode === "ko-KR"
    );
    if (!track) {
      track = captionTracks.find(
        (t: { languageCode: string }) =>
          t.languageCode === "en" || t.languageCode.startsWith("en")
      );
    }
    if (!track) {
      track = captionTracks[0];
    }

    console.log(`[Transcript] Found ${track.languageCode} captions for ${videoId}`);
    return track.baseUrl;
  } catch (error) {
    console.log(`[Transcript] Error getting caption URL for ${videoId}:`, error);
    return null;
  }
}

/**
 * 자막 XML 파싱
 */
function parseTranscriptXml(xml: string): string {
  const regex = /<text[^>]*>([^<]*)<\/text>/g;
  const texts: string[] = [];
  let match;

  while ((match = regex.exec(xml)) !== null) {
    let text = match[1];
    text = text
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/\\n/g, " ")
      .replace(/\n/g, " ")
      .trim();
    if (text.length > 0) {
      texts.push(text);
    }
  }

  return texts.join(" ");
}

/**
 * 유튜브 영상 ID로 자막 추출
 */
export async function getTranscript(videoId: string): Promise<string | null> {
  try {
    const captionUrl = await getCaptionUrl(videoId);
    if (!captionUrl) {
      return null;
    }

    const response = await fetch(captionUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        Accept: "text/xml, application/xml, */*",
      },
    });

    if (!response.ok) {
      console.log(`[Transcript] Caption fetch error ${response.status} for ${videoId}`);
      return null;
    }

    const xml = await response.text();
    const transcript = parseTranscriptXml(xml);

    if (transcript.length > 0) {
      console.log(`[Transcript] Got ${transcript.length} chars for ${videoId}`);
      return transcript;
    }

    console.log(`[Transcript] Empty transcript for ${videoId}`);
    return null;
  } catch (error) {
    console.log(`[Transcript] Error for ${videoId}:`, error);
    return null;
  }
}

/**
 * 여러 영상의 자막 일괄 추출
 */
export async function getTranscriptBatch(
  videoIds: string[]
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  for (const videoId of videoIds) {
    const transcript = await getTranscript(videoId);
    results.set(videoId, transcript);

    // Rate limit 방지
    await new Promise((r) => setTimeout(r, 2000));
  }

  return results;
}

/**
 * 유튜브 URL에서 video ID 추출
 */
export function extractVideoId(url: string): string | null {
  const patterns = [
    /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/,
    /youtu\.be\/([a-zA-Z0-9_-]+)/,
    /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return null;
}
