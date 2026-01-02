import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    // Dynamically import dependencies to ensure env vars are loaded first
    const { prisma } = await import('../src/lib/prisma');
    const { translateToKorean } = await import('../src/lib/gemini-api');

    console.log('Starting summary translation...');

    const videos = await prisma.trendVideo.findMany({
        where: {
            summary: {
                not: null,
            },
        },
    });

    console.log(`Found ${videos.length} videos with summaries.`);

    let successCount = 0;
    let failCount = 0;

    for (const video of videos) {
        if (!video.summary) continue;

        console.log(`Processing video: ${video.title} (ID: ${video.id})`);

        try {
            const hasHangul = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(video.summary);

            if (hasHangul) {
                console.log(`  - Detected Hangul. Checking if translation needed...`);
            }

            const translated = await translateToKorean(video.summary);

            if (translated !== video.summary) {
                await prisma.trendVideo.update({
                    where: { id: video.id },
                    data: { summary: translated },
                });
                console.log(`  - Updated summary for ID ${video.id}`);
                successCount++;
            } else {
                console.log(`  - No change for ID ${video.id}`);
            }

            // Delay to avoid hitting rate limits too hard if sequential
            await new Promise((resolve) => setTimeout(resolve, 1000));

        } catch (error) {
            console.error(`  - Failed to translate ID ${video.id}:`, error);
            failCount++;
        }
    }

    console.log('-----------------------------------');
    console.log(`Translation complete.`);
    console.log(`Updated: ${successCount}`);
    console.log(`Failed: ${failCount}`);
    console.log(`Total Scanned: ${videos.length}`);

    // Explicit disconnect if possible, but prisma is local. 
    // We can just exit.
    await prisma.$disconnect();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    });
