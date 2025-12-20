import cron from "node-cron";
import { updateAiTrends } from "./ai-trends";

export function initScheduler() {
    // Run every day at 00:00 (Midnight)
    cron.schedule("0 0 * * *", async () => {
        console.log("[Cron] Running daily AI Trends update...");
        await updateAiTrends();
    });

    console.log("[Scheduler] Initialized daily job at 00:00");
}
