import { eq } from "drizzle-orm";
import { audit } from "@/lib/server/audit";
import { getItem } from "@/lib/server/collection-service";
import { db, schema } from "@/lib/server/db";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { expireCollection } from "@/lib/server/revalidate";

/** Take an item off the website; it stays in the CMS as a draft. */
export const POST = handle(async (_req, ctx: { params: Promise<{ key: string; id: string }> }) => {
  const { key, id } = await ctx.params;
  const me = await requireUser(`${key}.publish`);
  const r = await getItem(key, Number(id));
  if (!r.published) throw new HttpError(409, "This item isn't published.");
  await db.update(schema.collectionItems).set({ published: null, publishedAt: null, publishedBy: null }).where(eq(schema.collectionItems.id, r.id));
  expireCollection(key);
  await audit(me.id, "item.unpublished", `${key}/${r.slug}`);
  return ok({ ok: true });
});
