import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { listItems, requireCollection } from "@/lib/server/collection-service";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { expireCollection } from "@/lib/server/revalidate";

/** Save a new order (all item ids, top to bottom). Applies to the website right away. */
export const PUT = handle(async (req, ctx: { params: Promise<{ key: string }> }) => {
  const { key } = await ctx.params;
  requireCollection(key);
  const me = await requireUser(`${key}.publish`);
  const { ids } = await body(req, z.object({ ids: z.array(z.number().int()) }));
  const rows = await listItems(key);
  if (ids.length !== rows.length || !rows.every((r) => ids.includes(r.id))) throw new HttpError(422, "Send every item exactly once.");
  for (const [i, id] of ids.entries()) await db.update(schema.collectionItems).set({ sort: (i + 1) * 10 }).where(and(eq(schema.collectionItems.collection, key), eq(schema.collectionItems.id, id)));
  expireCollection(key);
  await audit(me.id, "item.reordered", key);
  return ok({ ok: true });
});
