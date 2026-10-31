import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { HOME_SCHEMAS } from "@/lib/cms/home-sections";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { hasChanges, HOME_TAG, homeSections } from "@/lib/server/home-service";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";

/** Publish the drafts of the given sections (or every section with changes) to the live site. */
export const POST = handle(async (req) => {
  const me = await requireUser("home.publish");
  const { keys } = await body(req, z.object({ keys: z.array(z.string()).optional() }));
  const rows = (await homeSections()).filter((r) => hasChanges(r) && (!keys || keys.includes(r.key)));
  if (!rows.length) throw new HttpError(409, "There are no changes to publish.");
  for (const r of rows) {
    const check = HOME_SCHEMAS[r.key]?.safeParse(r.draft);
    if (!check?.success) throw new HttpError(422, `The “${r.key}” draft has errors. Open it, fix them and save before publishing.`);
  }
  const now = new Date();
  for (const r of rows) await db.update(schema.pageSections).set({ published: r.draft, publishedAt: now, publishedBy: me.id }).where(eq(schema.pageSections.id, r.id));
  revalidateTag(HOME_TAG, { expire: 0 }); // expire now, so the next visitor gets the new content
  await audit(me.id, "home.published", rows.map((r) => r.key).join(", "));
  return ok({ published: rows.map((r) => r.key) });
});
