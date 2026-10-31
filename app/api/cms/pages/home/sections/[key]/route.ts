import { eq } from "drizzle-orm";
import { z } from "zod";
import { HOME_SCHEMAS, sectionDef } from "@/lib/cms/home-sections";
import { sectionEditPermission } from "@/lib/cms/permissions";
import { audit } from "@/lib/server/audit";
import { can } from "@/lib/server/auth";
import { db, schema } from "@/lib/server/db";
import { hasChanges, homeSection } from "@/lib/server/home-service";
import { body, handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { resolveMedia } from "@/lib/server/media-service";
import { collectMediaIds } from "@/lib/cms/fields";

type Ctx = { params: Promise<{ key: string }> };

/** One section: its field definition comes from the shared section list; this returns the draft and live values. */
export const GET = handle(async (_req, ctx: Ctx) => {
  const me = await requireUser("home.view");
  const { key } = await ctx.params;
  const row = await homeSection(key);
  const def = sectionDef(key)!;
  const ids = collectMediaIds(def.fields, row.draft);
  return ok({
    key,
    draft: row.draft,
    published: row.published,
    hasChanges: hasChanges(row),
    enabled: row.enabled,
    draftUpdatedAt: row.draftUpdatedAt,
    publishedAt: row.publishedAt,
    media: await resolveMedia(ids),
    canEdit: can(me, sectionEditPermission(key)),
    canPublish: can(me, "home.publish"),
  });
});

/** Save the draft. Not live until published. */
export const PUT = handle(async (req, ctx: Ctx) => {
  const { key } = await ctx.params;
  if (!sectionDef(key)) throw new HttpError(404, "Unknown section.");
  const me = await requireUser(sectionEditPermission(key));
  const { content } = await body(req, z.object({ content: HOME_SCHEMAS[key] }));
  const row = await homeSection(key);
  await db.update(schema.pageSections).set({ draft: content, draftUpdatedAt: new Date(), draftUpdatedBy: me.id }).where(eq(schema.pageSections.id, row.id));
  await audit(me.id, "home.draft_saved", key);
  return ok({ ok: true, hasChanges: JSON.stringify(content) !== JSON.stringify(row.published) });
});
