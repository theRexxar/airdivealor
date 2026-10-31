import { eq } from "drizzle-orm";
import { z } from "zod";
import { schemaFor } from "@/lib/cms/fields";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { hasChanges, pageSections, requirePageDef } from "@/lib/server/page-service";
import { expirePage } from "@/lib/server/revalidate";

/** Publish the drafts of the given sections (or every section with changes) to the live site. */
export const POST = handle(async (req, ctx: { params: Promise<{ slug: string }> }) => {
  const { slug } = await ctx.params;
  const def = requirePageDef(slug);
  const me = await requireUser(`${slug}.publish`);
  const { keys } = await body(req, z.object({ keys: z.array(z.string()).optional() }));
  const rows = (await pageSections(slug)).filter((r) => hasChanges(r) && (!keys || keys.includes(r.key)));
  if (!rows.length) throw new HttpError(409, "There are no changes to publish.");
  for (const r of rows) {
    const s = def.sections.find((x) => x.key === r.key);
    if (!s || !schemaFor(s.fields).safeParse(r.draft).success) throw new HttpError(422, `The “${s?.label ?? r.key}” draft has errors. Open it, fix them and save before publishing.`);
  }
  const now = new Date();
  for (const r of rows) await db.update(schema.pageSections).set({ published: r.draft, publishedAt: now, publishedBy: me.id }).where(eq(schema.pageSections.id, r.id));
  expirePage(slug);
  await audit(me.id, "page.published", `${slug}: ${rows.map((r) => r.key).join(", ")}`);
  return ok({ published: rows.map((r) => r.key) });
});
