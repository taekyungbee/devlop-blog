import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool, PoolConfig } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getPoolConfig(): PoolConfig {
  // DATABASE_URL이 있으면 사용 (Cloud Run 등)
  if (process.env.DATABASE_URL) {
    return { connectionString: process.env.DATABASE_URL };
  }

  // 분리된 환경변수 사용 (특수문자 비밀번호 지원)
  return {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  };
}

function createPrismaClient() {
  const pool = new Pool(getPoolConfig());
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export type { Post, Tag, Series, PostTag, TrendVideo, TrendNews, YouTubeChannel } from "../generated/prisma/client";
