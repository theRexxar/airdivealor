import { eq } from "drizzle-orm";
import { z } from "zod";
import { collectMediaIds, schemaFor } from "@/lib/cms/fields";
import { sectionEditPermission } from "@/lib/cms/permissions";
import { sectionDefOf } from "@/lib/cms/registry";
import { audit } from "@/lib/server/audit";
import { can } from "@/lib/server/auth";
import { db, schema } from "@/lib/server/db";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { resolveMedia } from "@/lib/server/media-service";
import { hasChanges, pageSection } from "@/lib/server/page-service";

type Ctx = { params: Promise<{ slug: string; key: string }> };

/** One section: draft and live values (field definitions come from the shared registry). */
export const GET = handle(async (_req, ctx: Ctx) => {
  const { slug, key } = await ctx.params;
  const me = await requireUser(`${slug}.view`);
  const row = await pageSection(slug, key);
  const def = sectionDefOf(slug, key)!;
  return ok({
    key,
    draft: row.draft,
    published: row.published,
    hasChanges: hasChanges(row),
    enabled: row.enabled,
    draftUpdatedAt: row.draftUpdatedAt,
    publishedAt: row.publishedAt,
    media: await resolveMedia(collectMediaIds(def.fields, row.draft)),
    canEdit: can(me, sectionEditPermission(slug, key)),
    canPublish: can(me, `${slug}.publish`),
  });
});

/** Save the draft. Not live until published. */
export const PUT = handle(async (req, ctx: Ctx) => {
  const { slug, key } = await ctx.params;
  const def = sectionDefOf(slug, key);
  if (!def) throw new HttpError(404, "Unknown section.");
  const me = await requireUser(sectionEditPermission(slug, key));
  const { content } = await body(req, z.object({ content: schemaFor(def.fields) }));
  const row = await pageSection(slug, key);
  await db.update(schema.pageSections).set({ draft: content, draftUpdatedAt: new Date(), draftUpdatedBy: me.id }).where(eq(schema.pageSections.id, row.id));
  await audit(me.id, "page.draft_saved", `${slug}/${key}`);
  return ok({ ok: true, hasChanges: JSON.stringify(content) !== JSON.stringify(row.published) });
});
