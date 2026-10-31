import { eq } from "drizzle-orm";
import { audit } from "@/lib/server/audit";
import { getItem } from "@/lib/server/collection-service";
import { db, schema } from "@/lib/server/db";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";

/** Throw away unpublished changes: the draft goes back to the live version. */
export const POST = handle(async (_req, ctx: { params: Promise<{ key: string; id: string }> }) => {
  const { key, id } = await ctx.params;
  const me = await requireUser(`${key}.edit`);
  const r = await getItem(key, Number(id));
  if (!r.published) throw new HttpError(409, "This item has never been published.");
  const slug = (r.published as { slug: string }).slug;
  await db.update(schema.collectionItems).set({ draft: r.published, slug, draftUpdatedAt: new Date(), draftUpdatedBy: me.id }).where(eq(schema.collectionItems.id, r.id));
  await audit(me.id, "item.draft_discarded", `${key}/${slug}`);
  return ok({ ok: true });
});
