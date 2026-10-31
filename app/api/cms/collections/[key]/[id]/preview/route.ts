import { getItem } from "@/lib/server/collection-service";
import { handle, HttpError, ok, requireUser } from "@/lib/server/http";
import { publicSitePayload } from "@/lib/server/public-payload";

/** One item's draft rendered as the website would show it (dive sites only for now). */
export const GET = handle(async (_req, ctx: { params: Promise<{ key: string; id: string }> }) => {
  const { key, id } = await ctx.params;
  if (key !== "sites") throw new HttpError(404, "No preview for this collection.");
  await requireUser(`${key}.view`);
  const item = await getItem(key, Number(id));
  const data = await publicSitePayload(item.slug, { draft: true });
  if (!data) throw new HttpError(404, "Item not found.");
  return ok(data);
});
