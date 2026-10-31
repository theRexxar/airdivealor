import { Queue } from "bullmq";
import { redis } from "./redis";

export const MEDIA_QUEUE = "media-processing";
export interface MediaJob {
  mediaId: number;
}

const g = globalThis as unknown as { __adaMediaQueue?: Queue<MediaJob> };

export const mediaQueue = () => (g.__adaMediaQueue ??= new Queue<MediaJob>(MEDIA_QUEUE, { connection: redis() }));

/** Queue processing for an uploaded file: 3 attempts with exponential backoff. */
export async function enqueueMedia(mediaId: number) {
  await mediaQueue().add("process", { mediaId }, { jobId: `media-${mediaId}-${Date.now()}`, attempts: 3, backoff: { type: "exponential", delay: 5000 }, removeOnComplete: 500, removeOnFail: 1000 });
}
