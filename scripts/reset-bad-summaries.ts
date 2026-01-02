
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
                contains: "제시해주신"
            }
        }
    });

    if (count > 0) {
        console.log(`Resetting ${count} bad summaries...`);
        await prisma.trendNews.updateMany({
            where: {
                summary: {
                    contains: "제시해주신"
                }
            },
            data: {
                summary: null
            }
        });
    } else {
        console.log("No bad summaries found.");
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
