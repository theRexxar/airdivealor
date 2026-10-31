import type { Metadata } from "next";
import { getHome } from "@/lib/cms/fetch";
import { seoMetadata } from "@/lib/cms/seo";
import { HomeView } from "./_home/HomeView";

/** Rendered per request from the cached CMS API response (see lib/cms/fetch.ts). */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHome();
  return seoMetadata(data.content.seo, data.media, "/");
}

export default async function HomePage() {
  return <HomeView data={await getHome()} />;
}
