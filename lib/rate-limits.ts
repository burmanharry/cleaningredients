import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 10 requests / minute per IP; burst 5
export const uploadLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  ephemeralCache: new Map(), // speeds up in Vercel edge
  analytics: true,
});

export async function limitByIp(ip: string | null | undefined) {
  const key = `coa:upload:${ip ?? "unknown"}`;
  return uploadLimiter.limit(key);
}
