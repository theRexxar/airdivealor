import { itemTitle } from "@/lib/cms/registry";
import { inArray, sql } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { can } from "@/lib/server/auth";
import { itemStatus, listItems, requireCollection, validateItem } from "@/lib/server/collection-service";
import { db, schema } from "@/lib/server/db";
import { body, handle, ok, requireUser } from "@/lib/server/http";
import { resolveMedia } from "@/lib/server/media-service";
import type { MediaRef } from "@/lib/cms/fields";

type Ctx = { params: Promise<{ key: string }> };

/** All items with status, for the CMS list (drafts and hidden items included). */
export const GET = handle(async (_req, ctx: Ctx) => {
  const { key } = await ctx.params;
  const def = requireCollection(key);
  const me = await requireUser(`${key}.view`);
  const rows = await listItems(key);
  const photoIds = new Set<number>();
  for (const r of rows) {
    const id = ((r.draft as Record<string, unknown>).photo as MediaRef | undefined)?.mediaId;
    if (id) photoIds.add(id);
  }
  const media = await resolveMedia(photoIds);
  const userIds = [...new Set(rows.map((r) => r.draftUpdatedBy).filter((x): x is number => !!x))];
  const people = userIds.length ? await db.select({ id: schema.users.id, name: schema.users.name }).from(schema.users).where(inArray(schema.users.id, userIds)) : [];
  return ok({
    collection: { key: def.key, label: def.label, itemLabel: def.itemLabel, description: def.description },
    items: rows.map((r) => {
      const d = r.draft as Record<string, unknown>;
      const photo = d.photo as MediaRef | undefined;
      const thumb = photo?.mediaId ? media[photo.mediaId]?.url : photo?.url;
      return {
        id: r.id,
        slug: r.slug,
        title: itemTitle(def, d) || r.slug,
        thumb: thumb || null,
        status: itemStatus(r),
        enabled: r.enabled,
        draftUpdatedAt: r.draftUpdatedAt,
        draftUpdatedBy: people.find((p) => p.id === r.draftUpdatedBy)?.name ?? null,
        publishedAt: r.publishedAt,
      };
    }),
    can: { edit: can(me, `${key}.edit`), publish: can(me, `${key}.publish`), delete: can(me, `${key}.delete`) },
  });
});

/** Create a new item as a draft (not on the website until published). It goes to the end of the list. */
export const POST = handle(async (req, ctx: Ctx) => {
  const { key } = await ctx.params;
  requireCollection(key);
  const me = await requireUser(`${key}.edit`);
  const { content } = await body(req, z.object({ content: z.unknown() }));
  const data = await validateItem(key, content);
  const [{ max }] = await db.select({ max: sql<number>`coalesce(max(${schema.collectionItems.sort}), 0)` }).from(schema.collectionItems).where(sql`${schema.collectionItems.collection} = ${key}`);
  const [res] = await db.insert(schema.collectionItems).values({ collection: key, slug: data.slug, sort: Number(max) + 10, draft: data, draftUpdatedAt: new Date(), draftUpdatedBy: me.id });
  await audit(me.id, "item.created", `${key}/${data.slug}`);
  return ok({ id: res.insertId }, 201);
});
