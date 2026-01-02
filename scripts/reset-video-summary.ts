
import { prisma } from '../src/lib/prisma';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function main() {
    const video = await prisma.trendVideo.findFirst({
        where: { title: { contains: 'Bye 2025, Hello 2026' } }
    });

    if (video) {
        console.log(`Resetting summary for video ID: ${video.id} (${video.title})`);
        await prisma.trendVideo.update({
            where: { id: video.id },
            data: { summary: null }
        });
        console.log('Summary reset successfully.');
    } else {
        console.log('Video not found.');
    }
}

main().catch(console.error).finally(() => prisma.$disconnect());
