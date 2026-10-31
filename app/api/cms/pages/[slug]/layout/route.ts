import { eq } from "drizzle-orm";
import { z } from "zod";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { pageSections, requirePageDef } from "@/lib/server/page-service";
import { expirePage } from "@/lib/server/revalidate";

/** Reorder and show/hide sections. Applies to the live page right away. */
export const PUT = handle(async (req, ctx: { params: Promise<{ slug: string }> }) => {
  const { slug } = await ctx.params;
  const def = requirePageDef(slug);
  const me = await requireUser(`${slug}.layout`);
  const { sections } = await body(req, z.object({ sections: z.array(z.object({ key: z.string(), enabled: z.boolean() })) }));
  const movable = def.sections.filter((s) => !s.fixed).map((s) => s.key);
  const keys = sections.map((s) => s.key);
  if (keys.length !== movable.length || !movable.every((k) => keys.includes(k))) throw new HttpError(422, "Send every section exactly once.");
  const rows = await pageSections(slug);
  for (const [i, s] of sections.entries()) {
    const row = rows.find((r) => r.key === s.key);
    if (row) await db.update(schema.pageSections).set({ sort: (i + 1) * 10, enabled: s.enabled }).where(eq(schema.pageSections.id, row.id));
  }
  expirePage(slug);
  await audit(me.id, "page.layout_changed", slug, { order: keys, hidden: sections.filter((s) => !s.enabled).map((s) => s.key) });
  return ok({ ok: true });
});
