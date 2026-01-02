
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

async function listModels() {
    if (!GEMINI_API_KEY) {
        console.error("GEMINI_API_KEY is not set");
        return;
    }
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    try {
        // The SDK might not have a direct "listModels" on the main class if it's the standard client.
        // Usually, listing models is done via a dedicated endpoint if using REST, 
        // but the SDK might expose it differently.
        // In many versions of the JS SDK, there isn't a direct listModels.
        // I'll try to use fetch if I can't find it.

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${GEMINI_API_KEY}`);
        const data = await response.json();
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
