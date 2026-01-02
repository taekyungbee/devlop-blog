
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
    const count = await prisma.trendVideo.count({
        where: {
            summary: {
                contains: "핵심 주제"
            }
        }
    });

    if (count > 0) {
        console.log(`Resetting ${count} labeled video summaries...`);
        await prisma.trendVideo.updateMany({
            where: {
                summary: {
                    contains: "핵심 주제"
                }
            },
            data: {
                summary: null
            }
        });
    } else {
        console.log("No labeled video summaries found.");
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
