import { handle, ok, requireUser } from "@/lib/server/http";
import { publicPagePayload } from "@/lib/server/public-payload";

/** A page with its unpublished drafts (and draft dive sites), for the CMS preview. */
export const GET = handle(async (_req, ctx: { params: Promise<{ slug: string }> }) => {
  const { slug } = await ctx.params;
  await requireUser(`${slug}.view`);
  return ok(await publicPagePayload(slug, { draft: true }));
});
