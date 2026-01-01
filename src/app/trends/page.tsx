import { getVideosPaginated, getNewsPaginated, getActiveChannels } from "@/lib/db";
import { Metadata } from "next";
import { TrendsClient } from "./trends-client";

export const metadata: Metadata = {
  title: "AI Trends - Dev Blog",
  description: "Daily updated AI news and videos from top creators",
};

export const dynamic = "force-dynamic";

export default async function TrendsPage() {
  const [initialVideos, initialNews, channels] = await Promise.all([
    getVideosPaginated(1, 20),
    getNewsPaginated(1, 20),
    getActiveChannels(),
  ]);

  return (
    <TrendsClient
      initialVideos={initialVideos}
      initialNews={initialNews}
      channels={channels}
    />
  );
}
