import { eq } from "drizzle-orm";
import { sectionEditPermission } from "@/lib/cms/permissions";
import { audit } from "@/lib/server/audit";
import { db, schema } from "@/lib/server/db";
import { homeSection } from "@/lib/server/home-service";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";

/** Throw away unpublished changes: the draft goes back to the live version. */
export const POST = handle(async (_req, ctx: { params: Promise<{ key: string }> }) => {
  const { key } = await ctx.params;
  const me = await requireUser(sectionEditPermission(key));
  const row = await homeSection(key);
  if (!row.published) throw new HttpError(409, "This section has never been published.");
  await db.update(schema.pageSections).set({ draft: row.published, draftUpdatedAt: new Date(), draftUpdatedBy: me.id }).where(eq(schema.pageSections.id, row.id));
  await audit(me.id, "home.draft_discarded", key);
  return ok({ ok: true });
});
