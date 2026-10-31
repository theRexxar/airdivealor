import { NextResponse } from "next/server";
import { publishedHome } from "@/lib/server/home-service";

/**
 * Public, read-only: the published Home page content with media URLs.
 * The website's Home page reads this; it is also cacheable by a CDN for one minute.
 */
export async function GET() {
  try {
    const data = await publishedHome();
    return NextResponse.json(data, { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=600" } });
  } catch (e) {
    console.error("public home api", e);
    return NextResponse.json({ error: "Content is unavailable." }, { status: 503 });
  }
}
