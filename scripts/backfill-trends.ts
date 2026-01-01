import { updateAiTrends, seedChannels } from "../src/lib/ai-trends";

async function backfill() {
  console.log("=== Backfill Trends Data ===");
  console.log("Note: RSS feeds only provide recent data");
  console.log("- Google News: max 7 days");
  console.log("- YouTube: max ~15 videos per channel\n");

  await seedChannels();
  await updateAiTrends();
  
  console.log("\n=== Backfill Complete ===");
  process.exit(0);
}

backfill().catch(console.error);
