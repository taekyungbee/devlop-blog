
import { summarizeFromAudio } from '../src/lib/audio-analyzer';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function test() {
    const videoId = 'mmyuX3cv3CA';
    const videoTitle = 'Bye 2025, Hello 2026';

    console.log(`Testing audio analysis for ${videoId}...`);
    const summary = await summarizeFromAudio(videoId, videoTitle);

    if (summary) {
        console.log('SUCCESS!');
        console.log(summary);
    } else {
        console.log('FAILED.');
    }
}

test().catch(console.error);
