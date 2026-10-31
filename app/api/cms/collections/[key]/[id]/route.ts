import { eq } from "drizzle-orm";
import { z } from "zod";
import { collectMediaIds } from "@/lib/cms/fields";
import { audit } from "@/lib/server/audit";
import { can } from "@/lib/server/auth";
import { getItem, itemStatus, itemUsers, requireCollection, validateItem } from "@/lib/server/collection-service";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { resolveMedia } from "@/lib/server/media-service";
import { expireCollection } from "@/lib/server/revalidate";

type Ctx = { params: Promise<{ key: string; id: string }> };

export const GET = handle(async (_req, ctx: Ctx) => {
  const { key, id } = await ctx.params;
  const def = requireCollection(key);
  const me = await requireUser(`${key}.view`);
  const r = await getItem(key, Number(id));
  return ok({
    id: r.id,
    draft: r.draft,
    published: r.published,
    status: itemStatus(r),
    enabled: r.enabled,
    draftUpdatedAt: r.draftUpdatedAt,
    publishedAt: r.publishedAt,
    media: await resolveMedia(collectMediaIds(def.fields, r.draft)),
    can: { edit: can(me, `${key}.edit`), publish: can(me, `${key}.publish`), delete: can(me, `${key}.delete`) },
  });
});

/** Save the draft. */
export const PUT = handle(async (req, ctx: Ctx) => {
  const { key, id } = await ctx.params;
  const me = await requireUser(`${key}.edit`);
  const r = await getItem(key, Number(id));
  const { content } = await body(req, z.object({ content: z.unknown() }));
  const data = await validateItem(key, content, r.id);
  await db.update(schema.collectionItems).set({ draft: data, slug: data.slug, draftUpdatedAt: new Date(), draftUpdatedBy: me.id }).where(eq(schema.collectionItems.id, r.id));
  await audit(me.id, "item.draft_saved", `${key}/${data.slug}`);
  return ok({ ok: true });
});

/** Delete an item. Refused while a page still points to it (e.g. the Home site picker). */
export const DELETE = handle(async (_req, ctx: Ctx) => {
  const { key, id } = await ctx.params;
  const me = await requireUser(`${key}.delete`);
  const r = await getItem(key, Number(id));
  const users = await itemUsers(key, r.slug);
  if (users.length) throw new HttpError(409, `This item is still used on: ${users.join(", ")}. Remove it there first.`);
  await db.delete(schema.collectionItems).where(eq(schema.collectionItems.id, r.id));
  if (r.published) expireCollection(key);
  await audit(me.id, "item.deleted", `${key}/${r.slug}`);
  return ok({ ok: true });
});
