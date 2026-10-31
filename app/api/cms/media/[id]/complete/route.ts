import { eq } from "drizzle-orm";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { enqueueMedia } from "@/lib/server/queue";
import { headObject } from "@/lib/server/storage";

/** Step 2 of an upload: the browser finished sending the file, so check it arrived and queue processing. */
export const POST = handle(async (_req, ctx: { params: Promise<{ id: string }> }) => {
  const me = await requireUser("media.upload");
  const m = await db.query.media.findFirst({ where: eq(schema.media.id, Number((await ctx.params).id)) });
  if (!m) throw new HttpError(404, "File not found.");
  if (m.status !== "uploading") throw new HttpError(409, "This file was already received.");
  const head = await headObject(m.originalKey);
  if (!head) throw new HttpError(409, "The file didn't reach storage. Try the upload again.");
  if (head.ContentLength != null && head.ContentLength !== m.size) throw new HttpError(409, "The upload was incomplete. Try again.");
  await db.update(schema.media).set({ status: "processing" }).where(eq(schema.media.id, m.id));
  await enqueueMedia(m.id);
  await audit(me.id, "media.uploaded", m.originalName, { id: m.id });
  return ok({ id: m.id, status: "processing" }, 202);
});
