import { NextResponse } from "next/server";
import { pageDef } from "@/lib/cms/registry";
import { publicPagePayload } from "@/lib/server/public-payload";

/** Public, read-only: a published page with media URLs (and its dive sites). CDN-cacheable for a minute. */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!pageDef(slug)) return NextResponse.json({ error: "Unknown page." }, { status: 404 });
  try {
    return NextResponse.json(await publicPagePayload(slug), { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" } });
  } catch (e) {
    console.error(`public page api (${slug})`, e);
    return NextResponse.json({ error: "Content is unavailable." }, { status: 503 });
  }
}
