import { eq } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { serializeMedia } from "@/lib/server/media-service";
import { deleteObjects } from "@/lib/server/storage";
import { homeSections } from "@/lib/server/home-service";

type Ctx = { params: Promise<{ id: string }> };

async function findMedia(ctx: Ctx) {
  const m = await db.query.media.findFirst({ where: eq(schema.media.id, Number((await ctx.params).id)) });
  if (!m) throw new HttpError(404, "File not found.");
  return m;
}

export const GET = handle(async (_req, ctx: Ctx) => {
  await requireUser("media.view");
  return ok(serializeMedia(await findMedia(ctx)));
});

/** Edit the alt text (both languages). */
export const PATCH = handle(async (req, ctx: Ctx) => {
  const me = await requireUser("media.upload");
  const m = await findMedia(ctx);
  const { alt } = await body(req, z.object({ alt: z.object({ en: z.string().trim().max(255), id: z.string().trim().max(255) }) }));
  await db.update(schema.media).set({ altEn: alt.en, altId: alt.id }).where(eq(schema.media.id, m.id));
  await audit(me.id, "media.updated", m.originalName, { id: m.id });
  return ok({ ok: true });
});

/** Delete a file. Refused while the Home page (draft or live) still uses it. */
export const DELETE = handle(async (_req, ctx: Ctx) => {
  const me = await requireUser("media.delete");
  const m = await findMedia(ctx);
  const used = (await homeSections()).filter((s) => JSON.stringify([s.draft, s.published]).includes(`"mediaId":${m.id}`)).map((s) => s.key);
  if (used.length) throw new HttpError(409, `This file is used on the Home page (${used.join(", ")}). Replace it there first.`);
  await deleteObjects([m.originalKey, ...(m.variants ?? []).map((v) => v.key), ...(m.posterKey ? [m.posterKey] : [])]);
  await db.delete(schema.media).where(eq(schema.media.id, m.id));
  await audit(me.id, "media.deleted", m.originalName, { id: m.id });
  return ok({ ok: true });
});
