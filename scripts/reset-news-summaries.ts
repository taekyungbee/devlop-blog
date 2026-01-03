import fs from "fs";
import path from "path";

// Load .env manually
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, "utf-8");
    envConfig.split("\n").forEach((line) => {
        const idx = line.indexOf("=");
        if (idx !== -1) {
            const key = line.slice(0, idx).trim();
            let val = line.slice(idx + 1).trim();
            if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
                val = val.slice(1, -1);
            }
            process.env[key] = val;
        }
    });
}

async function main() {
    const { prisma } = await import("../src/lib/prisma");

    console.log("Resetting news summaries...");
    const result = await prisma.trendNews.updateMany({
        where: {
            NOT: {
                summary: null
            }
        },
        data: {
            summary: null,
        },
    });
    console.log(`Reset ${result.count} news summaries.`);
    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
