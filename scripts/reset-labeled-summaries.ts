
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before Prisma client
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const count = await prisma.trendNews.count({
        where: {
            summary: {
                contains: "한 줄 핵심 요약"
            }
        }
    });

    if (count > 0) {
        console.log(`Resetting ${count} labeled summaries...`);
        await prisma.trendNews.updateMany({
            where: {
                summary: {
                    contains: "한 줄 핵심 요약"
                }
            },
            data: {
                summary: null
            }
        });
    } else {
        console.log("No labeled summaries found.");
    }
}

main()
    .catch(e => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
        await pool.end();
    })
