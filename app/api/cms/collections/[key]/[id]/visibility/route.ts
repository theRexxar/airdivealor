import { eq } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { getItem } from "@/lib/server/collection-service";
import { db, schema } from "@/lib/server/db";
import { body, handle, ok, requireUser } from "@/lib/server/http";
import { expireCollection } from "@/lib/server/revalidate";

/** Hide or show a published item on the website without unpublishing it. */
export const PUT = handle(async (req, ctx: { params: Promise<{ key: string; id: string }> }) => {
  const { key, id } = await ctx.params;
  const me = await requireUser(`${key}.publish`);
  const r = await getItem(key, Number(id));
  const { enabled } = await body(req, z.object({ enabled: z.boolean() }));
  await db.update(schema.collectionItems).set({ enabled }).where(eq(schema.collectionItems.id, r.id));
  expireCollection(key);
  await audit(me.id, enabled ? "item.shown" : "item.hidden", `${key}/${r.slug}`);
  return ok({ ok: true });
});
