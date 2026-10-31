import IORedis from "ioredis";
import { env } from "./env";

const g = globalThis as unknown as { __adaRedis?: IORedis };

/** Shared Redis connection (rate limits). BullMQ needs maxRetriesPerRequest: null. */
export function redis(): IORedis {
  return (g.__adaRedis ??= new IORedis(env.REDIS_URL, { maxRetriesPerRequest: null, lazyConnect: false }));
}
