import Redis from "ioredis";

const DEFAULT_TTL = 300; // 5 min

let redis: Redis | null = null;

function getRedis(): Redis {
  if (!redis) {
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    redis = new Redis(url, {
      maxRetriesPerRequest: 2,
      lazyConnect: true,
      retryStrategy(times) {
        if (times > 3) return null;
        return Math.min(times * 200, 2000);
      },
    });

    redis.on("error", (err) => {
      console.warn("[cache] Redis error:", err.message);
    });
  }
  return redis;
}

export async function cacheGet<T>(key: string): Promise<T | null> {
  try {
    const data = await getRedis().get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (err) {
    console.warn("[cache] get failed:", (err as Error).message);
    return null;
  }
}

export async function cacheSet(
  key: string,
  data: unknown,
  ttl: number = DEFAULT_TTL,
): Promise<void> {
  try {
    await getRedis().set(key, JSON.stringify(data), "EX", ttl);
  } catch (err) {
    console.warn("[cache] set failed:", (err as Error).message);
  }
}

/**
 * Invalidate keys by pattern (e.g. "catalog:*").
 * Uses SCAN instead of KEYS to avoid blocking Redis.
 */
export async function cacheInvalidate(pattern: string): Promise<number> {
  try {
    const client = getRedis();
    let cursor = "0";
    let deleted = 0;

    do {
      const [next, keys] = await client.scan(cursor, "MATCH", pattern, "COUNT", 100);
      cursor = next;
      if (keys.length > 0) {
        await client.del(...keys);
        deleted += keys.length;
      }
    } while (cursor !== "0");

    return deleted;
  } catch (err) {
    console.warn("[cache] invalidate failed:", (err as Error).message);
    return 0;
  }
}
