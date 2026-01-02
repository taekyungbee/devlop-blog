import 'dotenv/config';
import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'set' : 'not set');

  // 기존 포스트에 category 설정 (모두 frontend로 설정)
  const result = await prisma.post.updateMany({
    where: {
      category: null,
    },
    data: {
      category: 'frontend',
    },
  });

  console.log(`Updated ${result.count} posts with category: frontend`);

  // 확인
  const posts = await prisma.post.findMany({
    select: {
      slug: true,
      title: true,
      category: true,
    },
  });

  console.log('\nCurrent posts:');
  posts.forEach((post) => {
    console.log(`  - ${post.slug}: ${post.category}`);
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
