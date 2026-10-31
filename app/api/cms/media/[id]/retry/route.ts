import { eq } from "drizzle-orm";
import { db, schema } from "@/lib/server/db";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { enqueueMedia } from "@/lib/server/queue";

/** Queue a failed file for processing again. */
export const POST = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  await requireUser("media.upload");
  const m = await db.query.media.findFirst({ where: eq(schema.media.id, Number((await ctx.params).id)) });
  if (!m) throw new HttpError(404, "File not found.");
  if (m.status !== "failed") throw new HttpError(409, "Only failed files can be retried.");
  await db.update(schema.media).set({ status: "processing", error: null }).where(eq(schema.media.id, m.id));
  await enqueueMedia(m.id);
  return ok({ id: m.id, status: "processing" }, 202);
});
