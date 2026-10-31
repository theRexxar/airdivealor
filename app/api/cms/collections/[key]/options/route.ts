import { collectionDef, itemTitle } from "@/lib/cms/registry";
import { listItems } from "@/lib/server/collection-service";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";

/** Items as {value, label} for pickers in other editors (e.g. the Home site picker). Any signed-in user. */
export const GET = handle(async (_req, ctx: { params: Promise<{ key: string }> }) => {
  const { key } = await ctx.params;
  const def = collectionDef(key);
  if (!def) throw new HttpError(404, "Unknown collection.");
  await requireUser();
  const rows = await listItems(key);
  return ok({
    options: rows.map((r) => {
      const d = r.draft as Record<string, unknown>;
      const live = !!r.published && r.enabled;
      return { value: r.slug, label: `${itemTitle(def, d) || r.slug}${live ? "" : r.published ? " (hidden)" : " (not published)"}` };
    }),
  });
});
