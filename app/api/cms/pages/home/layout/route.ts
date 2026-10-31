import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { z } from "zod";
import { HOME_SECTIONS } from "@/lib/cms/home-sections";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { HOME_TAG, homeSections } from "@/lib/server/home-service";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";

/** Reorder and show/hide sections. Applies to the live page right away. */
export const PUT = handle(async (req) => {
  const me = await requireUser("home.layout");
  const { sections } = await body(req, z.object({ sections: z.array(z.object({ key: z.string(), enabled: z.boolean() })) }));
  const movable = HOME_SECTIONS.filter((s) => !s.fixed).map((s) => s.key);
  const keys = sections.map((s) => s.key);
  if (keys.length !== movable.length || !movable.every((k) => keys.includes(k))) throw new HttpError(422, "Send every section exactly once.");
  const rows = await homeSections();
  for (const [i, s] of sections.entries()) {
    const row = rows.find((r) => r.key === s.key)!;
    await db.update(schema.pageSections).set({ sort: (i + 1) * 10, enabled: s.enabled }).where(eq(schema.pageSections.id, row.id));
  }
  revalidateTag(HOME_TAG, { expire: 0 }); // expire now, so the next visitor gets the new content
  await audit(me.id, "home.layout_changed", "", { order: keys, hidden: sections.filter((s) => !s.enabled).map((s) => s.key) });
  return ok({ ok: true });
});
