import { NextResponse } from "next/server";
import { publicSitePayload } from "@/lib/server/public-payload";

/** Public, read-only: one published dive site guide. 404 when the site is unpublished, hidden or unknown. */
export async function GET(_req: Request, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  try {
    const data = await publicSitePayload(slug);
    if (!data) return NextResponse.json({ error: "Dive site not found." }, { status: 404 });
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" } });
  } catch (e) {
    console.error(`public site api (${slug})`, e);
    return NextResponse.json({ error: "Content is unavailable." }, { status: 503 });
  }
}
