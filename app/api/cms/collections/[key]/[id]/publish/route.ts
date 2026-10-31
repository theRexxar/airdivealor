import { eq } from "drizzle-orm";
import { audit } from "@/lib/server/audit";
import { getItem, validateItem } from "@/lib/server/collection-service";
import { db, schema } from "@/lib/server/db";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { expireCollection } from "@/lib/server/revalidate";

/** Put the draft on the website. */
export const POST = handle(async (_req, ctx: { params: Promise<{ key: string; id: string }> }) => {
  const { key, id } = await ctx.params;
  const me = await requireUser(`${key}.publish`);
  const r = await getItem(key, Number(id));
  if (r.published && JSON.stringify(r.draft) === JSON.stringify(r.published)) throw new HttpError(409, "There are no changes to publish.");
  const data = await validateItem(key, r.draft, r.id);
  await db.update(schema.collectionItems).set({ published: data, publishedAt: new Date(), publishedBy: me.id }).where(eq(schema.collectionItems.id, r.id));
  expireCollection(key);
  await audit(me.id, "item.published", `${key}/${data.slug}`);
  return ok({ ok: true });
});
